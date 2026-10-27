import request from "supertest";
import { createApp } from "../../src/app.ts";
import { userModel } from "../../src/models/user-model.ts";
import { promptModel } from "../../src/models/prompt-model.ts";
import { connectTestDb, clearTestDb, closeTestDb } from "../helpers/db.ts";

const app = createApp();

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe("Prompts Sync Route (/api/prompts/sync)", () => {
  const user = {
    email: "syncuser@example.com",
    password: "Password1!",
  };

  const getAuthToken = async () => {
    await request(app).post("/api/auth/register").send(user);
    const loginRes = await request(app).post("/api/auth/login").send(user);
    return loginRes.body.accessToken;
  };

  it("should return 401 when token is missing", async () => {
    const res = await request(app).post("/api/prompts/sync").send({});
    expect(res.status).toBe(401);
  });

  it("should return 400 when sync payload is invalid", async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({
        created: [{ title: "" }], // Missing body and title is empty
      });

    expect(res.status).toBe(400);
  });

  it("should batch create prompts and map clientTempId to serverId", async () => {
    const token = await getAuthToken();
    const clientTempId = "temp-uuid-12345";

    const res = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lastSyncTimestamp: null,
        created: [
          {
            clientTempId,
            title: "Senior Code Reviewer",
            body: "Act as a Senior Software Engineer...",
            tags: ["development", "review"],
            icon: "code",
            access: "private",
          },
        ],
        updated: [],
        deletedIds: [],
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("applied");
    expect(res.body.applied.created).toHaveLength(1);
    expect(res.body.applied.created[0]).toHaveProperty(
      "clientTempId",
      clientTempId,
    );
    expect(res.body.applied.created[0]).toHaveProperty("serverId");

    const serverId = res.body.applied.created[0].serverId;
    const dbPrompt = await promptModel.findById(serverId);
    expect(dbPrompt).not.toBeNull();
    expect(dbPrompt?.title).toBe("Senior Code Reviewer");
    expect(dbPrompt?.clientTempId).toBe(clientTempId);

    const dbUser = await userModel.findOne({ email: user.email });
    expect(dbUser?.prompts).toContainEqual(dbPrompt?._id);
  });

  it("should update prompt when client has newer updatedAt (Last-Write-Wins)", async () => {
    const token = await getAuthToken();

    // 1. Create a prompt on the server
    const createRes = await request(app)
      .post("/api/prompts/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Old Title",
        body: "Old Body",
        tags: ["v1"],
      });
    expect(createRes.status).toBe(201);

    const dbUser = await userModel.findOne({ email: user.email });
    const promptId = dbUser!.prompts![0]!.toString();

    // 2. Sync with newer updatedAt
    const clientNewDate = new Date(Date.now() + 60000).toISOString();
    const syncRes = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({
        updated: [
          {
            promptId,
            title: "New Title via Sync",
            body: "Updated Body via Sync",
            tags: ["v2", "sync"],
            updatedAt: clientNewDate,
          },
        ],
      });

    expect(syncRes.status).toBe(200);
    expect(syncRes.body.applied.updated).toContain(promptId);

    const updatedPrompt = await promptModel.findById(promptId);
    expect(updatedPrompt?.title).toBe("New Title via Sync");
    expect(updatedPrompt?.body).toBe("Updated Body via Sync");
    expect(updatedPrompt?.tags).toEqual(["v2", "sync"]);
  });

  it("should soft delete prompts listed in deletedIds", async () => {
    const token = await getAuthToken();

    // Create a prompt
    const createRes = await request(app)
      .post("/api/prompts/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "To Be Deleted",
        body: "Content",
        tags: ["temp"],
      });
    expect(createRes.status).toBe(201);

    const getInitial = await request(app)
      .get("/api/prompts")
      .set("Authorization", `Bearer ${token}`);
    expect(getInitial.body.prompts).toHaveLength(1);
    const promptId = getInitial.body.prompts[0]._id;

    const syncRes = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({
        deletedIds: [promptId],
      });

    expect(syncRes.status).toBe(200);
    expect(syncRes.body.applied.deleted).toContain(promptId);

    const deletedPrompt = await promptModel.findById(promptId);
    expect(deletedPrompt?.deletedAt).not.toBeNull();

    // Verify it is excluded from GET /api/prompts
    const getRes = await request(app)
      .get("/api/prompts")
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.body.prompts).toHaveLength(0);
  });

  it("should return serverChanges occurring after lastSyncTimestamp", async () => {
    const token = await getAuthToken();
    const pastTimestamp = new Date(Date.now() - 100000).toISOString();

    // Create a prompt on the server
    const createRes = await request(app)
      .post("/api/prompts/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Server Modified Prompt",
        body: "Server Content",
        tags: ["sync-test"],
      });
    expect(createRes.status).toBe(201);

    const syncRes = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lastSyncTimestamp: pastTimestamp,
        created: [],
        updated: [],
        deletedIds: [],
      });

    expect(syncRes.status).toBe(200);
    expect(syncRes.body.serverChanges.prompts).toHaveLength(1);
    expect(syncRes.body.serverChanges.prompts[0].title).toBe(
      "Server Modified Prompt",
    );
  });

  it("should return offline-created prompts in serverChanges when uploaded after another device cursor", async () => {
    const token = await getAuthToken();
    const deviceBCursor = new Date().toISOString();

    // Device A uploads an offline prompt with createdAt and updatedAt in the past (e.g. yesterday)
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const syncResA = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({
        created: [
          {
            clientTempId: "temp-yesterday-1",
            title: "Offline Prompt from Yesterday",
            body: "Created offline yesterday",
            createdAt: yesterday,
            updatedAt: yesterday,
          },
        ],
      });
    expect(syncResA.status).toBe(200);
    expect(syncResA.body.applied.created).toHaveLength(1);

    // Device B syncs using its previous cursor (deviceBCursor)
    const syncResB = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lastSyncTimestamp: deviceBCursor,
        created: [],
        updated: [],
        deletedIds: [],
      });

    expect(syncResB.status).toBe(200);
    // Even though the prompt has past createdAt/updatedAt, serverUpdatedAt is recent, so Device B receives it
    expect(syncResB.body.serverChanges.prompts).toHaveLength(1);
    expect(syncResB.body.serverChanges.prompts[0].title).toBe(
      "Offline Prompt from Yesterday",
    );
  });

  it("should be idempotent on creation retry with same clientTempId", async () => {
    const token = await getAuthToken();
    const clientTempId = "retry-id-123";

    const payload = {
      created: [
        {
          clientTempId,
          title: "Idempotent Prompt",
          body: "Checking retries",
        },
      ],
    };

    // First attempt
    const res1 = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    expect(res1.status).toBe(200);
    expect(res1.body.applied.created).toHaveLength(1);
    const serverId1 = res1.body.applied.created[0].serverId;

    // Retry with identical clientTempId
    const res2 = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    expect(res2.status).toBe(200);
    expect(res2.body.applied.created).toHaveLength(1);
    const serverId2 = res2.body.applied.created[0].serverId;

    // Must return the exact same serverId and not create a duplicate document
    expect(serverId2).toBe(serverId1);

    const prompts = await promptModel.find({ clientTempId });
    expect(prompts).toHaveLength(1);
  });

  it("should accept empty string for icon in sync payload", async () => {
    const token = await getAuthToken();

    // Create prompt with default icon
    const createRes = await request(app)
      .post("/api/prompts/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Prompt with Default Icon",
        body: "Body text",
        tags: ["icon-test"],
      });
    expect(createRes.status).toBe(201);

    const getRes = await request(app)
      .get("/api/prompts")
      .set("Authorization", `Bearer ${token}`);
    const promptId = getRes.body.prompts[0]._id;

    // Client sends update with icon: ""
    const syncRes = await request(app)
      .post("/api/prompts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({
        updated: [
          {
            promptId,
            title: "Updated Title with Empty Icon",
            body: "Body text",
            icon: "",
          },
        ],
      });

    expect(syncRes.status).toBe(200);
    expect(syncRes.body.applied.updated).toContain(promptId);
  });
});

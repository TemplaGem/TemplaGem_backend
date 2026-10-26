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
});

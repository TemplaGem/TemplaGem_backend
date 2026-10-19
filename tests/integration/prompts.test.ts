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

describe("Prompts Routes (/api/prompts)", () => {
  const user = {
    email: "promptuser@example.com",
    password: "Password1!",
  };

  const getAuthToken = async () => {
    await request(app).post("/api/auth/register").send(user);
    const loginRes = await request(app).post("/api/auth/login").send(user);
    return loginRes.body.accessToken;
  };

  describe("GET /api/prompts", () => {
    it("should return prompts for authenticated user", async () => {
      const token = await getAuthToken();

      // Create a prompt first
      await request(app)
        .post("/api/prompts/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "My Prompt",
          body: "Act as a software engineer...",
          tags: ["tech", "coding"],
        });

      const res = await request(app)
        .get("/api/prompts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("prompts");
      expect(res.body.prompts).toHaveLength(1);
      expect(res.body.prompts[0]).toHaveProperty("title", "My Prompt");
      expect(res.body.prompts[0]).toHaveProperty(
        "body",
        "Act as a software engineer...",
      );
      expect(res.body.prompts[0].tags).toEqual(["tech", "coding"]);
    });

    it("should return empty list when user has no prompts", async () => {
      const token = await getAuthToken();

      const res = await request(app)
        .get("/api/prompts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("prompts");
      expect(res.body.prompts).toHaveLength(0);
    });

    it("should return 401 when token is missing", async () => {
      const res = await request(app).get("/api/prompts");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/prompts/create", () => {
    it("should create a prompt for authenticated user", async () => {
      const token = await getAuthToken();

      const res = await request(app)
        .post("/api/prompts/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "My Prompt",
          body: "Act as a software engineer...",
          tags: ["tech", "coding"],
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt created successfully.",
      );

      const dbUser = await userModel.findOne({ email: user.email });
      expect(dbUser?.prompts).toHaveLength(1);

      const dbPrompt = await promptModel.findOne({ createdBy: dbUser?._id });
      expect(dbPrompt).not.toBeNull();
      expect(dbPrompt?.title).toBe("My Prompt");
      expect(dbPrompt?.body).toBe("Act as a software engineer...");
      expect(dbPrompt?.tags).toEqual(["tech", "coding"]);
    });

    it("should create a prompt with icon for authenticated user", async () => {
      const token = await getAuthToken();

      const res = await request(app)
        .post("/api/prompts/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Prompt with Icon",
          body: "Act as a designer...",
          tags: ["design", "ui"],
          icon: "sparkles-icon-id",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt created successfully.",
      );

      const dbUser = await userModel.findOne({ email: user.email });
      expect(dbUser?.prompts).toHaveLength(1);

      const dbPrompt = await promptModel.findOne({ createdBy: dbUser?._id });
      expect(dbPrompt?.title).toBe("Prompt with Icon");
      expect(dbPrompt?.icon).toBe("sparkles-icon-id");
    });

    it("should return 400 when icon is not a string", async () => {
      const token = await getAuthToken();

      const res = await request(app)
        .post("/api/prompts/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Invalid Icon Prompt",
          body: "Act as a software engineer...",
          tags: ["tech"],
          icon: 12345,
        });

      expect(res.status).toBe(400);
    });

    it("should return 401 when token is missing", async () => {
      const res = await request(app)
        .post("/api/prompts/create")
        .send({
          title: "My Prompt",
          body: "Act as a software engineer...",
          tags: ["tech"],
        });

      expect(res.status).toBe(401);
    });
  });

  describe("Updating and deleting prompts", () => {
    let token: string;
    let promptId: string;

    beforeEach(async () => {
      token = await getAuthToken();
      await request(app)
        .post("/api/prompts/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Initial Title",
          body: "Initial Body",
          tags: ["initial"],
        });

      const dbUser = await userModel.findOne({ email: user.email });
      promptId = dbUser!.prompts![0]!.toString();
    });

    it("should update prompt title", async () => {
      const res = await request(app)
        .patch("/api/prompts/change/title")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
          title: "Updated Title",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt title updated successfully.",
      );

      const dbPrompt = await promptModel.findById(promptId);
      expect(dbPrompt?.title).toBe("Updated Title");
    });

    it("should update prompt body", async () => {
      const res = await request(app)
        .patch("/api/prompts/change/body")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
          body: "Updated Body Content",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt body updated successfully.",
      );

      const dbPrompt = await promptModel.findById(promptId);
      expect(dbPrompt?.body).toBe("Updated Body Content");
    });

    it("should update prompt tags", async () => {
      const res = await request(app)
        .patch("/api/prompts/change/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
          tags: ["new-tag", "updated"],
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt tags updated successfully.",
      );

      const dbPrompt = await promptModel.findById(promptId);
      expect(dbPrompt?.tags).toEqual(["new-tag", "updated"]);
    });

    it("should update prompt icon", async () => {
      const res = await request(app)
        .patch("/api/prompts/change/icon")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
          icon: "new-sparkles-icon",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt icon updated successfully.",
      );

      const dbPrompt = await promptModel.findById(promptId);
      expect(dbPrompt?.icon).toBe("new-sparkles-icon");
    });

    it("should return 400 when updating icon with empty value", async () => {
      const res = await request(app)
        .patch("/api/prompts/change/icon")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
          icon: "",
        });

      expect(res.status).toBe(400);
    });

    it("should return 404 when updating icon of non-existent prompt", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";
      const res = await request(app)
        .patch("/api/prompts/change/icon")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId: nonExistentId,
          icon: "new-icon",
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Prompt not found.");
    });

    it("should delete prompt", async () => {
      const res = await request(app)
        .delete("/api/prompts/delete")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt deleted successfully.",
      );

      const dbUser = await userModel.findOne({ email: user.email });
      expect(dbUser?.prompts).toHaveLength(0);

      const dbPrompt = await promptModel.findById(promptId);
      expect(dbPrompt).toBeNull();
    });

    it("should delete all prompts of the user via DELETE /api/prompts/delete/all", async () => {
      // Create a second prompt
      await request(app)
        .post("/api/prompts/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Second Prompt",
          body: "Second prompt body",
          tags: ["extra"],
        });

      let dbUser = await userModel.findOne({ email: user.email });
      expect(dbUser?.prompts).toHaveLength(2);

      const res = await request(app)
        .delete("/api/prompts/delete/all")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "All prompts deleted successfully.",
      );

      dbUser = await userModel.findOne({ email: user.email });
      expect(dbUser?.prompts).toHaveLength(0);

      const count = await promptModel.countDocuments({
        createdBy: dbUser?._id,
      });
      expect(count).toBe(0);
    });

    it("should return 401 when unauthorized on delete all prompts", async () => {
      const res = await request(app).delete("/api/prompts/delete/all");
      expect(res.status).toBe(401);
    });
  });
});

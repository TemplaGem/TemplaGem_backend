import request from "supertest";
import { createApp } from "../../src/app.ts";
import platformsManifest from "../../src/data/platforms-manifest.json" with { type: "json" };

const app = createApp();

describe("Platforms Routes", () => {
  describe("GET /api/v1/platforms/manifest", () => {
    it("should return platforms manifest with 200 OK and correct Cache-Control header without auth", async () => {
      const res = await request(app).get("/api/v1/platforms/manifest");

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/application\/json/);
      expect(res.headers["cache-control"]).toBe(
        "public, max-age=3600, stale-while-revalidate=86400",
      );

      // Verify the endpoint serves the manifest reference directly from platforms-manifest.json
      expect(res.body).toEqual(platformsManifest);
    });

    it("should conform to the manifest contract schema", async () => {
      const res = await request(app).get("/api/v1/platforms/manifest");

      expect(res.body).toMatchObject({
        version: expect.any(Number),
        updatedAt: expect.any(String),
        ttlMinutes: expect.any(Number),
      });

      expect(Array.isArray(res.body.platforms)).toBe(true);
      expect(res.body.platforms).toHaveLength(4);

      for (const platform of res.body.platforms) {
        expect(platform).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          enabled: expect.any(Boolean),
          accentColor: expect.stringMatching(/^#[0-9A-Fa-f]{6}$/),
          matches: expect.any(Array),
          selectors: {
            input: expect.any(Array),
            container: expect.any(Array),
            submitButton: expect.any(Array),
          },
          editor: {
            type: expect.any(String),
            insertStrategy: expect.any(String),
          },
          popover: {
            attachTo: expect.any(String),
            offset: {
              x: expect.any(Number),
              y: expect.any(Number),
            },
          },
        });
      }
    });

    it("should provide platform-specific accent colors (claude: orange, chatgpt: black, gemini: blue, deepseek: indigo)", async () => {
      const res = await request(app).get("/api/v1/platforms/manifest");
      const { platforms } = res.body;

      const gemini = platforms.find((p: { id: string }) => p.id === "gemini");
      const chatgpt = platforms.find((p: { id: string }) => p.id === "chatgpt");
      const claude = platforms.find((p: { id: string }) => p.id === "claude");
      const deepseek = platforms.find(
        (p: { id: string }) => p.id === "deepseek",
      );

      expect(gemini?.accentColor).toBe("#1A73E8");
      expect(chatgpt?.accentColor).toBe("#000000");
      expect(claude?.accentColor).toBe("#D97757");
      expect(deepseek?.accentColor).toBe("#4D6BFE");

      // Verify theme.accentColor mirrors the primary accentColor
      expect(gemini?.theme?.accentColor).toBe(gemini?.accentColor);
      expect(chatgpt?.theme?.accentColor).toBe(chatgpt?.accentColor);
      expect(claude?.theme?.accentColor).toBe(claude?.accentColor);
      expect(deepseek?.theme?.accentColor).toBe(deepseek?.accentColor);
    });

    it("should be accessible via /api/platforms/manifest alias as well", async () => {
      const res = await request(app).get("/api/platforms/manifest");
      expect(res.status).toBe(200);
      expect(res.headers["cache-control"]).toBe(
        "public, max-age=3600, stale-while-revalidate=86400",
      );
      expect(res.body).toEqual(platformsManifest);
    });
  });
});

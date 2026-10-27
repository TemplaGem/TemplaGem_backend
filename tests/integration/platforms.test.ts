import request from "supertest";
import { createApp } from "../../src/app.ts";

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

      expect(res.body).toEqual({
        version: 1,
        updatedAt: "2026-10-27T12:00:00Z",
        ttlMinutes: 60,
        platforms: [
          {
            id: "gemini",
            name: "Google Gemini",
            enabled: true,
            matches: ["https://gemini.google.com/*"],
            selectors: {
              input: [
                '.ql-editor[contenteditable="true"]',
                'rich-textarea [contenteditable="true"]',
                'div[role="textbox"][contenteditable="true"]',
              ],
              container: [
                ".input-area-container",
                ".chat-input-container",
                '[class*="input-area"]',
                "form",
              ],
              submitButton: [
                'button[aria-label*="Send"]',
                "button.send-button",
                'button[type="submit"]',
              ],
            },
            editor: {
              type: "quill",
              insertStrategy: "execCommand",
            },
            popover: {
              attachTo: "container",
              offset: { x: 0, y: 8 },
            },
          },
          {
            id: "chatgpt",
            name: "ChatGPT",
            enabled: true,
            matches: ["https://chatgpt.com/*", "https://chat.openai.com/*"],
            selectors: {
              input: [
                "#prompt-textarea",
                'div[contenteditable="true"][id="prompt-textarea"]',
                'div.ProseMirror[contenteditable="true"]',
                "textarea#prompt-textarea",
              ],
              container: [
                'form[class*="stretch"]',
                'div[class*="composer"]',
                "form",
              ],
              submitButton: [
                'button[data-testid="send-button"]',
                'button[aria-label="Send prompt"]',
                'button[type="submit"]',
              ],
            },
            editor: {
              type: "prosemirror",
              insertStrategy: "inputEvent",
            },
            popover: {
              attachTo: "container",
              offset: { x: 0, y: 12 },
            },
          },
          {
            id: "claude",
            name: "Anthropic Claude",
            enabled: true,
            matches: ["https://claude.ai/*"],
            selectors: {
              input: [
                'div.ProseMirror[contenteditable="true"]',
                'fieldset div[contenteditable="true"]',
                'div[role="textbox"][contenteditable="true"]',
              ],
              container: [
                'div[class*="composer"]',
                "fieldset",
                'div[class*="input-container"]',
              ],
              submitButton: [
                'button[aria-label*="Send"]',
                'button[type="submit"]',
              ],
            },
            editor: {
              type: "prosemirror",
              insertStrategy: "inputEvent",
            },
            popover: {
              attachTo: "container",
              offset: { x: 0, y: 10 },
            },
          },
        ],
      });
    });

    it("should be accessible via /api/platforms/manifest alias as well", async () => {
      const res = await request(app).get("/api/platforms/manifest");
      expect(res.status).toBe(200);
      expect(res.headers["cache-control"]).toBe(
        "public, max-age=3600, stale-while-revalidate=86400",
      );
      expect(res.body.version).toBe(1);
    });
  });
});

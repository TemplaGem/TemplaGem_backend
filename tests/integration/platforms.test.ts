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
            accentColor: "#1A73E8",
            theme: {
              accentColor: "#1A73E8",
            },
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
            accentColor: "#000000",
            theme: {
              accentColor: "#000000",
            },
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
            accentColor: "#D97757",
            theme: {
              accentColor: "#D97757",
            },
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
          {
            id: "deepseek",
            name: "DeepSeek",
            enabled: true,
            accentColor: "#4D6BFE",
            theme: {
              accentColor: "#4D6BFE",
            },
            matches: ["https://chat.deepseek.com/*"],
            selectors: {
              input: [
                "#chat-input",
                "textarea#chat-input",
                'textarea[placeholder*="DeepSeek"]',
                "textarea",
              ],
              container: [
                ".chat-input-container",
                '[class*="chat-input"]',
                '[class*="input-box"]',
                "form",
              ],
              submitButton: [
                'div[role="button"][aria-label*="Send"]',
                'button[aria-label*="Send"]',
                'div[class*="send-button"]',
                'button[type="submit"]',
              ],
            },
            editor: {
              type: "textarea",
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

    it("should provide platform-specific accent colors (claude: orange, chatgpt: black, gemini: blue, deepseek: indigo/blue)", async () => {
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

      expect(gemini?.theme?.accentColor).toBe("#1A73E8");
      expect(chatgpt?.theme?.accentColor).toBe("#000000");
      expect(claude?.theme?.accentColor).toBe("#D97757");
      expect(deepseek?.theme?.accentColor).toBe("#4D6BFE");
    });

    it("should be accessible via /api/platforms/manifest alias as well", async () => {
      const res = await request(app).get("/api/platforms/manifest");
      expect(res.status).toBe(200);
      expect(res.headers["cache-control"]).toBe(
        "public, max-age=3600, stale-while-revalidate=86400",
      );
      expect(res.body.version).toBe(1);
      expect(res.body.platforms).toHaveLength(4);
    });
  });
});

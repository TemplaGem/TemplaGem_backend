import type { PlatformsManifest } from "../types/platform.types.ts";

export const platformsManifest: PlatformsManifest = {
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
        container: ['form[class*="stretch"]', 'div[class*="composer"]', "form"],
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
        submitButton: ['button[aria-label*="Send"]', 'button[type="submit"]'],
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
};

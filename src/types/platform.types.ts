export interface PlatformSelectors {
  input: string[];
  container: string[];
  submitButton: string[];
}

export interface PlatformEditor {
  type: string;
  insertStrategy: string;
}

export interface PlatformPopover {
  attachTo: string;
  offset: {
    x: number;
    y: number;
  };
}

export interface PlatformTheme {
  accentColor: string;
}

export interface PlatformConfig {
  id: string;
  name: string;
  enabled: boolean;
  accentColor: string;
  theme?: PlatformTheme;
  matches: string[];
  selectors: PlatformSelectors;
  editor: PlatformEditor;
  popover: PlatformPopover;
}

export interface PlatformsManifest {
  version: number;
  updatedAt: string;
  ttlMinutes: number;
  platforms: PlatformConfig[];
}

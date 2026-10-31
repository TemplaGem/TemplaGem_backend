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
  /**
   * Accent color hex code mirroring the root `accentColor`.
   */
  accentColor: string;
}

export interface PlatformConfig {
  id: string;
  name: string;
  enabled: boolean;
  /**
   * Preferred canonical accent color hex code (e.g. `#1A73E8`) for UI theming.
   */
  accentColor: string;
  /**
   * Optional theme configuration containing structured styling tokens.
   * `theme.accentColor` is kept in sync with the primary `accentColor` for backwards/forwards compatibility.
   */
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

// <reference types="vite/client" />

// By including the reference to "vite/client" above, we get the default type definitions
// for Vite's environment variables (like BASE_URL, MODE, DEV, PROD, SSR).
// We then extend the ImportMetaEnv interface with our custom variables.
// This resolves the "All declarations of '...' must have identical modifiers" error
// which occurs when the built-in variables are redeclared.

interface ImportMetaEnv {
    /**
   * The base public path when served in production.
   * @default '/'
   */
  //readonly BASE_URL: string;
  /**
   * The mode the app is running in.
   * @default 'development' for dev, 'production' for build
   */
  //readonly MODE: string;
  /**
   * Whether the app is running in development.
   */
  //readonly DEV: boolean;
  /**
   * Whether the app is running in production.
   */
  //readonly PROD: boolean;
  /**
   * Whether the app is running in an SSR environment.
   */
  //readonly SSR: boolean;

  // Add your own custom environment variables here.
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

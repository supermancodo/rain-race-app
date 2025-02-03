/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot: {
    accept: Function;
    dispose: Function;
    on: Function;
  };
}

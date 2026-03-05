/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIN_CODE: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

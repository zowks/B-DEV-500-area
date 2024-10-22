/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly SERVER_API_URL: string;
    readonly CLIENT_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

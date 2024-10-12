import * as path from "node:path";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit()],
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./src"),
            "$i18n": path.resolve(__dirname, "./src/i18n"),
            "@common": path.resolve(__dirname, "../../node_modules/area-common/src")
        }
    }
});

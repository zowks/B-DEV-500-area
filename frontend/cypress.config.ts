import { defineConfig } from "cypress";
import { dotenv } from "cypress-plugin-dotenv";

export default defineConfig({
    e2e: {
        setupNodeEvents(_, config) {
            return dotenv(config);
        }
    },
    component: {
        devServer: {
            framework: "svelte",
            bundler: "vite"
        }
    }
});

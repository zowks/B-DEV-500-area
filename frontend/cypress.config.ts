import { defineConfig } from "cypress";
import { dotenv } from "cypress-plugin-dotenv";

export default defineConfig({
    e2e: {
        setupNodeEvents(_, config) {
            return dotenv(config, undefined, !!process.env.IS_CONTINUOUS_INTEGRATION);
        },
        experimentalStudio: true
    },
    component: {
        devServer: {
            framework: "svelte",
            bundler: "vite"
        }
    }
});

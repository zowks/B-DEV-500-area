import { defineConfig } from "cypress";
import { dotenv } from "cypress-plugin-dotenv";

function isCI() {
    return !!process.env.CI || !!process.env.GITHUB_ACTIONS;
}

export default defineConfig({
    e2e: {
        setupNodeEvents(_, config) {
            return dotenv(config, undefined, isCI());
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

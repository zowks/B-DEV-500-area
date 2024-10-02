import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents() {
            // implement node event listeners here
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

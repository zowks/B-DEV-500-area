import * as path from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    resolve: {
        alias: {
            '@common': path.resolve(__dirname, '../common/src'),
        },
    },
});

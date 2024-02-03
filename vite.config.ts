import { sveltekit } from '@sveltejs/kit/vite';
import viteCompression from 'vite-plugin-compression';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit(), viteCompression()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});

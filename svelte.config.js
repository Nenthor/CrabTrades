import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self', 'crabtrades.com:*', '*.crabtrades.com:*'],
        'script-src': ['self', 'www.google.com', 'www.gstatic.com'],
        'frame-src': ['self', 'www.google.com'],
        'connect-src': ['self'],
        'img-src': ['self'],
        'style-src': ['self', 'unsafe-inline'],
        'frame-ancestors': ['self'],
        'form-action': ['self'],
        'base-uri': ['self'],
      },
    },
  },
};

export default config;

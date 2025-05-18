// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://christinsibi.in',
  base: '/',
  output: 'static',
  integrations: [react(), mdx(), tailwind()]
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'qr-template-studio';
const base = process.env.GITHUB_PAGES === 'true' ? `/${repository}/` : '/';

export default defineConfig({
  base,
  plugins: [react()],
});

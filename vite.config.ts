import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

function imageAssetMirrorPlugin() {
  return {
    name: 'image-asset-mirror-plugin',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const candidates = [
        path.join(distDir, 'Images', '1'),
        path.join(distDir, 'Images', 'one'),
        path.join(process.cwd(), 'public', 'Images', '1'),
        path.join(process.cwd(), 'Images', '1'),
      ];

      let sourceDir: string | null = null;
      for (const c of candidates) {
        if (fs.existsSync(c) && fs.readdirSync(c).length > 0) {
          sourceDir = c;
          break;
        }
      }

      if (!sourceDir) return;

      const targetDirs = [
        path.join(distDir, 'Images', '1'),
        path.join(distDir, 'Images', 'one'),
        path.join(distDir, 'images', '1'),
        path.join(distDir, 'images', 'one'),
      ];

      const files = fs.readdirSync(sourceDir);
      for (const target of targetDirs) {
        if (!fs.existsSync(target)) {
          fs.mkdirSync(target, { recursive: true });
        }
        for (const file of files) {
          const srcFile = path.join(sourceDir, file);
          const destFile = path.join(target, file);
          try {
            if (!fs.existsSync(destFile)) {
              fs.copyFileSync(srcFile, destFile);
            }
          } catch {}
        }
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), imageAssetMirrorPlugin()],
});

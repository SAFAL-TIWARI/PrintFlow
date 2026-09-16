import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function autoBackendPlugin() {
  let backendProcess = null;
  return {
    name: 'auto-backend-server',
    configureServer() {
      // Check if backend is already listening on port 5000
      const req = http.get('http://127.0.0.1:5000/api/health', () => {
        // Backend is already up and listening
      });
      req.on('error', () => {
        console.log('\x1b[36m[Vite Auto-Backend] Port 5000 inactive. Starting PrintFlow-Backend with persistent localDB...\x1b[0m');
        const backendDir = path.resolve(__dirname, '../PrintFlow-Backend');
        backendProcess = spawn('node', ['src/server.js'], {
          cwd: backendDir,
          stdio: 'inherit',
          shell: true
        });
        backendProcess.on('error', (err) => {
          console.error('[Vite Auto-Backend] Failed to start backend:', err);
        });
      });

      const cleanup = () => {
        if (backendProcess) {
          try {
            backendProcess.kill();
          } catch (_) {}
        }
      };
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      process.on('exit', cleanup);
    }
  };
}

export default defineConfig({
  plugins: [react(), autoBackendPlugin()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
});


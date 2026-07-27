import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import ttsHandler from './api/tts.js'

// Vite plugin to serve /api/tts in local dev environment
const ttsApiPlugin = () => ({
  name: 'tts-api-plugin',
  configureServer(server) {
    server.middlewares.use('/api/tts', async (req, res, next) => {
      try {
        // Parse URL parameters
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        req.query = Object.fromEntries(urlObj.searchParams.entries());

        // Call the serverless function handler directly
        await ttsHandler(req, res);
      } catch (err) {
        console.error('[Vite TTS Middleware Error]:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ttsApiPlugin()],
})

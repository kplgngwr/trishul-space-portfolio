import { defineConfig, loadEnv, type Plugin, type Connect } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Dev-only middleware: runs api/contact.ts's handler directly inside the
// Vite dev server, so `npm run dev` can exercise it without needing
// `vercel dev` (which requires an interactive browser login).
function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-contact',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', (async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          let parsedBody: unknown = {};
          try {
            parsedBody = body ? JSON.parse(body) : {};
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'Invalid JSON body.' }));
            return;
          }

          const vercelRes = res as unknown as VercelResponse;
          vercelRes.status = (code: number) => {
            res.statusCode = code;
            return vercelRes;
          };
          vercelRes.json = (payload: unknown) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
            return vercelRes;
          };

          const vercelReq = req as unknown as VercelRequest;
          vercelReq.body = parsedBody;

          const { default: handler } = await import('./api/contact');
          await handler(vercelReq, vercelRes);
        });
      }) as Connect.NextHandleFunction);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    publicDir: 'public',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  };
});

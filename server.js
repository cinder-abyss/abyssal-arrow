'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const ROOT = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};
const HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(self), geolocation=()'
};

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { ...HEADERS, Allow: 'GET, HEAD' });
    return res.end('Method Not Allowed');
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, HEADERS);
    return res.end('Bad Request');
  }

  if (pathname === '/health') {
    res.writeHead(200, { ...HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ ok: true, app: 'birthday-surprise' }));
  }

  if (pathname === '/') pathname = '/index.html';
  const parts = pathname.split('/');
  if (parts.some(part => part === '..' || part.startsWith('.'))) {
    res.writeHead(404, HEADERS);
    return res.end('Not Found');
  }

  const requested = path.resolve(ROOT, '.' + pathname);
  if (requested !== ROOT && !requested.startsWith(ROOT + path.sep)) {
    res.writeHead(404, HEADERS);
    return res.end('Not Found');
  }
  fs.stat(requested, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { ...HEADERS, 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    }
    const type = TYPES[path.extname(requested).toLowerCase()] || 'application/octet-stream';
    const cache = pathname === '/index.html' || pathname === '/config.js' ? 'no-store' : 'public, max-age=3600';
    res.writeHead(200, {
      ...HEADERS,
      'Content-Type': type,
      'Content-Length': stats.size,
      'Cache-Control': cache
    });
    if (req.method === 'HEAD') return res.end();
    const stream = fs.createReadStream(requested);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Birthday surprise site listening on 0.0.0.0:${PORT}`);
});

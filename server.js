const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const SUPABASE_URL = 'https://cxlufuxtijcyftcdhldf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bHVmdXh0aWpjeWZ0Y2RobGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODg0NTQsImV4cCI6MjEwNzM2NDQ1NH0.zlP54Vx-sT9sUrJA5yILmspOaewdiXVClLeRUR1Jn8o';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function forwardToSupabase(table, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);

    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = req.url.split('?')[0];

  // API Health Endpoint
  if (reqUrl === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      database: 'connected',
      supabase_project: 'bright-harbor-dental',
      supabase_url: SUPABASE_URL
    }));
    return;
  }

  // API Inquiries Endpoint
  if (reqUrl === '/api/inquiries' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const result = await forwardToSupabase('quick_inquiries', payload);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: result.status === 201 }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API Appointments Endpoint
  if (reqUrl === '/api/appointments' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const result = await forwardToSupabase('appointments', payload);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: result.status === 201 }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let staticPath = reqUrl === '/' ? '/index.html' : reqUrl;
  const filePath = path.join(__dirname, staticPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Bright Harbor Dental server running at http://localhost:${PORT}`);
  console.log(`Connected to Supabase Project: bright-harbor-dental (${SUPABASE_URL})`);
});

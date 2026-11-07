import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';

async function getFreePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

test('analysis endpoint validates inputs and reports missing Gemini configuration', async (t) => {
  const port = await getFreePort();
  const child = spawn(process.execPath, ['server.mjs'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port), GEMINI_API_KEY: '', GEMINI_MODEL: 'gemini-3.6-flash' },
    stdio: 'ignore',
  });
  t.after(() => child.kill());

  const baseUrl = `http://127.0.0.1:${port}`;
  let health;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      health = await fetch(`${baseUrl}/api/health`);
      break;
    } catch {
      if (child.exitCode !== null) throw new Error(`Backend exited with code ${child.exitCode}`);
      await delay(100);
    }
  }
  assert.ok(health, 'backend should start within five seconds');
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { ok: true, geminiConfigured: false, model: 'gemini-3.6-flash' });

  const emptyRequest = await fetch(`${baseUrl}/api/analyze-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(emptyRequest.status, 400);
  assert.equal((await emptyRequest.json()).code, 'INVALID_IMAGE');

  const unsupportedImage = await fetch(`${baseUrl}/api/analyze-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUrl: 'data:image/gif;base64,AAAA' }),
  });
  assert.equal(unsupportedImage.status, 400);
  assert.equal((await unsupportedImage.json()).code, 'INVALID_IMAGE');

  const validImageShape = await fetch(`${baseUrl}/api/analyze-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUrl: 'data:image/jpeg;base64,AAAA' }),
  });
  assert.equal(validImageShape.status, 503);
  assert.equal((await validImageShape.json()).code, 'AI_NOT_CONFIGURED');
});

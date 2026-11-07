import express from 'express';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);
const REQUESTS_FILE_PATH = path.join(process.cwd(), 'data', 'requests.json');
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const allowedOrigins = new Set(
  (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.use((req, res, next) => {
  const origin = req.get('Origin');
  if (!origin || !allowedOrigins.has(origin)) return next();

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});
app.use(express.json({ limit: '20mb' }));

async function readRequests() {
  try {
    const content = await fs.readFile(REQUESTS_FILE_PATH, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await fs.mkdir(path.dirname(REQUESTS_FILE_PATH), { recursive: true });
    await fs.writeFile(REQUESTS_FILE_PATH, JSON.stringify([], null, 2));
    return [];
  }
}

async function writeRequests(requests) {
  await fs.mkdir(path.dirname(REQUESTS_FILE_PATH), { recursive: true });
  await fs.writeFile(REQUESTS_FILE_PATH, JSON.stringify(requests, null, 2));
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: GEMINI_MODEL,
  });
});

app.get('/api/requests', async (_req, res) => {
  try {
    const requests = await readRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'No se pudieron cargar las solicitudes.' });
  }
});

app.put('/api/requests', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: 'El cuerpo debe ser una lista de solicitudes.' });
    }

    await writeRequests(req.body);
    return res.json({ ok: true, count: req.body.length });
  } catch (error) {
    return res.status(500).json({ message: error instanceof Error ? error.message : 'No se pudieron guardar las solicitudes.' });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const request = req.body;
    if (!request || typeof request !== 'object') {
      return res.status(400).json({ message: 'La solicitud es inválida.' });
    }

    const currentRequests = await readRequests();
    const next = [request, ...currentRequests];
    await writeRequests(next);
    return res.status(201).json(request);
  } catch (error) {
    return res.status(500).json({ message: error instanceof Error ? error.message : 'No se pudo crear la solicitud.' });
  }
});

app.post('/api/analyze-image', async (req, res) => {
  const { imageDataUrl } = req.body || {};
  const requestId = randomUUID();

  if (!imageDataUrl || typeof imageDataUrl !== 'string') {
    return res.status(400).json({ code: 'INVALID_IMAGE', message: 'No se recibió una fotografía válida.' });
  }

  const imageMatch = imageDataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!imageMatch || !imageMatch[2]) {
    return res.status(400).json({ code: 'INVALID_IMAGE', message: 'La imagen debe ser JPG, PNG o WebP y estar codificada correctamente.' });
  }
  const base64 = imageMatch[2];
  const imageSize = Math.floor((base64.length * 3) / 4) - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
  if (imageSize <= 0 || imageSize > 8 * 1024 * 1024) {
    return res.status(413).json({ code: 'IMAGE_SIZE', message: 'La imagen está vacía o supera el límite de 8 MB.' });
  }
  const mimeType = imageMatch[1];
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ code: 'AI_NOT_CONFIGURED', message: 'El servicio de análisis no está configurado. Añade GEMINI_API_KEY al archivo .env del servidor y reinícialo.' });
  }

  const controller = new AbortController();
  const onRequestAborted = () => controller.abort();
  req.on('aborted', onRequestAborted);

  try {
    let response;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: `Examina la fotografía adjunta, que es la única evidencia permitida. Analiza residuos visibles, incluso varios objetos distintos si se distinguen. Responde solo JSON con esta forma: {"status":"identified|uncertain|not_recyclable|not_relevant|poor_image","items":[{"object":"nombre visible","material":"Plástico|Papel y cartón|Vidrio|Metal|Orgánico|Electrónico|Textil|Otro|null","evidence":"rasgos visibles que sustentan la identificación","resinCode":"código que se lea claramente en la imagen o null","visibleCondition":"estado observable o null","recyclable":true}],"object":"objeto principal o null","material":"material probable o null","specific":"descripción breve o null","resinCode":"código visible o null","visibleCondition":"estado observable o null","recyclable":true,"explanation":"explicación basada en lo visible","recommendations":["..."],"reuseIdeas":["..."],"warnings":["..."]}. Si no hay residuo relacionado con reciclaje usa not_relevant; si la imagen es demasiado oscura, borrosa o incompleta usa poor_image; si el objeto no es reciclable usa not_recyclable; si se ve un objeto pero no se determina material con seguridad usa uncertain. Nunca inventes objetos, materiales, códigos, porcentajes de confianza, toxicidad, composición química ni seguridad. No afirmes que un material se identificó si no hay evidencia visible. Si no puedes determinarlo, dilo y deja el valor como null. En items incluye solo objetos que realmente se distingan. No clasifiques personas, animales ni paisajes como residuos.`,
                },
                { inline_data: { mime_type: mimeType, data: base64 } },
              ],
            }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });
      } catch (error) {
        if (controller.signal.aborted && req.aborted) return;
        if (attempt === 0 && !controller.signal.aborted) continue;
        throw error;
      } finally {
        clearTimeout(timeout);
      }

      if (response.ok || (response.status < 500 && response.status !== 429) || attempt === 1) break;
    }

    if (!response?.ok) {
      const status = response?.status;
      console.error(`[${requestId}] Gemini request failed (HTTP ${status ?? 'unknown'}).`);
      if (status === 401 || status === 403) {
        return res.status(502).json({ code: 'AI_AUTH_ERROR', message: 'Gemini rechazó la credencial. Comprueba GEMINI_API_KEY en .env; no se mostró ningún resultado inventado.' });
      }
      if (status === 404) {
        return res.status(502).json({ code: 'AI_MODEL_ERROR', message: `El modelo "${GEMINI_MODEL}" no está disponible para esta API. Revisa GEMINI_MODEL en .env.` });
      }
      if (status === 429) {
        return res.status(503).json({ code: 'AI_RATE_LIMIT', message: 'Gemini alcanzó el límite temporal de solicitudes. Espera un momento y vuelve a intentarlo.' });
      }
      return res.status(502).json({ code: 'AI_SERVICE_ERROR', message: 'Gemini no pudo procesar la fotografía. Intenta nuevamente más tarde.' });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === 'string')?.text ?? '';
    const analysis = JSON.parse(rawText);
    const validStatuses = ['identified', 'uncertain', 'not_recyclable', 'not_relevant', 'poor_image'];
    if (!analysis || !validStatuses.includes(analysis.status)) throw new Error('unsupported status');
    const items = Array.isArray(analysis.items) ? analysis.items
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        object: typeof item.object === 'string' ? item.object : null,
        material: typeof item.material === 'string' ? item.material : null,
        evidence: typeof item.evidence === 'string' ? item.evidence : null,
        resinCode: typeof item.resinCode === 'string' ? item.resinCode : null,
        visibleCondition: typeof item.visibleCondition === 'string' ? item.visibleCondition : null,
        recyclable: item.recyclable === true,
      }))
      .filter((item) => item.object || item.material)
      : [];
    const object = typeof analysis.object === 'string' ? analysis.object : items[0]?.object ?? null;
    const material = typeof analysis.material === 'string' ? analysis.material : items[0]?.material ?? null;
    if (analysis.status === 'identified' && (!object || !material)) throw new Error('identified result missing visible object or material');

    return res.json({
      status: analysis.status,
      items,
      object,
      material,
      specific: typeof analysis.specific === 'string' ? analysis.specific : null,
      resinCode: typeof analysis.resinCode === 'string' ? analysis.resinCode : items[0]?.resinCode ?? null,
      visibleCondition: typeof analysis.visibleCondition === 'string' ? analysis.visibleCondition : items[0]?.visibleCondition ?? null,
      confidence: null,
      recyclable: analysis.status === 'identified' && (analysis.recyclable === true || items.some((item) => item.recyclable)),
      explanation: typeof analysis.explanation === 'string' ? analysis.explanation : 'No hay evidencia visual suficiente para una explicación adicional.',
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations.filter((item) => typeof item === 'string') : [],
      reuseIdeas: Array.isArray(analysis.reuseIdeas) ? analysis.reuseIdeas.filter((item) => typeof item === 'string') : [],
      warnings: Array.isArray(analysis.warnings) ? analysis.warnings.filter((item) => typeof item === 'string') : [],
    });
  } catch (error) {
    if (controller.signal.aborted && req.aborted) return;
    if (controller.signal.aborted) {
      console.error(`[${requestId}] Gemini request timed out.`);
      return res.status(504).json({ code: 'AI_TIMEOUT', message: 'Gemini tardó demasiado en responder. Comprueba tu conexión e inténtalo nuevamente.' });
    }
    console.error(`[${requestId}] Gemini response could not be processed: ${error instanceof Error ? error.message : 'unknown error'}`);
    return res.status(502).json({ code: 'AI_INVALID_RESPONSE', message: 'Gemini respondió con un formato que no se pudo validar. No se generó una identificación; puedes volver a intentarlo.' });
  } finally {
    req.off('aborted', onRequestAborted);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`EcoCircular server listening on port ${PORT}`);
});

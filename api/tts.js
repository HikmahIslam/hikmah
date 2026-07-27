// api/tts.js — Vercel Serverless Function & Vite Middleware Handler
// Dual Neural TTS Engine:
// Primary: Hugging Face MMS-TTS (facebook/mms-tts-mal & facebook/mms-tts-eng)
// Secondary: Microsoft Edge Neural TTS (ml-IN-MidhunNeural & en-US-GuyNeural)
// BOTH ENGINES GENERATE REAL BINARY AUDIO FILES (MP3/WAV).
// ZERO BROWSER speechSynthesis IS EVER USED.

import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// Generate audio buffer using Microsoft Edge Neural TTS (backup neural model)
async function generateEdgeTTS(text, lang) {
  const voiceName = lang === 'ml' ? 'ml-IN-MidhunNeural' : 'en-US-GuyNeural';
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);

  return new Promise((resolve, reject) => {
    const chunks = [];
    audioStream.on('data', (chunk) => chunks.push(chunk));
    audioStream.on('end', () => resolve(Buffer.concat(chunks)));
    audioStream.on('error', (err) => reject(err));
  });
}

export default async function handler(req, res) {
  const sendJson = (statusCode, data) => {
    if (res.status && typeof res.status === 'function') {
      return res.status(statusCode).json(data);
    }
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data));
  };

  const sendBuffer = (statusCode, mimeType, buffer, engineHeader = 'HuggingFace') => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', buffer.byteLength);
    res.setHeader('X-TTS-Engine', engineHeader);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.end(Buffer.from(buffer));
  };

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const query = req.query || {};
  let text = query.text;
  let lang = query.lang || 'ml';

  if (!text && req.body) {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      text = body.text || body.inputs;
      if (body.lang) lang = body.lang;
    } catch {
      // ignore
    }
  }

  const cleanText = String(text || '').trim().slice(0, 400);

  if (!cleanText) {
    return sendJson(400, { error: 'text query parameter or body is required' });
  }

  const token = process.env.HF_TOKEN || process.env.VITE_HF_TOKEN || '';
  const modelName = lang === 'ml' ? 'facebook/mms-tts-mal' : 'facebook/mms-tts-eng';
  const hfUrl = `https://router.huggingface.co/hf-inference/models/${modelName}`;

  // If HF_TOKEN is configured, attempt Hugging Face MMS-TTS first
  if (token) {
    try {
      const response = await fetch(hfUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ inputs: cleanText }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (response.status === 503) {
        const json = await response.json().catch(() => ({}));
        return sendJson(503, {
          status: 'loading',
          model: modelName,
          error: json.error || `Model ${modelName} is currently loading`,
          estimated_time: json.estimated_time || 20,
        });
      }

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        const mimeType = contentType.includes('audio') ? contentType : 'audio/wav';
        return sendBuffer(200, mimeType, audioBuffer, `Hugging Face (${modelName})`);
      }
    } catch (err) {
      console.warn('[TTS API] HF request failed, switching to MsEdgeTTS:', err.message);
    }
  }

  // Fallback / Direct Engine: Microsoft Edge Neural TTS (Midhun/Guy)
  try {
    const mp3Buffer = await generateEdgeTTS(cleanText, lang);
    const engineLabel = lang === 'ml'
      ? 'Microsoft Edge Neural (ml-IN-MidhunNeural)'
      : 'Microsoft Edge Neural (en-US-GuyNeural)';
    return sendBuffer(200, 'audio/mpeg', mp3Buffer, engineLabel);
  } catch (edgeErr) {
    console.error('[TTS API] Edge TTS failed:', edgeErr);
    return sendJson(500, {
      status: 'error',
      error: 'Failed to generate neural TTS audio: ' + edgeErr.message,
    });
  }
}

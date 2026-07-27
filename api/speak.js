// api/speak.js — Vercel Serverless Function
// Uses Microsoft Edge Neural TTS (same engine as Edge Read Aloud — no API key required)
// Voices:
//   ml-IN-MidhunNeural  → natural male Kerala Malayalam
//   en-US-GuyNeural     → natural male US English

import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const VOICES = {
  ml: 'ml-IN-MidhunNeural',
  en: 'en-US-GuyNeural',
};

export default async function handler(req, res) {
  // Allow CORS so the browser can fetch from the same Vercel domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { text = '', lang = 'ml' } = req.query;
  const cleanText = String(text).trim().slice(0, 500); // safety limit

  if (!cleanText) {
    return res.status(400).send('text query param is required');
  }

  const voiceName = VOICES[lang] || VOICES.ml;

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const readable = tts.toStream(cleanText);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache 24h per text

    readable.on('end', () => res.end());
    readable.on('error', (err) => {
      console.error('[TTS] Stream error:', err);
      if (!res.headersSent) res.status(500).send('TTS stream error');
    });

    readable.pipe(res);
  } catch (err) {
    console.error('[TTS] Generation error:', err);
    if (!res.headersSent) {
      res.status(500).send('TTS generation failed: ' + err.message);
    }
  }
}

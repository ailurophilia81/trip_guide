// api/trip.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { id } = req.query;

  // 조회
  if (req.method === 'GET') {
    if (!id) { res.status(400).json({ error: 'id required' }); return; }
    const data = await kv.get(`trip:${id}`);
    if (!data) { res.status(404).json({ error: 'not found' }); return; }
    return res.json(data);
  }

  // 신규 저장 → UUID 반환
  if (req.method === 'POST') {
    const newId = Math.random().toString(36).slice(2, 10);
    await kv.set(`trip:${newId}`, req.body, { ex: 60 * 60 * 24 * 365 });
    return res.json({ id: newId });
  }

  // 기존 수정
  if (req.method === 'PUT') {
    if (!id) { res.status(400).json({ error: 'id required' }); return; }
    await kv.set(`trip:${id}`, req.body, { ex: 60 * 60 * 24 * 365 });
    return res.json({ ok: true });
  }

  res.status(405).end();
}

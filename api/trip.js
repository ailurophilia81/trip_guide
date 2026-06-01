const { put, list, del } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { id } = req.query;

  // 조회
  if (req.method === 'GET') {
    if (!id) return res.status(400).json({ error: 'id required' });
    const { blobs } = await list({ prefix: `trips/${id}.json`, limit: 1 });
    if (!blobs.length) return res.status(404).json({ error: 'not found' });
    const response = await fetch(blobs[0].url);
    const data = await response.json();
    return res.json(data);
  }

  // 신규 저장 → ID 반환
  if (req.method === 'POST') {
    const newId = Math.random().toString(36).slice(2, 10);
    await put(`trips/${newId}.json`, JSON.stringify(req.body), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });
    return res.json({ id: newId });
  }

  // 기존 수정
  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ error: 'id required' });
    const { blobs } = await list({ prefix: `trips/${id}.json`, limit: 1 });
    if (blobs.length) await del(blobs[0].url);
    await put(`trips/${id}.json`, JSON.stringify(req.body), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });
    return res.json({ ok: true });
  }

  res.status(405).end();
};

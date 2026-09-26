export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  console.log(JSON.stringify({
    source: 'repeatshine-calculator',
    receivedAt: new Date().toISOString(),
    ...body,
  }));

  return res.status(200).json({ ok: true });
}

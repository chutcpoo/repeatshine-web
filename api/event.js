const ALLOWED_EVENTS = new Set([
  'PageView',
  'CalculatorStarted',
  'CalculatorCompleted',
  'ProductIntent',
]);

function clean(value, max = 180) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if (!ALLOWED_EVENTS.has(body.event)) {
    return res.status(400).json({ ok: false });
  }

  const data = body.data && typeof body.data === 'object' ? body.data : {};
  console.log(JSON.stringify({
    source: 'repeatshine-calculator',
    receivedAt: new Date().toISOString(),
    event: body.event,
    session_id: clean(body.session_id, 80),
    page: clean(body.page),
    referrer: clean(body.referrer, 500),
    utm_source: clean(body.utm_source),
    utm_medium: clean(body.utm_medium),
    utm_campaign: clean(body.utm_campaign),
    utm_content: clean(body.utm_content),
    utm_term: clean(body.utm_term),
    data,
  }));

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true });
}

const ALLOWED_EVENTS = new Set([
  'PageView',
  'CalculatorStarted',
  'CalculatorCompleted',
  'ProductIntent',
  'QualifiedProblemSession',
  'QualifiedProblemLead',
]);

function clean(value, max = 180) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function parseBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : (typeof req.body === 'string' ? req.body : '');
  if (!raw) return {};
  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (contentType.includes('application/json')) {
    try { return JSON.parse(raw); } catch (_) { return {}; }
  }
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
  try { return JSON.parse(raw); } catch (_) { return {}; }
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const body = parseBody(req);
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
    problem: clean(body.problem),
    creative: clean(body.creative),
    internal_test: body.internal_test === true || body.internal_test === 'true' || body.internal_test === '1',
    data,
  }));

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true });
}

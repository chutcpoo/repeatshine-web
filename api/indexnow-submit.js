const KEY = 'd3963ca1dcb11ee0b7cba300a08db73b';
const HOST = 'calculator.repeatshine.com';
const URLS = [
  'https://calculator.repeatshine.com/',
  'https://calculator.repeatshine.com/mobile-detailing-slow-bookings/',
  'https://calculator.repeatshine.com/past-customers-not-returning/',
  'https://calculator.repeatshine.com/manual-follow-up/',
];

export default async function handler(req, res) {
  if (req.method !== 'GET' || req.query?.run !== '20260928-r01') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(404).json({ ok: false });
  }

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: URLS,
      }),
    });

    const text = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(response.ok ? 200 : 502).json({
      ok: response.ok,
      indexnowStatus: response.status,
      submitted: URLS.length,
      response: text.slice(0, 300),
    });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: String(error).slice(0, 300) });
  }
}

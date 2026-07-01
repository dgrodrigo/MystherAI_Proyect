const BACKEND = 'http://mysther-ai-alb-1734290767.eu-central-1.elb.amazonaws.com';

module.exports = async function handler(req, res) {
  // req.url inside a catch-all function is the matched segment(s) only.
  // req.query.proxy is an array like ['auth','login'] for /api/auth/login/
  const segments = req.query.proxy || [];
  const pathParts = Array.isArray(segments) ? segments : [segments];
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const backendUrl = `${BACKEND}/api/${pathParts.join('/')}/${qs}`;

  const forwardHeaders = {};
  if (req.headers['content-type'])  forwardHeaders['content-type']  = req.headers['content-type'];
  if (req.headers['cookie'])        forwardHeaders['cookie']         = req.headers['cookie'];
  if (req.headers['x-csrftoken'])   forwardHeaders['x-csrftoken']   = req.headers['x-csrftoken'];

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const body = hasBody && req.body ? JSON.stringify(req.body) : undefined;

  let upstream;
  try {
    upstream = await fetch(backendUrl, { method: req.method, headers: forwardHeaders, body });
  } catch (err) {
    res.status(502).json({ error: 'Backend unreachable', detail: err.message });
    return;
  }

  const setCookie = upstream.headers.get('set-cookie');
  if (setCookie) res.setHeader('Set-Cookie', setCookie);
  res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');

  const text = await upstream.text();
  res.status(upstream.status).send(text);
};

module.exports.config = { api: { bodyParser: true } };

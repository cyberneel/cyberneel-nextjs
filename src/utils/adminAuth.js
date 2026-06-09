import crypto from 'crypto';

// Shared-password auth for the Content Studio. A successful login mints an
// HMAC-signed, time-limited token stored in an HttpOnly cookie. No database
// and no third-party dependency — just ADMIN_SECRET set in the environment.

export const COOKIE_NAME = 'cn_admin';
const SESSION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// Auth is only enforced on real deployments. Local dev (where you author
// against the filesystem) stays frictionless.
export function authRequired() {
  return process.env.NODE_ENV === 'production';
}

function secret() {
  return process.env.ADMIN_SECRET || '';
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex');
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function checkPassword(password) {
  const expected = secret();
  if (!expected) return false;
  return safeEqual(password || '', expected);
}

export function createToken() {
  const exp = String(Date.now() + SESSION_MS);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token) {
  if (!secret() || !token) return false;
  const [payload, sig] = String(token).split('.');
  if (!payload || !sig) return false;
  if (!safeEqual(sign(payload), sig)) return false;
  if (Date.now() > Number(payload)) return false;
  return true;
}

function parseCookies(req) {
  const header = req.headers?.cookie || '';
  return header.split(';').reduce((acc, part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return acc;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) acc[k] = decodeURIComponent(v);
    return acc;
  }, {});
}

export function isAuthed(req) {
  if (!authRequired()) return true; // dev bypass
  return verifyToken(parseCookies(req)[COOKIE_NAME]);
}

// Reject unauthenticated requests. Returns true when the response was ended.
export function rejectUnauthed(req, res) {
  if (isAuthed(req)) return false;
  res.status(401).json({ error: 'Unauthorized.' });
  return true;
}

function cookie(value, maxAgeSeconds) {
  const parts = [
    `${COOKIE_NAME}=${value}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
}

export function setSessionCookie(res) {
  res.setHeader('Set-Cookie', cookie(createToken(), Math.floor(SESSION_MS / 1000)));
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', cookie('', 0));
}

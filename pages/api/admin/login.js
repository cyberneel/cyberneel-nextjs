import {
  authRequired,
  checkPassword,
  isAuthed,
  setSessionCookie,
  clearSessionCookie,
} from '../../../src/utils/adminAuth';

// GET    -> { authed, required }   (lets the UI decide whether to show the gate)
// POST   -> { password }           (sets the session cookie on success)
// DELETE -> logout
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ authed: isAuthed(req), required: authRequired() });
  }

  if (req.method === 'POST') {
    if (!authRequired()) {
      // Dev: nothing to log into.
      return res.status(200).json({ ok: true, authed: true });
    }
    if (!process.env.ADMIN_SECRET) {
      return res.status(500).json({ error: 'ADMIN_SECRET is not configured on the server.' });
    }
    const { password } = req.body || {};
    if (!checkPassword(password)) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }
    setSessionCookie(res);
    return res.status(200).json({ ok: true, authed: true });
  }

  if (req.method === 'DELETE') {
    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed.' });
}

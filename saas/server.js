const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const FREE_LIMIT = 10;

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function getUser(req) {
  const token = req.cookies && req.cookies.sid;
  if (!token) return null;
  const row = db.prepare('SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = ?').get(token);
  return row || null;
}
function requireAuth(req, res, next) {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'login_required' });
  req.user = user;
  next();
}
function usageOf(userId) {
  return db.prepare('SELECT COUNT(*) AS n FROM items WHERE user_id = ?').get(userId).n;
}
function mePayload(user) {
  const used = usageOf(user.id);
  return { email: user.email, tier: user.tier, used, limit: user.tier === 'pro' ? null : FREE_LIMIT };
}
function validEmail(e) { return typeof e === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); }

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body || {};
  if (!validEmail(email)) return res.status(400).json({ error: 'invalid_email' });
  if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ error: 'password_min_8' });
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (exists) return res.status(409).json({ error: 'email_taken' });
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (email, hash) VALUES (?, ?)').run(email.toLowerCase(), hash);
  const newId = Number(info.lastInsertRowid);
  const token = crypto.randomBytes(24).toString('hex');
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, newId);
  res.cookie('sid', token, { httpOnly: true, sameSite: 'lax' });
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(newId);
  res.json(mePayload(user));
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!validEmail(email) || typeof password !== 'string') return res.status(400).json({ error: 'invalid_input' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.hash)) return res.status(401).json({ error: 'bad_credentials' });
  const token = crypto.randomBytes(24).toString('hex');
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id);
  res.cookie('sid', token, { httpOnly: true, sameSite: 'lax' });
  res.json(mePayload(user));
});

app.post('/api/logout', (req, res) => {
  const token = req.cookies && req.cookies.sid;
  if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  res.clearCookie('sid');
  res.json({ ok: true });
});

app.get('/api/me', requireAuth, (req, res) => res.json(mePayload(req.user)));

app.get('/api/items', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT id, title, done FROM items WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  res.json(rows);
});

app.post('/api/items', requireAuth, (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim().slice(0, 200) : '';
  if (!title) return res.status(400).json({ error: 'title_required' });
  if (req.user.tier !== 'pro' && usageOf(req.user.id) >= FREE_LIMIT) {
    return res.status(402).json({ error: 'quota_exceeded', upgrade_url: '/#pricing', limit: FREE_LIMIT });
  }
  const info = db.prepare('INSERT INTO items (user_id, title) VALUES (?, ?)').run(req.user.id, title);
  res.status(201).json({ id: Number(info.lastInsertRowid), title, done: 0 });
});

app.patch('/api/items/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM items WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'not_found' });
  const done = req.body?.done ? 1 : 0;
  const title = typeof req.body?.title === 'string' ? req.body.title.trim().slice(0, 200) : row.title;
  db.prepare('UPDATE items SET done = ?, title = ? WHERE id = ?').run(done, title, row.id);
  res.json({ id: row.id, title, done });
});

app.delete('/api/items/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ ok: true });
});

// Demo upgrade (no real money). Prod uses /api/billing/checkout.
app.post('/api/demo/upgrade', requireAuth, (req, res) => {
  db.prepare("UPDATE users SET tier = 'pro' WHERE id = ?").run(req.user.id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json(mePayload(user));
});

// Stripe-ready stubs
app.post('/api/billing/checkout', requireAuth, (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) return res.status(501).json({ error: 'billing_not_configured', hint: 'Set STRIPE_SECRET_KEY to enable real checkout' });
  res.status(501).json({ error: 'not_implemented' });
});
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return res.status(501).json({ error: 'billing_not_configured' });
  res.json({ received: true });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Mini-SaaS running on http://localhost:${PORT}`));

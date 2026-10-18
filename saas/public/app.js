const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function api(path, opts = {}) {
  const r = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...opts });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw { status: r.status, data };
  return data;
}
function route() {
  const h = (location.hash || '#landing').replace('#', '');
  document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
  ($('view-' + h) || $('view-landing')).classList.remove('hidden');
  if (h === 'app') refresh();
  refreshNav();
}
async function refreshNav() {
  try { const me = await api('/api/me'); $('navUser').textContent = `${me.email} · ${me.tier}`; }
  catch { $('navUser').textContent = ''; }
}
async function refresh() {
  try {
    const me = await api('/api/me');
    $('usage').textContent = me.tier === 'pro' ? `Pro · ${me.used} tasks (unlimited)` : `${me.used}/${me.limit} tasks used`;
    $('barFill').style.width = me.tier === 'pro' ? '100%' : Math.min(100, (me.used / me.limit) * 100) + '%';
    const items = await api('/api/items');
    $('list').innerHTML = items.map((t) => `<li><input type="checkbox" ${t.done ? 'checked' : ''} data-toggle="${t.id}"/><span class="${t.done ? 'done' : ''}">${esc(t.title)}</span><button data-del="${t.id}">✕</button></li>`).join('') || '<li class="muted">No tasks yet.</li>';
  } catch { $('usage').textContent = 'Login required.'; $('list').innerHTML = ''; }
}
$('addBtn').onclick = async () => {
  try { await api('/api/items', { method: 'POST', body: JSON.stringify({ title: $('newTitle').value }) }); $('newTitle').value = ''; refresh(); }
  catch (e) { alert(e.status === 402 ? 'Free limit reached — see Pricing.' : 'Error'); if (e.status === 402) location.hash = '#pricing'; }
};
$('list').onclick = async (e) => {
  const t = e.target.closest('[data-toggle]'), d = e.target.closest('[data-del]');
  if (t) { const items = await api('/api/items'); const it = items.find((x) => x.id == t.dataset.toggle); await api('/api/items/' + t.dataset.toggle, { method: 'PATCH', body: JSON.stringify({ done: !it.done }) }); refresh(); }
  if (d) { await api('/api/items/' + d.dataset.del, { method: 'DELETE' }); refresh(); }
};
$('signupBtn').onclick = async () => { try { await api('/api/signup', { method: 'POST', body: JSON.stringify({ email: $('email').value, password: $('password').value }) }); location.hash = '#app'; } catch (e) { $('authMsg').textContent = JSON.stringify(e.data); } };
$('loginBtn').onclick = async () => { try { await api('/api/login', { method: 'POST', body: JSON.stringify({ email: $('email').value, password: $('password').value }) }); location.hash = '#app'; } catch (e) { $('authMsg').textContent = JSON.stringify(e.data); } };
$('logoutBtn').onclick = async () => { await api('/api/logout', { method: 'POST' }); location.hash = '#landing'; refreshNav(); };
$('upgradeBtn').onclick = async () => { try { await api('/api/demo/upgrade', { method: 'POST' }); alert('Upgraded to Pro (demo)'); location.hash = '#app'; } catch { alert('Login first'); location.hash = '#login'; } };
window.addEventListener('hashchange', route);
route();

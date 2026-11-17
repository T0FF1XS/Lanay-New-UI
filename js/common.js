const $ = (q, e = document) => e.querySelector(q),
  $$ = (q, e = document) => [...e.querySelectorAll(q)];
const L = (a, f) => a.map(f).join('');
const ico = (n, c) => `<svg class="i ${c || ''}"><use href="icons.svg#i-${n}"/></svg>`;

const P = (n) =>
  '₱' + (+n).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const ago = (t) => Math.max(1, Math.round((Date.now() - t) / 6e4)) + ' min';

const M = (id) => MENU.find((m) => m.id == id);
const sum = (o) => o.it.reduce((s, [i, q]) => s + M(i).p * q, 0);
const lines = (o) => o.it.map(([i, q]) => q + '× ' + M(i).n).join(', ');
const live = () => S.orders.filter((o) => o.st != 'paid');
const lg = (t) => T.log.unshift([clock(), R[me].n, t]);
const chip = (t, c) => `<span class="chip ${c || ''}">${t}</span>`;
const tabs = (a, cur, arr) =>
  `<div class="row rise" style="flex-wrap:wrap">${L(arr, ([k, l]) => `<button class="pill ${cur == k ? 'on' : ''}" data-a="${a}" data-v="${k}">${l}</button>`)}</div>`;
const tbl = (h, rows) =>
  `<div class="card rise" style="overflow:auto"><table><tr>${L(h, (x) => `<th>${x}</th>`)}</tr>${L(rows, (r) => `<tr>${L(r, (c) => `<td>${c}</td>`)}</tr>`)}</table></div>`;
const stat = (l, v, pre) =>
  `<div class="card"><span class="mut">${l}</span><div class="big" ${typeof v == 'number' ? `data-n="${v}" data-pre="${pre || ''}"` : ''}>${typeof v == 'number' ? (pre || '') + v.toLocaleString('en') : v}</div></div>`;
const tstat = (n) => {
  const o = live().filter((o) => o.tb == n);
  return !o.length
    ? ['Free', 'ok']
    : S.bill.includes(n)
      ? ['Needs bill', 'bad']
      : o.every((o) => o.st == 'served')
        ? ['Eating', 'info']
        : ['Ordering', 'warn'];
};
const cur = () => U.cur || (U.cur = { tb: 0, it: [] });
const qn = (id) => (cur().it.find((x) => x[0] == id) || [0, 0])[1];
const pic = (m) => ico(m.e) + (m.img ? `<img src="${IMG_DIR + m.img}" alt="${m.n}" onerror="this.remove()">` : '');
const dish = (m) =>
  `<div class="card hov fl ${m.on ? '' : 'off'}"><div class="dish c-${m.c}">${pic(m)}</div><b style="display:block;margin:10px 0 4px">${m.n}</b><div class="row sp push"><b style="color:var(--ac)">${P(m.p)}</b>${m.on ? `<div class="qty"><button data-a="sub" data-v="${m.id}">−</button><b>${qn(m.id)}</b><button class="p" data-a="add" data-v="${m.id}">+</button></div>` : chip('Sold out', 'bad')}</div></div>`;
const browse = () =>
  `<input class="rise" placeholder="Search the menu" oninput="$$('.menu>.card').forEach(c=>c.hidden=!c.textContent.toLowerCase().includes(this.value.toLowerCase()))">` +
  tabs(
    'cat',
    U.cat || 'All',
    ['All', 'Sushi', 'Japanese', 'Drinks'].map((c) => [c, c])
  ) +
  `<div class="grid stag menu">${L(
    MENU.filter((m) => !U.cat || U.cat == 'All' || m.c == U.cat),
    dish
  )}</div>`;
const steps = (s) => {
  const k = ['new', 'preparing', 'ready', 'served'];
  return `<div class="row">${L(['Sent', 'Preparing', 'Ready', 'Served'], (x, i) => `<div class="step ${i <= k.indexOf(s) ? 'on' : ''}"><i></i>${x}</div>`)}</div>`;
};
const qr = (n) => {
  const q = qrcode(0, 'M'),
    m = 2;
  q.addData(qrUrl(n));
  q.make();
  const c = q.getModuleCount();
  let r = '';
  for (let y = 0; y < c; y++) for (let x = 0; x < c; x++) if (q.isDark(y, x)) r += `<rect x="${x + m}" y="${y + m}" width="1" height="1"/>`;
  return `<svg viewBox="0 0 ${c + 2 * m} ${c + 2 * m}" width="140" style="display:block;margin:0 auto 8px;background:#fff">${r}</svg>`;
};
const qrUrl = (n) => new URL('customer.html?table=' + n, location.href).href;
const empty = (e, t, d) =>
  `<div class="card rise" style="text-align:center;padding:48px"><div class="eic">${ico(e)}</div><b>${t}</b><p class="mut">${d}</p></div>`;

const shell = (anim) => {
  const r = R[me],
    nav = L(
      r.nav,
      ([k, l, i]) =>
        `<button class="nav ${k == scr ? 'on' : ''}" data-a="go" data-v="${k}"><b>${ico(i)}</b><span>${l}</span></button>`
    ),
    page = `<div class="page ${anim ? 'in' : ''}">${V[me + '.' + scr]()}</div>`;
  const al = alerts().length;
  return `<div class="shell"><aside class="side"><img class="brand-s" src="${LOGO}" alt="Lanay Restaurant">${nav}<button class="nav" style="margin-top:auto" data-a="out"><b>${ico('log-out')}</b><span>Sign out</span></button></aside><main class="main"><header class="top"><img class="brand-t" src="${LOGO}" alt=""><h1>${r.nav.find((n) => n[0] == scr)[1]}</h1>${chip(r.n)}<button class="btn g ${al ? 'ping' : ''}" data-a="bell">${ico('bell')} ${al || ''}</button></header>${page}</main></div>`;
};
const login = (anim) => {
  const r = R[ROLE];
  return `<div class="login ${anim ? 'in' : ''}"><img class="brand rise" src="${LOGO}" alt="Lanay Restaurant"><h2 class="rise">${r.n}</h2><p class="mut rise">Enter your 4-digit PIN.</p><div class="row dots rise">${L([0, 1, 2, 3], (i) => `<i class="${i < U.pin.length ? 'f' : ''}"></i>`)}</div><div class="pad rise">${L(['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'], (k) => (k ? `<button data-a="key" data-v="${k}">${k}</button>` : '<span></span>'))}</div><a class="btn g" href="index.html">Back to roles</a></div>`;
};
let me = null,
  scr = '',
  U = {};
function render(a) {
  API.save();
  draw(a);
}
function boot() {
  U = { want: ROLE, pin: '' };
  API.load();
  render(1);
}
addEventListener('storage', (e) => {
  if (e.key == API.KP || e.key == API.KT) {
    API.load();
    if (me && !/INPUT|SELECT/.test(document.activeElement.tagName)) draw();
  }
});
function draw(anim) {
  const y = $('.page')?.scrollTop || 0;
  document.body.dataset.role = me || ROLE;
  $('#app').innerHTML = me ? shell(anim) : login(anim);
  const pg = $('.page');
  if (pg) pg.scrollTop = y;
  if (anim) {
    $$('.in .rise,.in .stag>*').forEach((e, i) => e.style.setProperty('--i', i % 12));
    $$('[data-n]').forEach(count);
  }
}
const count = (el) => {
  const n = +el.dataset.n,
    p = el.dataset.pre || '',
    t0 = performance.now();
  (function f(t) {
    const k = Math.min(1, (t - t0) / 800);
    el.textContent = p + Math.round(n * k * (2 - k)).toLocaleString('en');
    if (k < 1) requestAnimationFrame(f);
  })(t0);
};
const modal = (h) => {
  shut();
  const d = document.createElement('div');
  d.className = 'mask';
  d.innerHTML = `<div class="mod">${h}</div>`;
  document.body.append(d);
};
const shut = () => $('.mask')?.remove();
const toast = (t) => {
  const d = document.createElement('div');
  d.className = 'toast';
  d.textContent = t;
  document.body.append(d);
  setTimeout(() => d.remove(), 2300);
};

const A_COMMON = {
  go: (k) => {
    if (R[me].nav.some((n) => n[0] == k)) {
      scr = k;
      render(1);
    }
  },
  key: (k) => {
    if (k == '⌫') U.pin = U.pin.slice(0, -1);
    else if (U.pin.length < 4) U.pin += k;
    render();
    if (U.pin.length == 4) {
      if (U.pin == R[U.want].pin) {
        me = U.want;
        U = {};
        scr = R[me].nav[0][0];
        lg('Signed in');
        render(1);
      } else {
        $('.dots').classList.add('shake');
        setTimeout(() => {
          U.pin = '';
          render();
        }, 450);
      }
    }
  },
  bell: () => {
    const a = alerts();
    modal(
      `<h3>Alerts</h3><div class="col" style="margin-top:12px">${a.length ? L(a, (x) => `<div class="card">${x}</div>`) : '<p class="mut">Nothing needs attention.</p>'}${me == 'waiter' && S.calls.length ? '<button class="btn g" data-a="clr">Clear table calls</button>' : ''}</div>`
    );
  },
  out: () => {
    me = null;
    U = { want: ROLE, pin: '' };
    render(1);
  },
};
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('mask')) return shut();
  const b = e.target.closest('[data-a]');
  if (b && A[b.dataset.a]) A[b.dataset.a](b.dataset.v);
});
document.addEventListener('keydown', (e) => {
  if (!me && U.want) {
    if (/^\d$/.test(e.key)) A.key(e.key);
    if (e.key == 'Backspace') A.key('⌫');
  }
});

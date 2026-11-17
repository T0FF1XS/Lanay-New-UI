const $ = (q, e = document) => e.querySelector(q);
const L = (a, f) => a.map(f).join('');
const ico = (n, c) => `<svg class="i ${c || ''}"><use href="../icons.svg#i-${n}"/></svg>`;
const P = (n) => '₱' + (+n).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const chip = (t, c) => `<span class="chip ${c || ''}">${t}</span>`;
const M = (id) => MENU.find((m) => m.id == id);
const sum = (it) => it.reduce((s, [i, q]) => s + M(i).p * q, 0);
const pic = (m) => `<svg class="ph" viewBox="0 0 200 120"><use href="../icons.svg#ph"/></svg>` + (m.img ? `<img src="../${IMG_DIR + m.img}" alt="${m.n}" onerror="this.remove()">` : '');

const TAB = [
  ['menu', 'Menu', 'utensils'],
  ['order', 'My order', 'shopping-basket'],
  ['help', 'Help', 'hand-helping'],
];
const ST = { new: ['Sent', 'warn'], preparing: ['Preparing', 'info'], ready: ['Ready', 'ok'], served: ['Served', 'ok'] };
let U = { tb: +new URLSearchParams(location.search).get('table') || 0, scr: 'menu', cart: [], cat: 'Must try', q: '', sl: 0, hold: 0, fn: '', ft: '', rate: 0, land: 1 };
if (!TB.includes(U.tb)) U.tb = 0;

const CATI = {
  'Must try': 'flame',
  All: 'layout-grid',
  Unlimited: 'sparkles',
  Ramen: 'soup',
  Korean: 'cooking-pot',
  Maki: 'sushi',
  Sushi: 'sushi',
  Platters: 'sushi',
  Meals: 'drumstick',
  Starters: 'croissant',
  Sides: 'shrimp',
  Bento: 'package',
  Filipino: 'chef-hat',
};
const STI = ['receipt', 'chef-hat', 'concierge-bell', 'utensils'];
const cn = () => U.cart.reduce((a, x) => a + x[1], 0);

const landing = () =>
  `<div class="land"><div class="login in"><div class="lg rise"><img class="brand" src="${LOGO}" alt="Lanay Restaurant"><i class="ring"></i><i class="ring r2"></i></div><p class="mut rise">Welcome to</p><div class="script big rise">Lanay Restaurant</div><div class="rise">${chip('Table ' + U.tb, 'tb-chip')}</div><h2 class="rise">Ready to order?</h2><p class="mut rise">Browse the menu, tap what you like, and we will bring it fresh to your table.</p><button class="btn go ping rise" data-a="start">${ico('utensils')} View the menu</button></div></div>`;

const mine = () => S.orders.filter((o) => o.tb == U.tb && o.st != 'paid');
const qn = (id) => (U.cart.find((x) => x[0] == id) || [0, 0])[1];

const ctl = (m) =>
  !m.on
    ? chip('Sold out', 'bad')
    : qn(m.id)
      ? `<div class="qty"><button data-a="sub" data-v="${m.id}">−</button><b>${qn(m.id)}</b><button class="p" data-a="add" data-v="${m.id}">+</button></div>`
      : `<button class="add" data-a="add" data-v="${m.id}">+ Add</button>`;

const dish = (m, tag) =>
  `<div class="card dish-row ${m.on ? '' : 'off'}"><div class="dish c-${m.c}">${pic(m)}${m.t && tag ? `<span class="tag">${ico('flame')}</span>` : ''}</div><div class="info-col"><b class="nm">${m.n}</b>${tag ? `<small class="mut cn">${m.c}</small>` : ''}${m.d ? `<small class="mut ds ${m.d.length > 70 ? 'more' : ''}" data-a="more">${m.d}</small>` : ''}<div class="row sp push"><b class="pr">${P(m.p).replace('.00', '')}</b>${ctl(m)}</div></div></div>`;

const sec = (t) => `<h3 class="sec">${t}</h3>`;

const find = () => list() || `<div class="empty-note">Nothing here right now</div>`;

const list = () => {
  const q = U.q.trim().toLowerCase();
  if (q) {
    const r = MENU.filter((m) => (m.n + ' ' + (m.d || '') + ' ' + m.c).toLowerCase().includes(q));
    return r.length ? sec(r.length + (r.length == 1 ? ' result' : ' results')) + L(r, (m) => dish(m, 1)) : `<div class="empty-note">Nothing matches "${q.replace(/</g, '&lt;')}"</div>`;
  }
  if (U.cat == 'Must try') return L(MENU.filter((m) => m.t), (m) => dish(m, 1));
  if (U.cat == 'All') return L(CATS, (c) => sec(c) + L(MENU.filter((m) => m.c == c), (m) => dish(m)));
  return L(MENU.filter((m) => m.c == U.cat), (m) => dish(m));
};

const FEAT = ['Unlimited Maki, Ramen & Tempura', 'Torch Salmon Roll', 'Baked Sushi Regular', 'Tantanmen', 'Chef Special Bento', 'Beef Kare-Kare'];
const LINE = { Unlimited: 'Eat all you want', Maki: 'Fresh rolled', Sushi: 'Oven baked', Ramen: 'Hot and slurpy', Bento: 'A whole meal in a box', Filipino: 'Home cooked favorite' };

const slides = () => {
  const items = FEAT.map((n) => MENU.find((m) => m.n == n && m.on)).filter(Boolean);
  const first = `<div class="slide sl-red"><img class="sl-logo" src="${LOGO}" alt="Lanay Restaurant"><div class="sl-tx wl">${chip('Table ' + U.tb)}<div class="script">Welcome to Lanay</div><p>Pick your dishes and we will bring them fresh to your table.</p></div></div>`;
  const rest = L(items, (m) => `<div class="slide sl-${m.c}"><div class="dish sl-pic c-${m.c}">${pic(m)}</div><div class="sl-tx"><small>${LINE[m.c] || 'Chef pick'}</small><b>${m.n}</b><div class="row sl-ft"><b>${P(m.p).replace('.00', '')}</b><button class="add" data-a="add" data-v="${m.id}">+ Add</button></div></div></div>`);
  const n = items.length + 1;
  return `<div class="hero rise"><div class="slides">${first + rest}</div><div class="dots-s">${L([...Array(n).keys()], (i) => `<button class="${i == U.sl ? 'on' : ''}" data-a="slide" data-v="${i}" aria-label="Slide ${i + 1}"></button>`)}</div></div>`;
};

const V = {
  menu: () => {
    const n = cn(),
      q = U.q.trim();
    return (
      slides() +
      `<div class="mbar rise"><input class="search" type="search" value="${U.q.replace(/"/g, '&quot;')}" placeholder="Search dishes" data-in="q"><div class="row cats">${L(['Must try', ...CATS, 'All'], (c) => `<button class="pill ${!q && U.cat == c ? 'on' : ''}" data-a="cat" data-v="${c}">${ico(CATI[c])} ${c}</button>`)}</div></div>` +
      `<div class="grid stag menu">${find()}</div>` +
      (n ? `<button class="cartbar" data-a="go" data-v="order"><b class="n">${n}</b><span>View my order</span><b>${P(sum(U.cart))}</b></button>` : '')
    );
  },
  order: () => {
    const os = mine(),
      k = ['new', 'preparing', 'ready', 'served'];
    if (!U.cart.length && !os.length)
      return `<div class="card rise" style="text-align:center;padding:48px"><div class="eic">${ico('shopping-basket')}</div><b>Nothing ordered yet</b><p class="mut">Pick your dishes from the menu.</p><button class="btn" data-a="go" data-v="menu">Open the menu</button></div>`;
    return (
      (U.cart.length
        ? `<div class="card col rise"><h3>Your new order</h3>${L(U.cart, ([i, q]) => `<div class="row sp"><span>${ico(M(i).e)} ${M(i).n}</span><div class="qty"><button data-a="sub" data-v="${i}">−</button><b>${q}</b><button class="p" data-a="add" data-v="${i}">+</button></div></div>`)}<div class="row sp"><b>Total</b><b class="big" style="font-size:22px">${P(sum(U.cart))}</b></div><button class="btn w" data-a="place">${ico('chef-hat')} Send to the kitchen</button></div>`
        : '') +
      L(os, (o) => `<div class="card tint col rise"><div class="row sp"><b>Order #${o.id}</b>${chip(ST[o.st][0], ST[o.st][1])}</div><div class="row">${L(['Sent', 'Preparing', 'Ready', 'Served'], (x, i) => `<div class="step ${i <= k.indexOf(o.st) ? 'on' : ''}"><i>${ico(STI[i])}</i>${x}</div>`)}</div><div class="mut">${o.it.map(([i, q]) => q + '× ' + M(i).n).join(', ')}</div><b>${P(sum(o.it))}</b></div>`) +
      (os.length ? `<div class="row sp rise order-total"><b>Table total</b><b class="big" style="font-size:22px">${P(os.reduce((a, o) => a + sum(o.it), 0))}</b></div>` : '') +
      (S.set.vat ? `<p class="mut">Prices include VAT.</p>` : '')
    );
  },
  help: () =>
    `<div class="card col rise"><h3>Need something?</h3><div class="tiles"><button class="tile" data-a="call"><span>${ico('bell')}</span>Call a waiter</button>${S.bill.includes(U.tb) ? `<div class="tile done"><span>${ico('receipt')}</span>Bill requested<small>A waiter is coming</small></div>` : `<button class="tile" data-a="bill"><span>${ico('receipt')}</span>Ask for the bill</button>`}</div></div>` +
    `<div class="card col rise"><h3>How was it?</h3><div class="row gold" style="justify-content:center">${L([1, 2, 3, 4, 5], (k) => `<button class="star ${k <= U.rate ? 'on' : ''}" data-a="rate" data-v="${k}">${ico('star', k <= U.rate ? 'fill' : '')}</button>`)}</div><div class="rate-label">${['', 'Poor', 'Fair', 'Good', 'Great', 'Loved it!'][U.rate]}</div><input id="fn" data-in="fn" value="${U.fn.replace(/"/g, '&quot;')}" placeholder="Your name (optional)"><input id="ft" data-in="ft" value="${U.ft.replace(/"/g, '&quot;')}" placeholder="Tell us more (optional)"><button class="btn w" data-a="fb">Send feedback</button></div>`,
};

const draw = (anim) => {
  U.cart = U.cart.filter(([i]) => M(i));
  document.body.dataset.role = 'customer';
  const logo = `<img class="brand rise" src="${LOGO}" alt="Lanay Restaurant">`,
    box = (x) => `<div class="login ${anim ? 'in' : ''}">${logo}${x}</div>`,
    y = $('.page')?.scrollTop || 0;
  $('#app').innerHTML = !S.set.qr
    ? box('<h2 class="rise">Ordering from your phone is off</h2><p class="mut rise">Please call a waiter and we will take your order.</p>')
    : !U.tb
      ? box('<h2 class="rise">Welcome</h2><p class="mut rise">Please scan the QR code on your table to order.</p>')
      : U.land
        ? landing()
        : `<div class="shell cust"><header class="top"><img class="logo-s" src="${LOGO}" alt=""><h1>${TAB.find((t) => t[0] == U.scr)[1]}</h1>${chip('Table ' + U.tb, 'tb-chip')}</header><div class="page ${anim ? 'in' : ''}">${V[U.scr]()}</div><nav class="tabs">${L(TAB, ([k, l, i]) => `<button class="nav ${k == U.scr ? 'on' : ''}" data-a="go" data-v="${k}"><b>${ico(i)}${k == 'order' && cn() ? `<em class="bdg">${cn()}</em>` : ''}</b><span>${l}</span></button>`)}</nav></div>`;
  if ($('.page')) $('.page').scrollTop = y;
  if ($('.slides')) $('.slides').scrollLeft = U.sl * $('.slides').clientWidth;
  $('.cats .pill.on')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  if (anim) document.querySelectorAll('.in .rise,.in .stag>*').forEach((e, i) => e.style.setProperty('--i', i % 12));
};
const render = (anim) => {
  API.save();
  draw(anim);
};
const toast = (t) => {
  const d = document.createElement('div');
  d.className = 'toast';
  d.textContent = t;
  document.body.append(d);
  setTimeout(() => d.remove(), 2300);
};

const A = {
  start: () => {
    if ($('.wipe')) return;
    const w = document.createElement('div');
    w.className = 'wipe';
    w.innerHTML = `<img src="${LOGO}" alt="">`;
    document.body.append(w);
    setTimeout(() => ((U.land = 0), render(1)), 550);
    setTimeout(() => w.remove(), 1100);
  },
  go: (k) => ((U.scr = k), render(1)),
  cat: (c) => ((U.cat = c), (U.q = ''), render(), ($('.page').scrollTop = 0)),
  slide: (i) => {
    const s = $('.slides');
    U.hold = Date.now() + 9000;
    if (s) s.scrollTo({ left: i * s.clientWidth, behavior: 'smooth' });
  },
  more: (v, b) => b.classList.toggle('open'),
  add: (id) => {
    const x = U.cart.find((x) => x[0] == id);
    x ? x[1]++ : U.cart.push([+id, 1]);
    render();
  },
  sub: (id) => {
    const x = U.cart.find((x) => x[0] == id);
    if (x && --x[1] < 1) U.cart = U.cart.filter((y) => y != x);
    render();
  },
  place: () => {
    if (U.cart.some(([i]) => !M(i).on)) return toast('A dish just sold out, please remove it');
    S.orders.push({ id: ++S.n, tb: U.tb, it: U.cart.map((x) => [...x]), st: 'new', t: Date.now() });
    U.cart = [];
    toast('Order sent to the kitchen');
    render();
  },
  call: () => {
    if (S.calls.some((c) => c.tb == U.tb)) return toast('A waiter is already on the way');
    S.calls.push({ tb: U.tb, w: 'is calling a waiter' });
    toast('A waiter is on the way');
    render();
  },
  bill: () => {
    if (!mine().length) return toast('You have not ordered yet');
    S.bill.push(U.tb);
    toast('We will bring your bill');
    render();
  },
  rate: (k) => ((U.rate = +k), render()),
  fb: () => {
    if (!U.rate) return toast('Tap the stars first');
    S.fb.unshift([$('#fn').value.trim() || 'Guest', U.rate, $('#ft').value.trim()]);
    U.rate = 0;
    U.fn = U.ft = '';
    toast('Thank you for your feedback!');
    render();
  },
};
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-a]');
  if (b && A[b.dataset.a]) A[b.dataset.a](b.dataset.v, b);
});
document.addEventListener('input', (e) => {
  const k = e.target.dataset.in;
  if (k == 'fn' || k == 'ft') return void (U[k] = e.target.value);
  if (k != 'q') return;
  U.q = e.target.value;
  $('.menu').innerHTML = find();
  document.querySelectorAll('.cats .pill').forEach((p) => p.classList.toggle('on', !U.q.trim() && p.dataset.v == U.cat));
  $('.page').scrollTop = 0;
});
document.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.slides')) U.hold = Date.now() + 9000;
});
document.addEventListener(
  'scroll',
  (e) => {
    const s = e.target;
    if (!s.classList || !s.classList.contains('slides')) return;
    U.sl = Math.round(s.scrollLeft / s.clientWidth);
    document.querySelectorAll('.dots-s button').forEach((d, i) => d.classList.toggle('on', i == U.sl));
  },
  true
);
setInterval(() => {
  const s = $('.slides');
  if (!s || U.land || document.hidden || Date.now() < U.hold) return;
  s.scrollTo({ left: ((U.sl + 1) % s.children.length) * s.clientWidth, behavior: 'smooth' });
}, 4500);
addEventListener('storage', (e) => {
  if (e.key == API.KP) {
    API.load();
    if (!U.land && !/INPUT/.test(document.activeElement.tagName)) draw();
  }
});
API.load();
render(1);

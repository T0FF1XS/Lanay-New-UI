const $ = (q, e = document) => e.querySelector(q);
const L = (a, f) => a.map(f).join('');
const ico = (n, c) => `<svg class="i ${c || ''}"><use href="icons.svg#i-${n}"/></svg>`;
const P = (n) => '₱' + (+n).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const chip = (t, c) => `<span class="chip ${c || ''}">${t}</span>`;
const M = (id) => MENU.find((m) => m.id == id);
const sum = (it) => it.reduce((s, [i, q]) => s + M(i).p * q, 0);
const pic = (m) => ico(m.e) + (m.img ? `<img src="${IMG_DIR + m.img}" alt="${m.n}" onerror="this.remove()">` : '');

const TAB = [
  ['menu', 'Menu', 'utensils'],
  ['order', 'My order', 'shopping-basket'],
  ['help', 'Help', 'hand-helping'],
];
const ST = { new: ['Sent', 'warn'], preparing: ['Preparing', 'info'], ready: ['Ready', 'ok'], served: ['Served', 'ok'] };
let U = { tb: +new URLSearchParams(location.search).get('table') || 0, scr: 'menu', cart: [], cat: 'All', rate: 0 };
if (!TB.includes(U.tb)) U.tb = 0;

const mine = () => S.orders.filter((o) => o.tb == U.tb && o.st != 'paid');
const qn = (id) => (U.cart.find((x) => x[0] == id) || [0, 0])[1];

const dish = (m) =>
  `<div class="card hov fl ${m.on ? '' : 'off'}"><div class="dish c-${m.c}">${pic(m)}</div><b style="display:block;margin:10px 0 4px">${m.n}</b><div class="row sp push"><b style="color:var(--ac)">${P(m.p)}</b>${m.on ? `<div class="qty"><button data-a="sub" data-v="${m.id}">−</button><b>${qn(m.id)}</b><button class="p" data-a="add" data-v="${m.id}">+</button></div>` : chip('Sold out', 'bad')}</div></div>`;

const V = {
  menu: () => {
    const n = U.cart.reduce((a, x) => a + x[1], 0);
    return (
      `<input class="rise" placeholder="Search the menu" oninput="document.querySelectorAll('.menu>.card').forEach(c=>c.hidden=!c.textContent.toLowerCase().includes(this.value.toLowerCase()))">` +
      `<div class="row rise" style="flex-wrap:wrap">${L(['All', 'Sushi', 'Japanese', 'Drinks'], (c) => `<button class="pill ${U.cat == c ? 'on' : ''}" data-a="cat" data-v="${c}">${c}</button>`)}</div>` +
      `<div class="grid stag menu">${L(MENU.filter((m) => U.cat == 'All' || m.c == U.cat), dish)}</div>` +
      (n ? `<button class="btn w" style="position:sticky;bottom:0" data-a="go" data-v="order">View my order · ${n} ${n == 1 ? 'item' : 'items'} · ${P(sum(U.cart))}</button>` : '')
    );
  },
  order: () => {
    const os = mine(),
      k = ['new', 'preparing', 'ready', 'served'];
    if (!U.cart.length && !os.length)
      return `<div class="card rise" style="text-align:center;padding:48px"><div class="eic">${ico('shopping-basket')}</div><b>Nothing ordered yet</b><p class="mut">Pick your dishes from the menu.</p><button class="btn" data-a="go" data-v="menu">Open the menu</button></div>`;
    return (
      (U.cart.length
        ? `<div class="card col rise"><h3>Your new order</h3>${L(U.cart, ([i, q]) => `<div class="row sp"><span>${ico(M(i).e)} ${M(i).n}</span><div class="qty"><button data-a="sub" data-v="${i}">−</button><b>${q}</b><button class="p" data-a="add" data-v="${i}">+</button></div></div>`)}<div class="row sp"><b>Total</b><b class="big" style="font-size:22px">${P(sum(U.cart))}</b></div><button class="btn w" data-a="place">Send to the kitchen</button></div>`
        : '') +
      L(os, (o) => `<div class="card tint col rise"><div class="row sp"><b>Order #${o.id}</b>${chip(ST[o.st][0], ST[o.st][1])}</div><div class="row">${L(['Sent', 'Preparing', 'Ready', 'Served'], (x, i) => `<div class="step ${i <= k.indexOf(o.st) ? 'on' : ''}"><i></i>${x}</div>`)}</div><div class="mut">${o.it.map(([i, q]) => q + '× ' + M(i).n).join(', ')}</div><b>${P(sum(o.it))}</b></div>`) +
      (os.length ? `<div class="row sp rise"><b>Table total</b><b class="big" style="font-size:22px">${P(os.reduce((a, o) => a + sum(o.it), 0))}</b></div>` : '') +
      (S.set.vat ? `<p class="mut">Prices include VAT.</p>` : '')
    );
  },
  help: () =>
    `<div class="card col rise"><h3>Need something?</h3><button class="btn w" data-a="call">${ico('bell')} Call a waiter</button>${S.bill.includes(U.tb) ? chip('Bill requested, a waiter is coming', 'ok') : `<button class="btn g w" data-a="bill">${ico('receipt')} Ask for the bill</button>`}</div>` +
    `<div class="card col rise"><h3>How was it?</h3><div class="row gold" style="justify-content:center">${L([1, 2, 3, 4, 5], (k) => `<button class="star ${k <= U.rate ? 'on' : ''}" data-a="rate" data-v="${k}">${ico('star', k <= U.rate ? 'fill' : '')}</button>`)}</div><input id="fn" placeholder="Your name (optional)"><input id="ft" placeholder="Tell us more (optional)"><button class="btn w" data-a="fb">Send feedback</button></div>`,
};

const draw = (anim) => {
  document.body.dataset.role = 'customer';
  const logo = `<img class="brand rise" src="${LOGO}" alt="Lanay Restaurant">`,
    box = (x) => `<div class="login ${anim ? 'in' : ''}">${logo}${x}</div>`,
    y = $('.page')?.scrollTop || 0;
  $('#app').innerHTML = !S.set.qr
    ? box('<h2 class="rise">Ordering from your phone is off</h2><p class="mut rise">Please call a waiter and we will take your order.</p>')
    : !U.tb
      ? box(`<h2 class="rise">Welcome</h2><p class="mut rise">Which table are you at?</p><div class="row rise" style="flex-wrap:wrap;justify-content:center">${L(TB, (n) => `<button class="pill" data-a="tb" data-v="${n}">Table ${n}</button>`)}</div>`)
      : `<div class="shell ph"><header class="top"><h1>${TAB.find((t) => t[0] == U.scr)[1]}</h1>${chip('Table ' + U.tb)}</header><div class="page ${anim ? 'in' : ''}">${V[U.scr]()}</div><nav class="tabs">${L(TAB, ([k, l, i]) => `<button class="nav ${k == U.scr ? 'on' : ''}" data-a="go" data-v="${k}"><b>${ico(i)}</b><span>${l}</span></button>`)}</nav></div>`;
  if ($('.page')) $('.page').scrollTop = y;
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
  tb: (n) => ((U.tb = +n), render(1)),
  go: (k) => ((U.scr = k), render(1)),
  cat: (c) => ((U.cat = c), render()),
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
    toast('Thank you for your feedback!');
    render();
  },
};
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-a]');
  if (b && A[b.dataset.a]) A[b.dataset.a](b.dataset.v);
});
addEventListener('storage', (e) => {
  if (e.key == API.KP) {
    API.load();
    if (!/INPUT/.test(document.activeElement.tagName)) draw();
  }
});
API.load();
render(1);

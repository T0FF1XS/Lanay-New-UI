const ROLE = 'kitchen';
const R = {
  kitchen: {
    n: 'Kitchen',
    d: 'Tickets and timers',
    e: 'flame',
    pin: '2222',
    nav: [
      ['tickets', 'Tickets', 'ticket'],
      ['status', 'Menu status', 'utensils'],
      ['waste', 'Waste log', 'trash-2'],
    ],
  },
};
const alerts = () =>
  live()
    .filter((o) => o.st == 'new')
    .map((o) => `New order #${o.id} for table ${o.tb}`);
const V = {
  'kitchen.tickets': () => {
    const os = live().filter((o) => o.st != 'served'),
      f = U.f || 'all',
      v = os.filter((o) => f == 'all' || o.st == f),
      ct = (k) => os.filter((o) => o.st == k).length;
    const nx = { new: ['Start cooking', 'preparing'], preparing: ['Mark ready', 'ready'] },
      nm = { new: 'New', preparing: 'In kitchen', ready: 'Ready' },
      cl = { new: 'warn', preparing: 'info', ready: 'ok' };
    return (
      tabs('f', f, [
        ['all', 'All (' + os.length + ')'],
        ['new', 'New (' + ct('new') + ')'],
        ['preparing', 'Preparing (' + ct('preparing') + ')'],
        ['ready', 'Ready (' + ct('ready') + ')'],
      ]) +
      (v.length
        ? `<div class="grid stag" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">${L(v, (o) => `<div class="card tint col"><div class="row sp"><b>Order #${o.id}</b>${chip(nm[o.st], cl[o.st])}</div><div class="mut">Table ${o.tb}, ${ago(o.t)} ago</div><div class="body">${L(o.it, ([i, q, n]) => `<div>${q}× ${M(i).n}${n ? `<div class="mut">${n}</div>` : ''}</div>`)}</div><div class="act">${nx[o.st] ? `<button class="btn" data-a="st" data-v="${o.id}:${nx[o.st][1]}">${nx[o.st][0]}</button>` : '<span class="mut">Waiting for the waiter</span>'}</div></div>`)}</div>`
        : empty('chef-hat', 'No open orders', 'New orders show up here.'))
    );
  },
  'kitchen.status': () =>
    `<p class="mut rise">Switch a dish off and nobody can order it.</p><div class="grid stag">${L(MENU, (m) => `<div class="card ${m.on ? '' : 'off'}"><div class="dish c-${m.c}">${pic(m)}</div><div class="row sp" style="margin-top:10px"><b>${m.n}</b><button class="sw ${m.on ? 'on' : ''}" data-a="tog" data-v="${m.id}"></button></div></div>`)}</div>`,
  'kitchen.waste': () =>
    `<div class="two">${T.waste.length ? tbl(['Time', 'Item', 'Amount', 'Reason'], T.waste) : empty('recycle', 'Nothing logged yet', 'Log spills, expired items and wrong orders.')}<div class="card col rise" style="align-self:start"><h3>Log waste</h3><select id="wi">${L([...T.stock.map((s) => s[0]), ...MENU.map((m) => m.n)], (x) => `<option>${x}</option>`)}</select><input id="wa" placeholder="Amount, e.g. 100 g"><select id="wr"><option>Expired</option><option>Spilled</option><option>Wrong order</option></select><button class="btn" data-a="waste">Save</button></div></div>`,
};
const A = {
  ...A_COMMON,
  f: (v) => {
    U.f = v;
    render();
  },
  st: (v) => {
    const [i, s] = v.split(':');
    S.orders.find((o) => o.id == i).st = s;
    lg(`Order #${i} is ${s}`);
    render();
    toast(`Order #${i} is ${s}`);
  },
  tog: (id) => {
    const m = M(id);
    m.on ^= 1;
    lg(`${m.n} ${m.on ? 'back on the menu' : 'marked sold out'}`);
    render();
  },
  waste: () => {
    if (!$('#wa').value) return toast('Enter an amount');
    T.waste.unshift([clock(), $('#wi').value, $('#wa').value, $('#wr').value]);
    lg('Logged waste: ' + $('#wi').value);
    render();
    toast('Waste saved');
  },
};
boot();

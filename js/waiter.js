const ROLE = 'waiter';
const R = {
  waiter: {
    n: 'Waiter',
    d: 'Tables and orders',
    e: 'concierge-bell',
    pin: '1111',
    nav: [
      ['tables', 'Tables', 'layout-grid'],
      ['order', 'Take order', 'clipboard-pen'],
      ['ready', 'Ready to serve', 'concierge-bell'],
    ],
  },
};
const alerts = () => [
  ...S.calls.map((c) => `Table ${c.tb}: ${c.w}`),
  ...live()
    .filter((o) => o.st == 'ready')
    .map((o) => `Table ${o.tb}: order ready to serve`),
];
const V = {
  'waiter.tables': () => {
    const st = TB.map(tstat),
      c = (k) => st.filter((s) => s[0] == k).length;
    return `<div class="grid stag">${L(['Free', 'Ordering', 'Eating', 'Needs bill'], (k) => stat(k, c(k)))}</div><h3>Tables</h3><div class="grid stag">${L(
      TB,
      (n) => {
        const o = live().filter((o) => o.tb == n),
          s = st[n - 1];
        return `<button class="card hov" data-a="tbl" data-v="${n}"><div class="tb"></div><div class="row sp"><b>Table ${n}</b>${chip(s[0], s[1])}</div><div class="mut">${SEATS[n - 1]} seats, ${o.length ? P(o.reduce((a, x) => a + sum(x), 0)) : 'tap to start'}</div></button>`;
      }
    )}</div>`;
  },
  'waiter.order': () => {
    const c = cur(),
      t = sum(c);
    return `<div class="two rev"><div class="col">${browse()}</div><div class="card col rise" style="align-self:start"><h3>Current order</h3><select onchange="U.cur.tb=+this.value"><option value="0">Choose a table</option>${L(
      TB.filter((n) => tstat(n)[0] == 'Free' || n == c.tb),
      (n) => `<option value="${n}" ${n == c.tb ? 'selected' : ''}>Table ${n}</option>`
    )}</select>${c.it.length ? L(c.it, ([i, q]) => `<div class="row sp"><span>${ico(M(i).e)} ${M(i).n}</span><b>${q}×</b></div>`) : '<p class="mut">Tap + to add dishes.</p>'}<div class="row sp"><b>Total</b><b class="big" style="font-size:22px">${P(t)}</b></div><button class="btn w" data-a="place">Place order</button></div></div>`;
  },
  'waiter.ready': () => {
    const v = live().filter((o) => o.st == 'ready');
    return v.length
      ? `<div class="grid stag">${L(v, (o) => `<div class="card tint col"><div class="row sp"><b>Table ${o.tb}</b>${chip('Waiting ' + ago(o.t), 'ok')}</div><div class="body mut">${lines(o)}</div><div class="act"><button class="btn" data-a="st" data-v="${o.id}:served">Mark served</button></div></div>`)}</div>`
      : empty('sparkles', 'All caught up', 'No dishes are waiting to be served.');
  },
};
const A = {
  ...A_COMMON,
  clr: () => {
    S.calls = [];
    shut();
    render();
  },
  cat: (v) => {
    U.cat = v;
    render();
  },
  add: (id) => {
    const it = cur().it,
      x = it.find((x) => x[0] == id);
    x ? x[1]++ : it.push([+id, 1]);
    render();
  },
  sub: (id) => {
    const c = cur(),
      x = c.it.find((x) => x[0] == id);
    if (x && --x[1] < 1) c.it = c.it.filter((y) => y != x);
    render();
  },
  place: () => {
    const c = cur();
    if (!c.tb) return toast('Choose a table first');
    if (!c.it.length) return toast('Add a dish first');
    S.orders.push({ id: ++S.n, tb: c.tb, it: c.it.map((x) => [...x]), st: 'new', t: Date.now() });
    lg(`Order #${S.n} for table ${c.tb}`);
    c.it = [];
    if (me == 'waiter') c.tb = 0;
    toast('Order sent to the kitchen');
    render();
  },
  tbl: (n) => {
    n = +n;
    const o = live().filter((o) => o.tb == n);
    if (!o.length) {
      U.cur = { tb: n, it: [] };
      return A.go('order');
    }
    const t = o.reduce((a, x) => a + sum(x), 0),
      fr = TB.filter((k) => tstat(k)[0] == 'Free');
    modal(
      `<h2>Table ${n}</h2><p class="mut">${o.map(lines).join('; ')}</p><div class="row sp" style="margin:14px 0"><b>Total</b><b>${P(t)}</b></div><div class="col"><label class="mut">Split the bill evenly between</label><div class="row"><input type="number" min="1" value="2" oninput="$('#spa').textContent=P(${t}/Math.max(1,this.value))"><b id="spa" style="white-space:nowrap">${P(t / 2)}</b></div><label class="mut">Move this table to</label>${fr.length ? `<div class="row"><select id="mv">${L(fr, (k) => `<option>${k}</option>`)}</select><button class="btn" data-a="move" data-v="${n}">Move order</button></div>` : '<p class="mut">No free tables.</p>'}</div>`
    );
  },
  move: (n) => {
    const to = +$('#mv').value;
    S.orders.forEach((o) => o.tb == n && o.st != 'paid' && (o.tb = to));
    S.bill = S.bill.map((t) => (t == n ? to : t));
    lg(`Moved table ${n} to ${to}`);
    shut();
    render();
    toast('Moved to table ' + to);
  },
  st: (v) => {
    const [i, s] = v.split(':');
    S.orders.find((o) => o.id == i).st = s;
    lg(`Order #${i} is ${s}`);
    render();
    toast(`Order #${i} is ${s}`);
  },
};
boot();

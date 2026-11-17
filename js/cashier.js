/* cashier page: only the cashier screens and actions live here */
const ROLE = 'cashier';
const R = {
  cashier: {
    n: 'Cashier',
    d: 'Bills and payments',
    e: 'wallet',
    pin: '3333',
    nav: [
      ['bills', 'Orders and billing', 'receipt'],
      ['shift', 'Close shift', 'lock'],
    ],
  },
};
const alerts = () => S.bill.map((t) => `Table ${t} asked for the bill`);
/* cashier bill panel and receipt */
const bill = (o) => {
  const d = U.d || 'None',
    sub = sum(o),
    due = sub * (d == 'None' ? 1 : 0.8),
    m = U.m || 'Cash';
  return `<div class="card col rise" style="align-self:start"><h3>Bill, Table ${o.tb}</h3>${L(o.it, ([i, q]) => `<div class="row sp"><span>${q}× ${M(i).n}</span><span>${P(M(i).p * q)}</span></div>`)}<div class="row sp"><span class="mut">Subtotal</span><span>${P(sub)}</span></div>${tabs(
    'disc',
    d,
    ['None', 'Senior', 'PWD'].map((x) => [x, x])
  )}${d != 'None' ? `<input placeholder="Name on ID" value="${U.nm || ''}" oninput="U.nm=this.value"><input placeholder="ID number" value="${U.id || ''}" oninput="U.id=this.value"><div class="row sp"><span class="mut">${d} discount, 20%</span><span>−${P(sub - due)}</span></div>` : ''}<div class="row sp"><b>Total due</b><b class="big" style="font-size:22px">${P(due)}</b></div>${tabs(
    'meth',
    m,
    ['Cash', 'GCash', 'Card'].map((x) => [x, x])
  )}${m == 'Cash' ? `<input type="number" placeholder="Cash received" value="${U.r || ''}" oninput="U.r=+this.value;$('#chg').textContent=P(Math.max(0,this.value-${due}))"><div class="row">${L([500, 1000, 2000], (n) => `<button class="pill" data-a="quick" data-v="${n}">${n}</button>`)}</div><div class="row sp"><span class="mut">Change due</span><b id="chg">${P(Math.max(0, (U.r || 0) - due))}</b></div>` : ''}<button class="btn w" data-a="pay">Process payment</button></div>`;
};
const receipt = (o, due, m, r) =>
  `<div class="col" style="text-align:center"><img class="brand" style="width:96px;height:96px" src="${LOGO}" alt="Lanay Restaurant"><div class="mut">Receipt #${o.id}, Table ${o.tb}</div><div class="col" style="text-align:left">${L(o.it, ([i, q]) => `<div class="row sp"><span>${q}× ${M(i).n}</span><span>${P(M(i).p * q)}</span></div>`)}</div><div class="row sp"><b>Total</b><b>${P(due)}</b></div><div class="row sp"><span>${m}</span><span>${m == 'Cash' ? 'Change ' + P(r - due) : 'Paid'}</span></div><p class="mut">Thank you for dining with us!</p><button class="btn w" onclick="print()">Print receipt</button><button class="btn g w" onclick="shut()">Done</button></div>`;

const V = {
  'cashier.bills': () => {
    const f = U.f || 'all',
      os = live().filter((o) => f == 'all' || (f == 'pay' ? o.st == 'served' : o.st != 'served')),
      o = S.orders.find((x) => x.id == U.pay);
    return `<div class="two ${o ? 'rev' : ''}"><div class="col">${tabs('f', f, [
      ['all', 'All'],
      ['pay', 'Awaiting payment'],
      ['wip', 'In progress'],
    ])}<input class="rise" placeholder="Search order or table" oninput="$$('.rows>*').forEach(c=>c.hidden=!c.textContent.toLowerCase().includes(this.value.toLowerCase()))"><div class="col stag rows">${os.length ? L(os, (x) => `<button class="card hov row sp" data-a="sel" data-v="${x.id}" ${x.st == 'served' ? '' : 'disabled style="opacity:.6;cursor:default"'}><div><b>#${x.id}, Table ${x.tb}</b><div class="mut">${lines(x)}</div></div><div style="text-align:right"><b>${P(sum(x))}</b><br>${S.bill.includes(x.tb) ? chip('Asked for bill', 'bad') : x.st == 'served' ? chip('Ready to pay', 'ok') : chip('In progress', 'warn')}</div></button>`) : '<div class="card">No orders.</div>'}</div></div>${o ? bill(o) : empty('receipt', 'Pick an order', 'Only served orders can be paid.')}</div>`;
  },
  'cashier.shift': () => {
    const ex = 1000 + T.cash;
    return `<div class="card col rise" style="max-width:480px"><h3>Count the cash</h3><div class="row sp"><span class="mut">Opening float</span><b>${P(1000)}</b></div><div class="row sp"><span class="mut">Cash payments today</span><b>${P(T.cash)}</b></div><div class="row sp"><span class="mut">Expected in drawer</span><b>${P(ex)}</b></div><input type="number" placeholder="Cash counted" oninput="$('#df').textContent=this.value?(this.value>=${ex}?'Over ':'Short ')+P(Math.abs(this.value-${ex})):'-'"><div class="row sp"><span class="mut">Difference</span><b id="df">-</b></div><button class="btn" data-a="shift">Close shift</button></div>`;
  },
};
const A = {
  ...A_COMMON,
  f: (v) => {
    U.f = v;
    render();
  },
  sel: (id) => {
    Object.assign(U, { pay: +id, d: 'None', m: 'Cash', r: 0, nm: '', id: '' });
    render();
  },
  disc: (v) => {
    U.d = v;
    render();
  },
  meth: (v) => {
    U.m = v;
    render();
  },
  quick: (v) => {
    U.r = +v;
    render();
  },
  pay: () => {
    const o = S.orders.find((o) => o.id == U.pay),
      d = U.d,
      m = U.m,
      due = sum(o) * (d == 'None' ? 1 : 0.8);
    if (d != 'None' && !(U.nm && U.id)) return toast('Enter the name and ID number');
    if (m == 'Cash' && (U.r || 0) < due) return toast('Cash received is less than the total');
    o.st = 'paid';
    T.sales += due;
    if (m == 'Cash') T.cash += due;
    S.bill = S.bill.filter((t) => t != o.tb);
    if (d != 'None') T.disc.push([clock(), '#' + o.id, d, U.nm, U.id]);
    lg(`Payment for order #${o.id} (${m})`);
    modal(receipt(o, due, m, U.r));
    U.pay = 0;
    render();
  },
  shift: () => {
    lg('Closed shift');
    toast('Shift closed');
  },
};
boot();

/* STAFF API (demo): stock, sales, staff, logs, discounts. Never loaded by customer.html.
   In production this is /api/staff/... on the server, checked against the signed-in role on every request. */
const T = {
  sales: 18450,
  cash: 0,
  waste: [], // staff only: customer.html never loads this
  stock: [
    ['Salmon', 'kg', 5, 3],
    ['Nori sheets', 'pcs', 48, 50],
    ['Sushi rice', 'kg', 8, 3],
    ['Ebi (shrimp)', 'g', 200, 1000],
    ['Chicken', 'kg', 4, 2],
  ],
  staff: [
    ['Waiter 1', 'Waiter'],
    ['Waiter 2', 'Waiter'],
    ['Kitchen 1', 'Kitchen'],
    ['Cashier 1', 'Cashier'],
    ['Owner', 'Owner'],
  ],
  deliv: [
    ['Delivery 14', '2× Chicken katsu curry, 2× Gyoza', 'Preparing'],
    ['Delivery 15', '1× Dragon roll', 'Preparing'],
    ['Takeout 8', '2× Gyoza', 'Ready'],
  ],
  cater: [
    ['Client 1', 'Nov 14, 40 guests', 'Quote sent'],
    ['Client 2', 'Nov 22, 25 guests', 'Deposit paid'],
    ['Client 3', 'Dec 6, 60 guests', 'Inquiry'],
  ],
  log: [],
  disc: [],
};

{
  const KT = 'lanay.staff',
    l = API.load,
    s = API.save,
    r = API.reset;
  API.KT = KT;
  API.load = function () {
    l.call(this);
    try {
      const t = JSON.parse(localStorage.getItem(KT) || 'null');
      if (t) Object.assign(T, t);
    } catch (e) {}
  };
  API.save = function () {
    s.call(this);
    try {
      localStorage.setItem(KT, JSON.stringify(T));
    } catch (e) {}
  };
  API.reset = function () {
    r.call(this);
    localStorage.removeItem(KT);
  };
}

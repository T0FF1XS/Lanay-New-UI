/* PUBLIC API (demo). The only data file customer.html may load: menu, table orders status, feedback.
   In production replace the body of load/save with fetch('/api/public/...') and return ONLY that guest's own order. */
/* ---------- demo data (in memory; the real app would call the PHP api) ---------- */
const mins = (m) => Date.now() - m * 6e4;
/* Dish pictures: drop a file in the img/ folder with the name in img: below. No file = the icon shows as before. */
const MENU = [
  { id: 1, n: 'Salmon nigiri', p: 120, c: 'Sushi', e: 'fish', img: 'img/salmon-nigiri.jpg' },
  { id: 2, n: 'California maki', p: 180, c: 'Sushi', e: 'circle-dot', img: 'img/california-maki.jpg' },
  { id: 3, n: 'Dragon roll', p: 250, c: 'Sushi', e: 'fish-symbol', img: 'img/dragon-roll.jpg' },
  { id: 4, n: 'Chicken katsu curry', p: 210, c: 'Japanese', e: 'drumstick', img: 'img/chicken-katsu-curry.jpg' },
  { id: 5, n: 'Gyoza', p: 95, c: 'Japanese', e: 'croissant', img: 'img/gyoza.jpg' },
  { id: 6, n: 'Ebi tempura', p: 220, c: 'Japanese', e: 'shrimp', img: 'img/ebi-tempura.jpg' },
  { id: 7, n: 'Tonkotsu ramen', p: 240, c: 'Japanese', e: 'soup', img: 'img/tonkotsu-ramen.jpg' },
  { id: 8, n: 'Miso soup', p: 70, c: 'Japanese', e: 'cooking-pot', img: 'img/miso-soup.jpg' },
  { id: 9, n: 'Iced matcha', p: 110, c: 'Drinks', e: 'cup-soda', img: 'img/iced-matcha.jpg' },
].map((m) => ({ ...m, on: 1 }));
const SEATS = [2, 4, 4, 2, 4, 6, 4, 2, 6, 4],
  TB = SEATS.map((_, i) => i + 1);
const S = {
  n: 44,
  bill: [],
  calls: [],
  set: { vat: 1, sound: 1, backup: 1, qr: 1 }, // shared with customer.html
  orders: [
    // it = [menuId, qty, note]
    {
      id: 41,
      tb: 6,
      it: [
        [1, 2],
        [2, 1],
        [4, 1],
      ],
      st: 'new',
      t: mins(8),
    },
    {
      id: 42,
      tb: 9,
      it: [
        [7, 1],
        [9, 1],
      ],
      st: 'preparing',
      t: mins(19),
    },
    {
      id: 43,
      tb: 1,
      it: [
        [9, 2],
        [2, 1],
      ],
      st: 'ready',
      t: mins(14),
    },
    {
      id: 44,
      tb: 3,
      it: [
        [5, 1],
        [2, 1],
      ],
      st: 'served',
      t: mins(30),
    },
  ],
  fb: [
    ['Carlos', 5, 'Loved the salmon nigiri.'],
    ['Aster', 4, 'Friendly service.'],
    ['Belinda', 3, 'A bit of a wait.'],
  ],
};

const API = {
  KP: 'lanay.public',
  load() {
    try {
      const p = JSON.parse(localStorage.getItem(this.KP) || 'null');
      if (p) {
        Object.assign(S, p.S);
        MENU.length = 0;
        MENU.push(...p.MENU);
      }
    } catch (e) {}
  },
  save() {
    try {
      localStorage.setItem(this.KP, JSON.stringify({ S, MENU }));
    } catch (e) {}
  },
  reset() {
    localStorage.removeItem(this.KP);
  },
};

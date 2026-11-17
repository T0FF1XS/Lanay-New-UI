const mins = (m) => Date.now() - m * 6e4;
const IMG_DIR = 'img/';
const CATS = ['Unlimited', 'Ramen', 'Korean', 'Maki', 'Sushi', 'Platters', 'Meals', 'Starters', 'Sides', 'Bento', 'Filipino'];

// One row = [name, price, description]. t: 1 marks "Must try" dishes.
const mk = (c, e, rows, t) => rows.map(([n, p, d]) => ({ c, e, n, p, d, t }));
const MENU = [
  ...mk('Unlimited', 'sparkles', [
    ['Unlimited Maki, Ramen & Tempura', 599, '1 hr 30 mins, ₱300 charge for leftovers. Per serving: 3pcs tempura, 4pcs maki, 2pcs sushi. Ramen: Tantanmen, Shoyu, Miso, Chicken, Tonkatsu, Chicken Teriyaki. Maki: Crazy, California, Cheesy California, Tamago, Kani. Sushi: Tamago, Kani.'],
  ]),
  ...mk('Ramen', 'soup', [
    ['Tantanmen', 199],
    ['Shoyu Ramen', 199],
    ['Chicken Ramen', 199],
    ['Miso Ramen', 199],
    ['Beef Ramen', 215],
    ['Seafood Ramen', 215],
  ]),
  ...mk('Korean', 'cooking-pot', [
    ['Samyang', 210],
    ['Ramyun', 210],
    ['Black Noodles', 210],
    ['Chapsae', 220],
    ['Ttoekbokki', 200],
    ['Cheesy Ttoekbokki', 220],
  ]),
  ...mk('Maki', 'sushi', [
    ['California Maki', 145, '8pcs. Crabstick, Mango, Cucumber, Tempura, Ebiko'],
    ['Crazy Maki', 145, '8pcs. Crabstick, Mango, Cucumber, Tempura, Tempura Flakes'],
    ['Crazy Tamago', 145, '8pcs. Tempura Flakes, Tamago'],
    ['Kani Maki', 145, '8pcs. Crabstick'],
    ['Salmon Kawa', 145, '8pcs. Salmon Skin'],
    ['Tamago Maki', 145, '8pcs. Tamago'],
    ['Futo Maki', 210, '6pcs. Tamago, Takwan, Kampyo, Crabstick, Cucumber, Mango'],
    ['Spicy Salmon Lava Maki', 205, '8pcs. Salmon, Tempura Flakes'],
    ['Cordon Blue Maki', 205, '8pcs. Ham, Cheese, Chicken'],
    ['Cheesy Tempura Roll', 205, '8pcs. Ebi Tempura, Cheese'],
    ['Crunchy Crab Roll', 255, '8pcs. Tempura, Salmon, Crabstick'],
    ['Cheesy California Maki', 205, '8pcs. Crabstick, Mango, Cucumber, Cheese'],
    ['Rainbow Maki', 205, '8pcs. Crabstick, Mango, Cucumber, Salmon, Tamago'],
    ['Tamago Kani Roll', 205, '8pcs. Crabstick, Cheese, Tamago'],
  ]),
  ...mk('Maki', 'sushi', [
    ['Brickle Crab Roll', 205, 'Tempura, Crabstick, Nuts'],
    ['Spicy Mango Roll', 205, 'Fried Salmon Skin, Top with Mango'],
    ['Dynamite Roll', 205, 'Green Pepper, Crabstick, Cheesy'],
    ['Deep Fry California', 205, 'Crabstick, Carrots, Fried Crabstick'],
    ['California Bacon Bits', 205, 'Crabstick, Mango, Cucumber, Bacon Bits'],
    ['Torch Salmon Roll', 265, 'Salmon & Mango topped with Torch Salmon'],
  ], 1),
  ...mk('Sushi', 'sushi', [
    ['Baked Sushi Regular', 385],
    ['Cheesy Baked Sushi', 435],
  ], 1),
  ...mk('Sushi', 'sushi', [
    ['Salmon Sashimi', 345, '8 slices'],
    ['Mixed Sashimi', 395, '10 slices'],
    ['Cheesy Ebi Sushi', 225, '5pcs'],
    ['Salmon Sushi', 335, '5pcs'],
    ['Tamago Sushi', 130, '5pcs'],
    ['Kani Sushi', 145, '5pcs'],
    ['Torch Salmon Crunchy Nori', 295, '5pcs'],
    ['Assorted Sushi', 360, '5pcs'],
  ]),
  ...mk('Platters', 'sushi', [
    ['Sampler', 400, 'Cheesy Ebi Roll, California Maki, Crunchy Crab Roll, Cheesy California Maki'],
    ['Classic 36pcs', 650, 'California Maki, Crazy Maki, Tamago Maki, Kani Maki, Tamago Sushi, Kani Sushi'],
    ['Classic 58pcs', 1010, 'California Maki, Crazy Maki, Futo Maki, Tamago Maki, Kani Maki, Tamago Sushi, Kani Sushi'],
    ['Classic 79pcs', 1399, 'California Maki, Crazy Maki, Tamago Maki, Kani Maki, Tamago Sushi, Kani Sushi'],
    ['Latest 58pcs', 1350, 'California Maki, Futo Maki, Cheesy Tempura Roll, Kani Mango Overload, Crunchy Crab Roll, Cheesy California Maki, Bacon Bits Roll'],
    ['Latest 79pcs', 1850, 'California Maki, Futo Maki, Cheesy Tempura Roll, Kani Mango Overload, Crunchy Crab Roll, Cheesy California Maki, Bacon Bits Roll, Dynamite Roll, Brickle Crab Roll'],
    ['Maki with Tempura', 1450, '36pcs Maki: California Maki, Crazy Maki, Tamago Maki, Kani Maki, Tamago Sushi, Kani Sushi, with 20pcs of Tempura'],
    ['Maki with Tempura Latest', 1650],
  ]),
  ...mk('Meals', 'drumstick', [
    ['Tonkatsu w/ Chahan Rice', 180],
    ['Torikatsu w/ Chahan Rice', 180],
    ['Chicken Teriyaki w/ Chahan Rice', 180],
    ['Karaage w/ Chahan Rice', 180],
    ['Fried Chicken w/ Omu Rice', 205],
    ['Spicy Korean Chicken w/ Omu Rice', 205],
    ['Cheesy Torikatsu w/ Chahan Rice', 205],
    ['Cheesy Tonkatsu w/ Chahan Rice', 205],
    ['Katsudon', 200],
    ['Oyakudon', 250],
    ['Gyudon', 250],
  ]),
  ...mk('Starters', 'croissant', [
    ['Cheesy Gyoza 5pcs', 220],
    ['Gyoza 5pcs', 200],
    ['Cheesy Takoyaki 6pcs', 200],
    ['Takoyaki 6pcs', 180],
    ['Samgyup Bites 8pcs', 200],
    ['Chaphae', 220],
    ['Kakeage', 150],
    ['Miso Soup', 30],
  ]),
  ...mk('Sides', 'shrimp', [
    ['Tonkatsu Salad', 190],
    ['Kani Salad', 190],
    ['Mixed Tempura', 190],
    ['Kani Tempura 5pcs', 180],
    ['Tempura 5pcs', 220],
  ]),
  ...mk('Bento', 'package', [
    ['Bento A', 215, 'Plain Rice, California Maki, Tonkatsu, Vegetables'],
    ['Bento B', 215, 'Plain Rice, Gyoza, Chicken Teriyaki, Vegetables'],
    ['Bento C', 215, 'Plain Rice, Tempura, Torikatsu, Vegetables'],
    ['Samgyup Box Chicken', 265, 'Plain Rice, Fish Cake, Kimchi, Tamago'],
    ['Samgyup Box Pork', 265, 'Plain Rice, Fish Cake, Kimchi, Tamago'],
    ['Samgyup Box Beef', 265, 'Plain Rice, Fish Cake, Kimchi, Tamago'],
    ['Samgyup Box Chapchae', 265, 'Plain Rice, Fish Cake, Kimchi, Tamago'],
    ['Sumo Bento 1', 290, 'Plain Rice, Tempura, Chicken Teriyaki, Gyoza, Tonkatsu'],
    ['Sumo Bento 2', 290, 'Plain Rice, Gyoza, Patty, Tempura, Tonkatsu'],
    ['Sumo Bento 3', 290, 'California Maki, Tempura, Kani Tempura, Grilled Pork, Vegetables, Patty'],
    ['Chef Special Bento', 350, 'California Maki 4pcs, Tonkatsu, Chicken Teriyaki, Gyoza 2pcs, Tempura 2pcs, Plain Rice'],
  ]),
  ...mk('Filipino', 'chef-hat', [
    ['Beef Bulalo', 550],
    ['Beef Kare-Kare', 480],
    ['Crispy Pata', 750],
    ['Beef Kaldereta', 480],
    ['Lechon Kawali', 480],
    ['Pork Sisig', 300],
    ['Sinigang na Bulalo', 550],
    ['Grilled Liempo', 400],
    ['Dinakdakan', 350],
    ['Oriental Fried Chicken (₱220)', 220],
    ['Oriental Fried Chicken (₱400)', 400],
    ['Chicken Inasal', 200],
    ['Sinigang na Baboy', 450],
    ['Fried Tilapia', 250],
    ['Chapseuy', 210],
    ['Baked Tahong', 300],
    ['Sweet and Spicy Shrimp', 400],
    ['Sinigang na Hipon', 400],
    ['Pancit Canton', 400],
    ['Pancit Bihon', 400],
    ['Plain Rice', 120],
    ['Crab Rice', 180],
    ['Chahan Rice', 180],
    ['Garlic Fried Rice', 180],
  ]),
].map((m, i) => ({ ...m, id: i + 1, on: 1 }));
const mid = (n) => MENU.find((m) => m.n == n).id;
const SEATS = [2, 4, 4, 2, 4, 6, 4, 2, 6, 4],
  TB = SEATS.map((_, i) => i + 1);
const S = {
  n: 44,
  bill: [],
  calls: [],
  set: { vat: 1, sound: 1, backup: 1, qr: 1 },
  orders: [

    {
      id: 41,
      tb: 6,
      it: [
        [mid('Salmon Sushi'), 2],
        [mid('California Maki'), 1],
        [mid('Tonkatsu w/ Chahan Rice'), 1],
      ],
      st: 'new',
      t: mins(8),
    },
    {
      id: 42,
      tb: 9,
      it: [
        [mid('Beef Ramen'), 1],
        [mid('Gyoza 5pcs'), 1],
      ],
      st: 'preparing',
      t: mins(19),
    },
    {
      id: 43,
      tb: 1,
      it: [
        [mid('Miso Soup'), 2],
        [mid('California Maki'), 1],
      ],
      st: 'ready',
      t: mins(14),
    },
    {
      id: 44,
      tb: 3,
      it: [
        [mid('Gyoza 5pcs'), 1],
        [mid('California Maki'), 1],
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
  KP: 'lanay.public.v2',
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
};

// Seed initial categories. Run with: node src/seed/seedCategories.js
// Replace the list below with Nuriddin Aka's category list when provided.
const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');

const defaults = [
  { name: 'Спецодежда', slug: 'spetsodezhda', order: 1 },
  { name: 'Спецобувь', slug: 'spetsobov', order: 2 },
  { name: 'Средства защиты', slug: 'sredstva-zashchity', order: 3 },
  { name: 'Трикотаж', slug: 'trikotazh', order: 4 },
  { name: 'Хозтовары', slug: 'khoztovary', order: 5 },
  { name: 'Униформа', slug: 'uniforma', order: 6 },
  { name: 'Новинки', slug: 'novinki', order: 7 },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    for (const c of defaults) {
      await Category.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
    }
    console.log('Categories seeded:', defaults.length);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();

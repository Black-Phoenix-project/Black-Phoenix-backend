const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'company', unique: true },
    companyName: { type: String, default: 'Black Phoenix' },
    description: { type: String, default: '' },
    phone: { type: String, default: '+998770902226' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    aboutText: { type: String, default: '' },
    socials: {
      telegram: { type: String, default: 'https://t.me/SardorXojimurodov' },
      instagram: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);

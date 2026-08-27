const Settings = require('../models/Settings');
const errorResponse = require('../utils/errorResponse');

const ensureSettings = async () => {
  let settings = await Settings.findOne({ key: 'company' });
  if (!settings) {
    settings = await Settings.create({ key: 'company' });
  }
  return settings;
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await ensureSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await ensureSettings();
    const { companyName, description, phone, email, address, aboutText, socials } = req.body;
    if (companyName !== undefined) settings.companyName = companyName;
    if (description !== undefined) settings.description = description;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (address !== undefined) settings.address = address;
    if (aboutText !== undefined) settings.aboutText = aboutText;
    if (socials !== undefined && typeof socials === 'object') {
      settings.socials = { ...settings.socials, ...socials };
    }
    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    errorResponse(res, error);
  }
};

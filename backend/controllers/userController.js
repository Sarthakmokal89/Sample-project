// backend/controllers/userController.js
const supabase = require('../config/supabaseClient');

exports.getUserSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, imap_host, imap_port, imap_user') // Never send password
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ settings: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserSettings = async (req, res) => {
  try {
    const { name, imap_host, imap_port, imap_user, imap_pass } = req.body;

    const updateData = { name, imap_host, imap_port, imap_user };
    // Only update password if a new one is provided to avoid overwriting with null
    if (imap_pass) {
      updateData.imap_pass = imap_pass;
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select('id, name, email, imap_host, imap_port, imap_user')
      .single();

    if (error) throw error;
    res.json({ ok: true, settings: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

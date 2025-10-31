// backend/controllers/emailController.js
const supabase = require('../config/supabaseClient');

exports.getEmails = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('client_id', req.user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    res.json({ emails: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markResolved = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('emails')
      .update({ resolved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ ok: true, email: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

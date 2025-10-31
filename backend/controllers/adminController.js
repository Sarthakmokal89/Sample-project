// backend/controllers/adminController.js
const supabase = require('../config/supabaseClient');

exports.listClients = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, plan, created_at')
      .eq('role', 'client');
    if (error) throw error;
    res.json({ clients: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;
    const { data, error } = await supabase
      .from('users')
      .update({ plan })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ ok: true, client: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

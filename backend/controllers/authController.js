// backend/controllers/authController.js
const supabase = require('../config/supabaseClient');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { email, password, name, role = 'client' } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email & password required' });

    // Create Supabase Auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role },
      });

    if (authError) return res.status(400).json({ error: authError.message });

    // Create user record
    await supabase.from('users').insert([
      { id: authData.user.id, email, name, role, plan: 'free' },
    ]);

    res.json({ ok: true, user: { id: authData.user.id, email, name, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ error: error.message });

    // Get role from users table
    const { data: userInfo } = await supabase
      .from('users')
      .select('role, name')
      .eq('id', data.user.id)
      .single();

    const token = jwt.sign(
      {
        id: data.user.id,
        email: data.user.email,
        role: userInfo?.role || 'client',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: data.user.id,
        email,
        name: userInfo?.name,
        role: userInfo?.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

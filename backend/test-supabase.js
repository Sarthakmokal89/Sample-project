// backend/test-supabase.js
const supabase = require('./config/supabaseClient');

(async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    // Note: This will only work if you have a 'users' table.
    // If your table is named differently, please adjust the '.from()' value.
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) throw error;
    
    if (data && data.length > 0) {
        console.log('✅ Connected! Example user:');
        console.log(data[0]);
    } else {
        console.log('✅ Connected! The "users" table is currently empty.');
    }

  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
  }
})();

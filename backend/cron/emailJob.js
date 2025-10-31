// backend/cron/emailJob.js
const cron = require('node-cron');
const supabase = require('../config/supabaseClient');
const { fetchEmailsForClient } = require('../utils/imapFetcher');

cron.schedule('*/5 * * * *', async () => {
  console.log('🕒 Running email fetch job...');
  const { data: clients, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'client');

  if (error) {
    console.error('Supabase user fetch error:', error.message);
    return;
  }

  for (const client of clients) {
    await fetchEmailsForClient(client);
  }
});

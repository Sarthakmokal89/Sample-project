// backend/utils/imapToSupabase.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const supabase = require('../config/supabaseClient');

// Optional: a tiny sentiment helper
function analyzeSentiment(text) {
  if (!text) return 'neutral';
  const lowered = text.toLowerCase();
  if (lowered.includes('great') || lowered.includes('amazing') || lowered.includes('thank')) return 'positive';
  if (lowered.includes('bad') || lowered.includes('angry') || lowered.includes('unprofessional')) return 'negative';
  return 'neutral';
}

// IMAP Config
const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT || 993,
    tls: true,
    authTimeout: 15000,
  },
};

async function fetchAndStoreEmails() {
  if (!config.imap.user || !config.imap.password) {
      console.error('❌ Missing IMAP credentials in .env file. Please provide IMAP_USER and IMAP_PASS.');
      return;
  }
    
  console.log('🔌 Connecting to Gmail via IMAP...');
  const connection = await imaps.connect(config);
  await connection.openBox('INBOX');
  console.log('✅ Connected. Fetching unread emails...');

  const searchCriteria = ['UNSEEN'];
  const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false };
  const results = await connection.search(searchCriteria, fetchOptions);

  if (results.length === 0) {
    console.log('📭 No new unread emails.');
    await connection.end();
    return;
  }

  console.log(`📩 Found ${results.length} new emails!`);

  for (const mailItem of results) {
    const all = mailItem.parts.find((p) => p.which === 'TEXT');
    const parsed = await simpleParser(all.body);

    const from = parsed.from?.text || '(Unknown sender)';
    const subject = parsed.subject || '(No subject)';
    const body = parsed.text || '';
    const sentiment = analyzeSentiment(body);
    const date = parsed.date || new Date();

    // Insert into Supabase
    const { error } = await supabase.from('emails').insert([
      {
        client_id: null, // This is a global fetch, not tied to a client
        from_email: from,
        subject,
        body,
        sentiment,
        urgency: sentiment === 'negative' ? 'high' : 'low',
        resolved: false,
        date: date.toISOString(),
      },
    ]);

    if (error) {
      console.error('❌ Supabase insert failed:', error.message);
    } else {
      console.log(`✅ Stored: "${subject}" from ${from}`);
    }
  }

  await connection.end();
  console.log('📬 All emails processed and saved to Supabase.');
}

fetchAndStoreEmails().catch((err) => {
  console.error('⚠️ Error:', err.message);
});

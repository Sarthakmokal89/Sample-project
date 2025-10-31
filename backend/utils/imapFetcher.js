// backend/utils/imapFetcher.js
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const axios = require('axios');
const supabase = require('../config/supabaseClient');
require('dotenv').config();

/**
 * Connect to a user's IMAP inbox, fetch unread emails,
 * analyze them for sentiment, classify urgency, and store in Supabase.
 *
 * @param {Object} client - The client object from Supabase (must include imap fields)
 */
async function fetchEmailsForClient(client) {
  if (!client.imap_host || !client.imap_user || !client.imap_pass) {
    console.log(`⚠️  Missing IMAP credentials for client: ${client.email}`);
    return;
  }

  const config = {
    imap: {
      user: client.imap_user,
      password: client.imap_pass,
      host: client.imap_host,
      port: client.imap_port || 993,
      tls: client.tls ?? true,
      authTimeout: 15000,
    },
  };

  try {
    console.log(`📨 Connecting to ${client.imap_user}...`);
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN']; // Only new, unread emails
    const fetchOptions = { bodies: [''], markSeen: false };
    const results = await connection.search(searchCriteria, fetchOptions);

    if (!results.length) {
      console.log(`No new emails for ${client.email}`);
      await connection.end();
      return;
    }

    for (const res of results) {
      const raw = res.parts[0].body;
      const parsed = await simpleParser(raw);

      const from = parsed.from?.text || 'Unknown Sender';
      const subject = parsed.subject || '(No Subject)';
      const body = parsed.text || parsed.html || '(No Body)';
      const date = parsed.date || new Date();

      // 🔍 Sentiment Analysis
      let sentiment = 'neutral';
      try {
        const { data } = await axios.post(`${process.env.ML_SERVICE_URL}/analyze`, {
          text: body,
        });
        sentiment = data.sentiment || 'neutral';
      } catch {
        console.warn('⚠️ Sentiment service unavailable, defaulting to neutral');
      }

      // 🚨 Urgency Classification
      let urgency = 'low';
      if (/urgent|immediately|not working|asap|error|help/i.test(body))
        urgency = 'high';
      else if (/please|support|issue/i.test(body))
        urgency = 'medium';

      // 💾 Save to Supabase
      const { error } = await supabase.from('emails').insert([
        {
          client_id: client.id,
          from_email: from,
          subject,
          body,
          sentiment,
          urgency,
          resolved: false,
          date,
        },
      ]);

      if (error) console.error('Supabase insert error:', error.message);
      else console.log(`✅ Saved email: ${subject}`);
    }

    await connection.end();
  } catch (err) {
    console.error(`❌ IMAP fetch failed for ${client.email}:`, err.message);
  }
}

module.exports = { fetchEmailsForClient };

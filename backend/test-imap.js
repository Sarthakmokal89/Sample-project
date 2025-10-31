// backend/test-imap.js
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

const config = {
  imap: {
    user: 'awakenu93@gmail.com',         // ← replace with your Gmail
    password: 'tgwm hnrs gyir reni',     // ← your 16-char App Password
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 15000,
  },
};

(async () => {
  try {
    console.log('🔌 Connecting to Gmail IMAP...');
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');
    console.log('✅ Connected to Gmail successfully!');

    // Search unread emails
    const searchCriteria = ['UNSEEN'];
    const fetchOptions = { bodies: ['HEADER'], markSeen: false };
    const results = await connection.search(searchCriteria, fetchOptions);

    if (results.length === 0) {
      console.log('📭 No unread emails found.');
    } else {
      console.log(`📬 Found ${results.length} unread email(s):`);
      for (const item of results) {
        const headers = item.parts[0].body;
        console.log(
          `- ${headers.subject ? headers.subject[0] : '(No Subject)'} from ${
            headers.from ? headers.from[0] : '(Unknown Sender)'
          }`
        );
      }
    }

    await connection.end();
    console.log('✅ IMAP test completed successfully.');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
})();

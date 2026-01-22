const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { processPayment } = require('./main');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory store for local development
const transactions = [];

app.get('/', (req, res) => {
  res.send('🐊 Crokodile Engine Local Server');
});

app.post('/pay', async (req, res) => {
  console.log('📬 Received payment request:', req.body);
  
  const config = {
    endpoint: process.env.APPWRITE_ENDPOINT,
    projectId: process.env.APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_API_KEY,
    databaseId: process.env.APPWRITE_DATABASE_ID
  };

  try {
    const result = await processPayment(req.body, config);
    
    // Add to local store for dashboard
    transactions.unshift({
      id: result.txHash,
      merchant: req.body.merchant,
      amount: `$${req.body.amount}`,
      status: 'success',
      time: 'Just now',
      timestamp: Date.now()
    });

    // Keep only last 50
    if (transactions.length > 50) transactions.pop();

    console.log('✅ Payment processed successfully');
    res.json(result);
  } catch (err) {
    console.error('❌ Payment failed:', err.message);
    
    transactions.unshift({
      id: Math.random().toString(36).substr(2, 9),
      merchant: req.body.merchant || 'Unknown',
      amount: `$${req.body.amount || 0}`,
      status: 'error',
      time: 'Just now',
      timestamp: Date.now(),
      error: err.message
    });

    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/transactions', (req, res) => {
  res.json(transactions);
});

app.listen(port, () => {
  console.log(`🚀 Crokodile Brain (Engine) listening at http://localhost:${port}`);
});

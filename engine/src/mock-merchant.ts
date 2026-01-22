import express from 'express';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get('/data', (req, res) => {
  const paymentProof = req.header('X-402-Payment-Proof') || req.header('Authorization');

  if (!paymentProof) {
    console.log('💰 Mock Merchant: Request received without payment. Sending 402...');
    res.setHeader('X-402-Payment-Request', 'amount=0.01,currency=USDC,merchant=MockDataService');
    return res.status(402).json({
      error: 'Payment Required',
      message: 'Please pay 0.01 USDC to access this resource.'
    });
  }

  console.log('✅ Mock Merchant: Payment proof received! Access granted.');
  res.json({
    success: true,
    data: 'Secret AI Data provided by Crokodile x402 Protocol',
    proof_verified: true
  });
});

app.listen(port, () => {
  console.log(`🏠 Mock Merchant listening at http://localhost:${port}`);
});

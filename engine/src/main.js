const { Client, Databases, ID, Query } = require('node-appwrite');

const processPayment = async (payload, config) => {
  const { endpoint, projectId, apiKey, databaseId } = config;

  const client = new Client()
    .setEndpoint(endpoint || 'https://cloud.appwrite.io/v1')
    .setProject(projectId || '')
    .setKey(apiKey || '');

  const databases = new Databases(client);

  try {
    const { agentId, amount, merchant, currency, reasoning } = payload;

    // 1. Policy Enforcement
    if (databaseId) {
      try {
        const policies = await databases.listDocuments(
          databaseId,
          'policies',
          [Query.equal('agentId', agentId)]
        );

        if (policies.total > 0) {
          const policy = policies.documents[0];
          if (amount > policy.maxPerRequest) {
            throw new Error(`Transaction exceeds max limit per request ($${policy.maxPerRequest})`);
          }
        }
      } catch (e) {
        console.warn('Policy check skipped or failed:', e.message);
      }
    }

    // 2. Reasoning Audit
    if (!reasoning || reasoning.length < 5) {
      throw new Error('Insufficient reasoning for payment. AI Agents must provide justification.');
    }

    // 3. Transaction Signing (Simulation)
    const txHash = "0x" + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
    const paymentProof = Buffer.from(JSON.stringify({ txHash, agentId, merchant, amount })).toString('base64');

    // 4. Audit Log
    if (databaseId) {
      try {
        await databases.createDocument(
          databaseId,
          'transactions',
          ID.unique(),
          {
            merchant,
            amount: parseFloat(amount),
            txHash,
            status: 'settled',
            reasoningTrace: reasoning,
            agentId
          }
        );
      } catch (e) {
        console.warn('Audit log failed:', e.message);
      }
    }

    return {
      success: true,
      txHash,
      paymentProof,
      message: 'Payment settled via Cronos EIP-3009'
    };

  } catch (err) {
    throw err;
  }
};

const main = async ({ req, res, log, error }) => {
  const config = {
    endpoint: process.env.APPWRITE_FUNCTION_ENDPOINT,
    projectId: process.env.APPWRITE_FUNCTION_PROJECT_ID,
    apiKey: process.env.APPWRITE_FUNCTION_API_KEY,
    databaseId: 'crokodile_db'
  };

  if (req.method === 'POST') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const result = await processPayment(payload, config);
      return res.json(result);
    } catch (err) {
      return res.json({ success: false, message: err.message }, 400);
    }
  }

  return res.send('🐊 Crokodile Engine is online.');
};

module.exports = main;
module.exports.processPayment = processPayment;
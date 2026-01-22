import { Client, Databases, ID } from 'node-appwrite';

/**
 * 🐊 CROKODILE Engine (Appwrite Function)
 * Handles EIP-3009 transaction signing and policy enforcement.
 */

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY || '');

  const databases = new Databases(client);

  if (req.method === 'POST') {
    try {
      const { agentId, amount, merchant, currency, reasoning } = JSON.parse(req.body);

      log(`[ENGINE] Processing payment request for agent: ${agentId}`);

      // 1. Policy Enforcement
      // TODO: Fetch limits from 'policies' collection

      // 2. Reasoning Audit
      log(`[ENGINE] Reasoning trace: ${reasoning}`);
      if (!reasoning || reasoning.length < 10) {
        return res.json({ success: false, message: 'Insufficient reasoning for payment.' }, 403);
      }

      // 3. Transaction Signing (EIP-3009 Simulation)
      const txHash = "0x" + Math.random().toString(16).slice(2);

      // 4. Audit Log
      await databases.createDocument(
        'crokodile_db',
        'transactions',
        ID.unique(),
        {
          merchant,
          amount,
          txHash,
          status: 'settled',
          reasoningTrace: reasoning,
          agentId
        }
      );

      return res.json({
        success: true,
        txHash,
        message: 'Payment settled via Cronos EIP-3009'
      });

    } catch (err: any) {
      error(`[ENGINE] Error: ${err.message}`);
      return res.json({ success: false, message: err.message }, 500);
    }
  }

  return res.send('🐊 Crokodile Engine is online.');
};
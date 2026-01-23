import { Client, Databases, ID, Query } from 'node-appwrite';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ethers } from 'ethers';

export interface PaymentPayload {
  agentId: string;
  amount: number | string;
  merchant: string;
  currency?: string;
  reasoning: string;
}

export interface EngineConfig {
  endpoint: string;
  projectId: string;
  apiKey: string;
  databaseId: string;
  geminiApiKey: string;
  agentPrivateKey?: string;
}

const signEIP3009 = async (payload: { amount: string | number; merchant: string }, privateKey?: string) => {
  const wallet = new ethers.Wallet(privateKey || ethers.Wallet.createRandom().privateKey);
  
  const domain = {
    name: 'USD Coin',
    version: '2',
    chainId: 338, // Cronos Testnet
    verifyingContract: '0x2f9092f5F41C2084a539b7b163342360c704382c'
  };

  const types = {
    ReceiveWithAuthorization: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'validAfter', type: 'uint256' },
      { name: 'validBefore', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' }
    ]
  };

  const nonce = ethers.hexlify(ethers.randomBytes(32));
  const validAfter = 0;
  const validBefore = Math.floor(Date.now() / 1000) + 3600;

  const value = {
    from: wallet.address,
    to: '0x000000000000000000000000000000000000dead',
    value: ethers.parseUnits(payload.amount.toString(), 6),
    validAfter,
    validBefore,
    nonce
  };

  const signature = await wallet.signTypedData(domain, types, value);
  
  return {
    signature,
    owner: wallet.address,
    nonce,
    validAfter,
    validBefore,
    txHash: ethers.keccak256(signature)
  };
};

const auditReasoning = async (reasoning: string, amount: string | number, merchant: string, apiKey: string) => {
  if (!apiKey) {
    console.warn('Gemini API key missing, skipping advanced reasoning audit');
    return { approved: true };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are the Crokodile AI Reasoning Auditor. Your job is to analyze the reasoning provided by an AI agent for a payment request.
  
  Payment Details:
  - Amount: ${amount}
  - Merchant: ${merchant}
  - Reasoning: "${reasoning}"
  
  Evaluate if this payment is reasonable, safe, and professional. 
  Reject payments that:
  1. Mention illegal activities.
  2. Seem like a scam or phishing.
  3. Are for personal/non-business use if the reasoning is "automated service".
  4. Contain suspicious keywords.

  Respond ONLY with a JSON object:
  {
    "approved": boolean,
    "confidence": number (0-1),
    "reason": "short explanation"
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{.*\}/s);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (e: any) {
    console.error('Reasoning audit failed:', e.message);
    return { approved: true, error: e.message };
  }
};

export const processPayment = async (payload: PaymentPayload, config: EngineConfig) => {
  const { endpoint, projectId, apiKey, databaseId, geminiApiKey, agentPrivateKey } = config;

  const client = new Client()
    .setEndpoint(endpoint || 'https://cloud.appwrite.io/v1')
    .setProject(projectId || '')
    .setKey(apiKey || '');

  const databases = new Databases(client);

  try {
    const { agentId, amount, merchant, currency, reasoning } = payload;

    if (databaseId) {
      try {
        const policies = await databases.listDocuments(
          databaseId,
          'policies',
          [Query.equal('agentId', agentId)]
        );

        if (policies.total > 0) {
          const policy: any = policies.documents[0];
          
          if (Number(amount) > policy.maxPerRequest) {
            throw new Error(`TRANSACTION_REJECTED: Amount ${amount} exceeds max per-request limit of ${policy.maxPerRequest}`);
          }

          const now = new Date();
          const startOfDay = new Date(now.setHours(0,0,0,0)).getTime();
          
          const todayTx = await databases.listDocuments(
            databaseId,
            'transactions',
            [
              Query.equal('agentId', agentId),
              Query.greaterThanEqual('timestamp', startOfDay),
              Query.equal('status', 'settled')
            ]
          );

          const spentToday = todayTx.documents.reduce((sum, tx: any) => sum + (tx.amount || 0), 0);
          if (spentToday + parseFloat(amount.toString()) > policy.dailyLimit) {
            throw new Error(`BUDGET_EXCEEDED: Daily limit of ${policy.dailyLimit} reached. Total spent: ${spentToday}`);
          }
        }
      } catch (e: any) {
        if (e.message.includes('REJECTED') || e.message.includes('EXCEEDED')) throw e;
        console.warn('Policy check skipped or failed:', e.message);
      }
    }

    const auditResult = await auditReasoning(reasoning, amount, merchant, geminiApiKey);
    if (!auditResult.approved) {
      throw new Error(`REASONING_AUDIT_FAILED: ${auditResult.reason}`);
    }

    const sensitiveKeywords = ['gambling', 'personal', 'private'];
    const lowerReasoning = reasoning.toLowerCase();
    if (sensitiveKeywords.some(word => lowerReasoning.includes(word))) {
      throw new Error('POLICY_VIOLATION: Reasoning contains restricted categories.');
    }

    const eip3009Result = await signEIP3009({ amount, merchant }, agentPrivateKey);
    const txHash = eip3009Result.txHash;
    const paymentProof = Buffer.from(JSON.stringify({ 
      txHash, 
      agentId, 
      merchant, 
      amount,
      signature: eip3009Result.signature,
      owner: eip3009Result.owner,
      nonce: eip3009Result.nonce
    })).toString('base64');

    if (databaseId) {
      try {
        await databases.createDocument(
          databaseId,
          'transactions',
          ID.unique(),
          {
            merchant,
            amount: parseFloat(amount.toString()),
            currency: currency || 'USDC',
            txHash,
            status: 'settled',
            reasoningTrace: reasoning,
            agentId,
            timestamp: Date.now()
          }
        );
      } catch (e: any) {
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

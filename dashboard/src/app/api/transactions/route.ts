import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';

export async function GET() {
  const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = process.env.APPWRITE_PROJECT_ID || '';
  const apiKey = process.env.APPWRITE_API_KEY || '';
  const databaseId = process.env.APPWRITE_DATABASE_ID || '';

  if (!projectId || !apiKey || !databaseId) {
    // Return empty array if not configured to avoid errors
    return NextResponse.json([]);
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  const databases = new Databases(client);

  try {
    const response = await databases.listDocuments(
      databaseId,
      'transactions',
      [Query.orderDesc('timestamp'), Query.limit(50)]
    );

    const transactions = response.documents.map((doc: any) => ({
      id: doc.txHash || doc.$id,
      merchant: doc.merchant,
      merchantDomain: doc.merchant,
      agentId: doc.agentId,
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status === 'settled' ? 'SETTLED' : 'FAILED',
      timestamp: new Date(doc.timestamp).toLocaleString(),
      time: 'Just now', // Simplified for now
      hash: doc.txHash,
      reasoning: doc.reasoningTrace
    }));

    return NextResponse.json(transactions);
  } catch (err: any) {
    console.error('Transactions API Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

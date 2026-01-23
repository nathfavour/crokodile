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

    const transactions = response.documents.map((doc) => ({
      id: (doc.txHash as string) || doc.$id,
      merchant: doc.merchant as string,
      merchantDomain: doc.merchant as string,
      agentId: doc.agentId as string,
      amount: doc.amount as number,
      currency: doc.currency as string,
      status: doc.status === 'settled' ? 'SETTLED' : 'FAILED',
      timestamp: new Date(doc.timestamp as number).toLocaleString(),
      time: 'Just now', // Simplified for now
      hash: doc.txHash as string,
      reasoning: doc.reasoningTrace as string
    }));

    return NextResponse.json(transactions);
  } catch (err) {
    const error = err as Error;
    console.error('Transactions API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

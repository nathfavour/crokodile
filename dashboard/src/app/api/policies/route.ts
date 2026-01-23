import { NextResponse } from 'next/server';
import { Client, Databases, Query, ID } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';
const databaseId = process.env.APPWRITE_DATABASE_ID || '';

function getDatabases() {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
  return new Databases(client);
}

export async function GET() {
  if (!projectId || !apiKey || !databaseId) {
    return NextResponse.json([
      { id: '8829-X', name: 'Agent_04_Payment', status: 'ACTIVE', dailyBudget: 50.00, currentSpend: 12.50, allowedDomains: ['api.cronos.org', 'nexus-bridge.io'] },
      { id: '1102-Y', name: 'Agent_09_Nexus', status: 'EDITING', dailyBudget: 150.00, currentSpend: 120.00, allowedDomains: ['api.cronos.org', 'nexus-bridge.io'] },
      { id: '4492-Z', name: 'Agent_12_Relay', status: 'PAUSED', dailyBudget: 75.00, currentSpend: 0.00, allowedDomains: ['relay.mainnet.net'] },
    ]);
  }

  try {
    const databases = getDatabases();
    const response = await databases.listDocuments(databaseId, 'policies');
    
    // Map Appwrite docs to our Agent type
    const agents = response.documents.map((doc: any) => ({
      id: doc.agentId,
      name: doc.name || `Agent_${doc.agentId}`,
      status: doc.status || 'ACTIVE',
      dailyBudget: doc.dailyLimit,
      currentSpend: 0, // In a real app, we'd calculate this from transactions
      allowedDomains: doc.allowedDomains || []
    }));

    return NextResponse.json(agents);
  } catch (err: any) {
    console.error('Policies GET Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!projectId || !apiKey || !databaseId) {
    return NextResponse.json({ success: true, message: 'Mock update success' });
  }

  try {
    const body = await request.json();
    const databases = getDatabases();
    
    // Check if policy exists
    const existing = await databases.listDocuments(
      databaseId, 
      'policies', 
      [Query.equal('agentId', body.id)]
    );

    if (existing.total > 0) {
      await databases.updateDocument(
        databaseId,
        'policies',
        existing.documents[0].$id,
        {
          dailyLimit: body.dailyBudget,
          allowedDomains: body.allowedDomains,
          status: body.status,
          name: body.name
        }
      );
    } else {
      await databases.createDocument(
        databaseId,
        'policies',
        ID.unique(),
        {
          agentId: body.id,
          dailyLimit: body.dailyBudget,
          allowedDomains: body.allowedDomains,
          status: body.status,
          name: body.name,
          maxPerRequest: 10.00 // Default
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Policies POST Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

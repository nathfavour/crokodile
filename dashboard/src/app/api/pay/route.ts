import { NextResponse } from 'next/server';
import { processPayment } from '@/lib/engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const config = {
      endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
      projectId: process.env.APPWRITE_PROJECT_ID || '',
      apiKey: process.env.APPWRITE_API_KEY || '',
      databaseId: process.env.APPWRITE_DATABASE_ID || '',
      geminiApiKey: process.env.GEMINI_API_KEY || '',
      agentPrivateKey: process.env.AGENT_PRIVATE_KEY
    };

    const result = await processPayment(body, config);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Payment API Error:', err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

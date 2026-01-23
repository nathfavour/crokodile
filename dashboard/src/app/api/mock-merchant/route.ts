import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const auth = request.headers.get('X-402-Payment-Proof') || request.headers.get('Authorization');

  if (!auth) {
    // Return 402 Payment Required
    const response = new NextResponse(
      JSON.stringify({ 
        error: 'Payment Required', 
        message: 'This resource requires a micro-payment via Crokodile x402 protocol.' 
      }),
      { 
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'X-402-Payment-Request': 'amount=0.01, currency=USDC, merchant=crokodile-mock-merchant.com'
        }
      }
    );
    return response;
  }

  // If proof is provided, "validate" it and return the data
  return NextResponse.json({
    success: true,
    data: "This is the protected content. You have successfully paid 0.01 USDC via Crokodile proxy.",
    proof_received: auth.substring(0, 20) + "..."
  });
}

export async function POST(request: Request) {
  return GET(request);
}

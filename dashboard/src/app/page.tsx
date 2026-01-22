import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      <header className="border-b border-green-900 pb-4 mb-8">
        <h1 className="text-3xl font-bold">🐊 CROKODILE DASHBOARD</h1>
        <p className="text-sm opacity-70">M2M Economy Real-time Monitoring</p>
      </header>
      
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="border border-green-900 p-4">
          <h2 className="text-xl mb-4 border-b border-green-900">Live Snaps (402 Intercepts)</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-xs border-b border-green-900/30 py-1">
              <span>GET https://api.openai.com/v1/chat/completions</span>
              <span className="text-yellow-500">HTTP 402</span>
            </div>
            <div className="flex justify-between text-xs border-b border-green-900/30 py-1">
              <span>POST https://api.anthropic.com/v1/messages</span>
              <span className="text-blue-500">SETTLED (0.005 USDC)</span>
            </div>
          </div>
        </section>

        <section className="border border-green-900 p-4">
          <h2 className="text-xl mb-4 border-b border-green-900">Wallet Overview</h2>
          <div className="text-center py-8">
            <p className="text-4xl font-bold">1,240.50 USDC</p>
            <p className="text-xs opacity-50">Cronos Mainnet (EIP-3009)</p>
          </div>
        </section>
      </main>
    </div>
  );
}

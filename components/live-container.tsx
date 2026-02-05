import React from 'react'

const LiveContainer = () => {
  return (
    <section className="max-w-4xl mx-auto py-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">See Ghostwriter in action</h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium uppercase tracking-wider">
          Live Dashboard Feed
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/50 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="border-b border-white/10 p-4 bg-white/5 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="p-6 space-y-4 font-mono text-sm">
          <div className="flex justify-between text-gray-500">
            <span>[08:00 AM] Daily Market Scan initiated...</span>
            <span className="text-green-500">SUCCESS</span>
          </div>
          <p className="text-gray-300">
            Targeting: Sellers | Reason: Interest rates dropped 0.2%
          </p>
          <p className="text-blue-400">
            Action: AI Newsletter generated with 92% confidence score.
          </p>
          <p className="text-purple-400 font-bold underline">
            Status: Auto-Sent to 142 recipients.
          </p>
        </div>
      </div>
    </section>
  );
}

export default LiveContainer
import React from 'react';

export default function Docs() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-[1440px] mx-auto min-h-[80vh]">
      <div className="mb-12">
        <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">Developers</span>
        <h1 className="text-4xl font-headline font-bold text-white mb-6">API Documentation</h1>
        <p className="text-zinc-400 max-w-2xl leading-relaxed">Integrate DLSS 5 upscaling directly into your applications.</p>
      </div>

      <div className="bg-surface-low rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20">
          <h3 className="text-xl font-headline font-bold text-white">Authentication</h3>
          <p className="text-zinc-400 text-sm mt-2">All API requests require a Bearer token in the Authorization header.</p>
        </div>
        <div className="p-6 bg-surface-lowest">
          <pre className="text-sm font-mono text-zinc-300 overflow-x-auto">
            <code>
{`curl -X POST https://api.monolith.ai/v1/upscale \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "https://example.com/image.jpg",
    "scale": 4,
    "model": "ada-5.0"
  }'`}
            </code>
          </pre>
        </div>
      </div>
    </main>
  );
}

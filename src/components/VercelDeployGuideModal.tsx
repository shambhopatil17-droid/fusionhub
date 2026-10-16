import React, { useState } from 'react';
import { X, ExternalLink, Check, Copy, Triangle, Terminal, Github, Globe } from 'lucide-react';

interface VercelDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployGuideModal: React.FC<VercelDeployGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedVercelJson, setCopiedVercelJson] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  if (!isOpen) return null;

  const vercelJsonCode = `{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const cliCode = `npm install -g vercel\nvercel`;

  const copyText = (text: string, type: 'json' | 'cli') => {
    navigator.clipboard.writeText(text);
    if (type === 'json') {
      setCopiedVercelJson(true);
      setTimeout(() => setCopiedVercelJson(false), 2000);
    } else {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div 
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#faf8f5] rounded-sm border border-stone-300 shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-stone-500 uppercase">
              <Triangle className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
              <span>Step 1 Assignment Guide · Vercel Deployment</span>
            </div>
            <h2 className="font-serif text-2xl font-medium text-stone-950">
              How to Host on Vercel with Clean URLs
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-950 rounded-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-stone-700 font-sans">
          {/* Explanation banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded text-stone-900 space-y-1">
            <span className="font-semibold block text-sm">
              Why was your site showing 404 or not appearing on Vercel?
            </span>
            <p className="leading-relaxed">
              When using clean URLs without hashes (like <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">/couture-architecture-silk-gazar</code>), Vercel's static server looks for a physical HTML file with that name unless you supply a <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">vercel.json</code> rewrite rule. We have now added <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">vercel.json</code> to your root folder!
            </p>
          </div>

          {/* Method 1: Git & GitHub (Recommended) */}
          <div className="p-5 bg-white border border-stone-200 rounded space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Github className="w-4 h-4" />
              <span>Method 1: Connect GitHub to Vercel (Automatic 1-Click)</span>
            </div>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-stone-600">
              <li>
                Push your project code to a GitHub repository (e.g. <code className="font-mono text-stone-800">etoffe-fashion-blog</code>).
              </li>
              <li>
                Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-stone-900 font-semibold underline inline-flex items-center gap-1">vercel.com <ExternalLink className="w-3 h-3" /></a> and sign in with GitHub.
              </li>
              <li>
                Click <strong>"Add New..." → "Project"</strong>, and import your repository.
              </li>
              <li>
                Vercel will detect <strong>Framework: Vite</strong> and <strong>Output Directory: dist</strong> automatically.
              </li>
              <li>
                Click <strong>Deploy</strong>. In ~30 seconds, your live URL will be ready (e.g. <code className="font-mono text-stone-900 font-semibold">your-name.vercel.app</code>) with full support for clean URLs!
              </li>
            </ol>
          </div>

          {/* Method 2: Vercel CLI */}
          <div className="p-5 bg-white border border-stone-200 rounded space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <Terminal className="w-4 h-4" />
                <span>Method 2: Deploy directly via Terminal / CLI</span>
              </div>
              <button
                onClick={() => copyText(cliCode, 'cli')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition-colors"
              >
                {copiedCli ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCli ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-100 rounded font-mono text-[11px] overflow-x-auto">
              {cliCode}
            </pre>
            <p className="text-stone-500 text-[11px]">
              Follow the interactive prompts in your terminal. Vercel will build and give you an instant live link!
            </p>
          </div>

          {/* Vercel JSON Config Details */}
          <div className="p-5 bg-white border border-stone-200 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">
                Created Configuration File: <code className="font-mono text-stone-700">/vercel.json</code>
              </span>
              <button
                onClick={() => copyText(vercelJsonCode, 'json')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition-colors"
              >
                {copiedVercelJson ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedVercelJson ? 'Copied' : 'Copy Config'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-100 rounded font-mono text-[11px] overflow-x-auto">
              {vercelJsonCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 text-xs font-semibold rounded hover:bg-stone-800 transition-colors"
          >
            <span>Open Vercel Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded hover:bg-stone-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

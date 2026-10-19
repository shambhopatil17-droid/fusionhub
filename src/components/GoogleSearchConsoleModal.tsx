import React, { useState, useEffect } from 'react';
import { X, Search, Check, Copy, ExternalLink, ShieldCheck, FileCode, Globe, HelpCircle, CheckCircle2 } from 'lucide-react';

interface GoogleSearchConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSearchConsoleModal: React.FC<GoogleSearchConsoleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [verificationCode, setVerificationCode] = useState(() => {
    return localStorage.getItem('gsc_verification_token') || '';
  });
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const siteOrigin = typeof window !== 'undefined' && window.location.origin.includes('vercel.app') 
    ? window.location.origin 
    : 'https://fusionhub-q6wl.vercel.app';

  const sitemapUrl = `${siteOrigin}/sitemap.xml`;
  const robotsUrl = `${siteOrigin}/robots.txt`;

  // Sync with document meta tag
  useEffect(() => {
    if (verificationCode) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', verificationCode);
    }
  }, [verificationCode]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean input if user pasted the entire <meta name="google-site-verification" content="..." /> tag
    let token = verificationCode.trim();
    const match = token.match(/content=["']([^"']+)["']/);
    if (match && match[1]) {
      token = match[1];
    }
    setVerificationCode(token);
    localStorage.setItem('gsc_verification_token', token);

    // Apply to DOM meta tag immediately
    let meta = document.querySelector('meta[name="google-site-verification"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'google-site-verification');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', token);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const fullMetaTag = `<meta name="google-site-verification" content="${verificationCode || 'YOUR_VERIFICATION_TOKEN'}" />`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden my-8"
        role="dialog"
        aria-labelledby="gsc-modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 id="gsc-modal-title" className="font-serif text-lg tracking-tight">
                Google Search Console Setup
              </h2>
              <p className="text-xs text-stone-400 font-sans">
                Verify site ownership, submit sitemap, and enable Google indexing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick status */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
            <div className="text-xs text-emerald-950 space-y-1">
              <p className="font-semibold text-sm">Site Ready for Google Search Console Verification</p>
              <p className="text-emerald-800">
                Your website has an XML Sitemap with clean URLs (no numbers), robots.txt configured, and a dedicated verification hook for Google Search Console.
              </p>
            </div>
          </div>

          {/* Form: Paste verification code */}
          <form onSubmit={handleSave} className="space-y-3 bg-stone-50 p-4 rounded-lg border border-stone-200">
            <div className="flex items-center justify-between">
              <label htmlFor="gsc-token" className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                Google Verification Token or Meta Tag
              </label>
              <span className="text-[11px] text-stone-500">From Search Console &gt; HTML tag method</span>
            </div>
            
            <div className="flex gap-2">
              <input
                id="gsc-token"
                type="text"
                placeholder="e.g. google-site-verification token or paste whole <meta ... />"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded transition-colors shrink-0"
              >
                Apply to Site
              </button>
            </div>

            {savedSuccess && (
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-medium animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verification meta tag saved and injected into &lt;head&gt; successfully!</span>
              </div>
            )}
            
            <p className="text-[11px] text-stone-500">
              Paste the code provided by Google Search Console. It will update your active HTML &lt;meta&gt; tag instantly.
            </p>
          </form>

          {/* Verification Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-stone-600" />
                Meta Tag for HTML &lt;head&gt; (in index.html)
              </span>
              <button
                onClick={() => handleCopy(fullMetaTag, 'meta')}
                className="inline-flex items-center gap-1 text-xs text-stone-700 hover:text-black font-medium"
              >
                {copiedType === 'meta' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Tag</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-stone-950 text-stone-200 rounded font-mono text-[11px] overflow-x-auto border border-stone-800">
              {fullMetaTag}
            </pre>
          </div>

          {/* Sitemap & Robots.txt Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-stone-100 rounded border border-stone-200 space-y-1">
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
                Sitemap URL (Submit in Search Console)
              </span>
              <div className="flex items-center justify-between gap-2">
                <a 
                  href={sitemapUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs font-mono text-emerald-700 hover:underline truncate"
                >
                  {sitemapUrl}
                </a>
                <button
                  onClick={() => handleCopy(sitemapUrl, 'sitemap')}
                  className="p-1 hover:bg-stone-200 rounded shrink-0"
                  title="Copy Sitemap URL"
                >
                  {copiedType === 'sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-700" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-stone-100 rounded border border-stone-200 space-y-1">
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
                Robots.txt URL
              </span>
              <div className="flex items-center justify-between gap-2">
                <a 
                  href={robotsUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs font-mono text-stone-800 hover:underline truncate"
                >
                  {robotsUrl}
                </a>
                <button
                  onClick={() => handleCopy(robotsUrl, 'robots')}
                  className="p-1 hover:bg-stone-200 rounded shrink-0"
                  title="Copy Robots URL"
                >
                  {copiedType === 'robots' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-700" />}
                </button>
              </div>
            </div>
          </div>

          {/* 3-Step Verification Guide */}
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
              How to Complete Verification in Google Search Console:
            </h3>

            <ol className="space-y-2.5 text-xs text-stone-700 leading-relaxed list-decimal list-inside pl-1">
              <li>
                Open{' '}
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-stone-900 underline hover:text-emerald-700"
                >
                  Google Search Console <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Click <strong>&quot;Add Property&quot;</strong> &rarr; Select <strong>&quot;URL prefix&quot;</strong> &rarr; Enter your live site URL: <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">{siteOrigin}</code>
              </li>
              <li>
                Under <strong>&quot;Other verification methods&quot;</strong>, choose <strong>HTML tag</strong>. Copy the tag or the <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">content=&quot;...&quot;</code> code.
              </li>
              <li>
                Paste it into the box above and click <strong>&quot;Apply to Site&quot;</strong>, then push your latest code to your repository so Vercel deploys the index.html change.
              </li>
              <li>
                In Google Search Console, click <strong>&quot;Verify&quot;</strong>. Once verified, go to <strong>Sitemaps</strong> and submit <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">sitemap.xml</code>.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-black hover:underline"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Open Google Search Console</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

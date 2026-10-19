import React, { useState, useEffect } from 'react';
import { X, Search, Check, Copy, ExternalLink, ShieldCheck, FileCode, Globe, AlertTriangle, CheckCircle2, Download, HelpCircle } from 'lucide-react';

interface GoogleSearchConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSearchConsoleModal: React.FC<GoogleSearchConsoleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeMethod, setActiveMethod] = useState<'meta' | 'file'>('meta');
  const [verificationCode, setVerificationCode] = useState(() => {
    return localStorage.getItem('gsc_verification_token') || '';
  });
  const [htmlFileName, setHtmlFileName] = useState('googled5e976b009.html');
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
    let token = verificationCode.trim();
    // If user pasted the whole <meta ... /> tag, extract content attribute
    const match = token.match(/content=["']([^"']+)["']/);
    if (match && match[1]) {
      token = match[1];
    }
    setVerificationCode(token);
    localStorage.setItem('gsc_verification_token', token);

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

  const handleDownloadHtmlFile = () => {
    const cleanName = htmlFileName.trim().endsWith('.html') ? htmlFileName.trim() : `${htmlFileName.trim()}.html`;
    const content = `google-site-verification: ${cleanName}`;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fullMetaTag = `<meta name="google-site-verification" content="${verificationCode || 'YOUR_GSC_VERIFICATION_TOKEN'}" />`;

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
                Google Search Console Ownership Verification
              </h2>
              <p className="text-xs text-stone-400 font-sans">
                Fix verification failures, submit sitemap, and track indexed search rankings
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
          {/* Explanation Banner for the "Ownership verification failed" popup */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-950 space-y-1">
              <p className="font-semibold text-sm">
                Why your popup said: &quot;Verification file was not found in the required location&quot;
              </p>
              <p className="text-amber-800 leading-relaxed">
                When you clicked Verify using the <strong>&quot;HTML file&quot;</strong> method, Google looked for a downloaded file on your domain, but it hasn&apos;t been placed in your project&apos;s <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">public/</code> directory yet.
              </p>
              <p className="font-medium text-amber-900 pt-1">
                &rarr; Solution: Switch to the <strong>HTML Tag</strong> method below (takes 10 seconds, no file upload required!), OR place the HTML file in <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">public/</code>.
              </p>
            </div>
          </div>

          {/* Verification Method Tabs */}
          <div className="flex border-b border-stone-200">
            <button
              onClick={() => setActiveMethod('meta')}
              className={`flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeMethod === 'meta'
                  ? 'border-stone-900 text-stone-950 bg-stone-50'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <FileCode className="w-4 h-4 text-emerald-600" />
              <span>Method 1: HTML Tag (Recommended)</span>
            </button>
            <button
              onClick={() => setActiveMethod('file')}
              className={`flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeMethod === 'file'
                  ? 'border-stone-900 text-stone-950 bg-stone-50'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Method 2: HTML File</span>
            </button>
          </div>

          {activeMethod === 'meta' && (
            <div className="space-y-4 animate-fade-in">
              {/* Form: Paste verification code */}
              <form onSubmit={handleSave} className="space-y-3 bg-stone-50 p-4 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="gsc-token" className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                    Paste Google Verification Token or Meta Tag
                  </label>
                  <span className="text-[11px] text-stone-500">From &quot;HTML tag&quot; option in Search Console</span>
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
                    <span>Tag applied! Head tag &lt;meta name=&quot;google-site-verification&quot;&gt; is now active.</span>
                  </div>
                )}
                
                <p className="text-[11px] text-stone-500">
                  In Google Search Console, click &quot;OK&quot; on the failure popup, expand <strong>&quot;HTML tag&quot;</strong>, copy the code, and paste it here.
                </p>
              </form>

              {/* Tag Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-stone-600" />
                    Active Meta Tag in index.html:
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
            </div>
          )}

          {activeMethod === 'file' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-3">
                <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                  Verify with Google HTML File
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Google gave you a file like <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-[11px]">google90c8a6f43e.html</code>.
                  To use this method, you must place this file inside your project&apos;s <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-[11px]">public/</code> directory and push to GitHub so Vercel serves it.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. google90c8a6f43e123456.html"
                    value={htmlFileName}
                    onChange={(e) => setHtmlFileName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                  />
                  <button
                    onClick={handleDownloadHtmlFile}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>

                <p className="text-[11px] text-stone-500">
                  Or simply tell me your filename in the chat, and I will create it directly in your project&apos;s <code className="font-mono">public/</code> directory for you!
                </p>
              </div>
            </div>
          )}

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

          {/* Quick Step by Step */}
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
              How to Complete Verification Now:
            </h3>

            <ol className="space-y-2 text-xs text-stone-700 leading-relaxed list-decimal list-inside pl-1">
              <li>
                In the Google Search Console popup, click <strong>&quot;OK&quot;</strong>.
              </li>
              <li>
                Scroll down to the section titled <strong>&quot;Other verification methods&quot;</strong>.
              </li>
              <li>
                Click on <strong>&quot;HTML tag&quot;</strong>. Copy the code (e.g. <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;</code>).
              </li>
              <li>
                Paste it in the box above (or share it in chat), click <strong>&quot;Apply to Site&quot;</strong>.
              </li>
              <li>
                Go back to Google Search Console and click <strong>&quot;Verify&quot;</strong>. It will verify instantly!
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

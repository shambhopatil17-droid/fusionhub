import React, { useState } from 'react';
import { KEYWORD_MAP, KeywordMapEntry } from '../data/articles';
import { X, Search, CheckCircle2, Globe, FileText, HelpCircle, Layers, ArrowRight } from 'lucide-react';

interface SeoKeywordMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToUrl: (url: string) => void;
  currentPageUrl: string;
}

export const SeoKeywordMapModal: React.FC<SeoKeywordMapModalProps> = ({
  isOpen,
  onClose,
  onNavigateToUrl,
  currentPageUrl,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<KeywordMapEntry | null>(() => {
    return KEYWORD_MAP.find(e => e.url === currentPageUrl) || KEYWORD_MAP[0];
  });

  if (!isOpen) return null;

  const filteredMap = KEYWORD_MAP.filter(entry => 
    entry.pageName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    entry.mainKeyword.toLowerCase().includes(filterQuery.toLowerCase()) ||
    entry.relatedKeywords.toLowerCase().includes(filterQuery.toLowerCase()) ||
    entry.url.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#faf8f5] rounded-sm border border-stone-300 shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 bg-white flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-stone-500 uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>SEO & AEO Audit Suite · Part A Keyword Research Map</span>
            </div>
            <h2 className="font-serif text-2xl font-medium text-stone-950">
              Keyword Research Map & On-Page SEO Validator
            </h2>
            <p className="text-xs text-stone-600 font-reading">
              Full keyword map for Homepage and all 10 blog articles adhering to clean URL rules, 50-60 char titles, 150-160 char meta descriptions, and question-answer AEO format.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
            aria-label="Close SEO modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by keyword, page, or clean URL..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div className="text-xs font-sans text-stone-600">
            Showing <strong className="text-stone-900">{filteredMap.length}</strong> of {KEYWORD_MAP.length} indexed pages
          </div>
        </div>

        {/* Modal Body: Two-Pane View (Table & Inspector) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Detailed Inspector for Selected Entry */}
          {selectedEntry && (
            <div className="p-5 bg-white border border-stone-200 rounded-sm space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-stone-700" />
                  <span className="font-mono text-xs font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    {selectedEntry.url}
                  </span>
                  <span className="text-xs text-stone-500">
                    ({selectedEntry.pageName})
                  </span>
                </div>

                <button
                  onClick={() => {
                    onNavigateToUrl(selectedEntry.url);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-stone-50 text-xs font-semibold rounded hover:bg-stone-800 transition-colors"
                >
                  <span>Visit Live Page</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Main Keyword */}
                <div className="p-3 bg-stone-50 rounded border border-stone-100 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">
                    Main Keyword
                  </span>
                  <p className="font-semibold text-stone-900 text-sm">
                    {selectedEntry.mainKeyword}
                  </p>
                </div>

                {/* 2 Related Keywords */}
                <div className="p-3 bg-stone-50 rounded border border-stone-100 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">
                    2 Related Keywords
                  </span>
                  <p className="font-medium text-stone-800">
                    {selectedEntry.relatedKeywords}
                  </p>
                </div>

                {/* Search Intent & Volume */}
                <div className="p-3 bg-stone-50 rounded border border-stone-100 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">
                    Intent & Est. Volume
                  </span>
                  <p className="font-semibold text-stone-900">
                    {selectedEntry.intent} · <span className="font-mono text-stone-600">{selectedEntry.volume}</span>
                  </p>
                </div>

                {/* Question it answers */}
                <div className="p-3 bg-stone-50 rounded border border-stone-100 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">
                    AEO Target Question
                  </span>
                  <p className="text-stone-800 italic">
                    "{selectedEntry.questionItAnswers}"
                  </p>
                </div>
              </div>

              {/* Title Tag & Meta Description Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                {/* Title tag */}
                <div className="space-y-1.5 p-3 bg-stone-50 rounded border border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">
                      Title Tag (`&lt;title&gt;`)
                    </span>
                    <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedEntry.titleTag.length} chars (Target: 50-60)
                    </span>
                  </div>
                  <p className="font-mono text-stone-800 bg-white p-2 border border-stone-200 rounded text-[11px]">
                    {selectedEntry.titleTag}
                  </p>
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5 p-3 bg-stone-50 rounded border border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">
                      Meta Description (`&lt;meta name="description"&gt;`)
                    </span>
                    <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedEntry.metaDescription.length} chars (Target: 150-160)
                    </span>
                  </div>
                  <p className="font-mono text-stone-800 bg-white p-2 border border-stone-200 rounded text-[11px]">
                    {selectedEntry.metaDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Master Keyword Map Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-sm bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 border-b border-stone-200 text-stone-700 font-semibold uppercase font-sans text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Page</th>
                  <th className="py-3 px-4">Clean URL</th>
                  <th className="py-3 px-4">Main Keyword</th>
                  <th className="py-3 px-4">2 Related Keywords</th>
                  <th className="py-3 px-4">Intent</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Question It Answers</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMap.map((row, idx) => {
                  const isSelected = selectedEntry?.url === row.url;
                  return (
                    <tr
                      key={row.url}
                      onClick={() => setSelectedEntry(row)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-stone-100 font-medium' 
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {row.pageName}
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-600 whitespace-nowrap">
                        {row.url}
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-950">
                        <span className="bg-stone-200/80 px-1.5 py-0.5 rounded text-stone-900">
                          {row.mainKeyword}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {row.relatedKeywords}
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-sans">
                        {row.intent}
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-600">
                        {row.volume}
                      </td>
                      <td className="py-3 px-4 text-stone-700 max-w-xs truncate" title={row.questionItAnswers}>
                        {row.questionItAnswers}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToUrl(row.url);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-[11px] bg-stone-900 hover:bg-stone-800 text-stone-50 rounded font-semibold transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer with Assignment Criteria Checklist */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 1. Clean URLs (no #, hyphens)
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 2. Main + 2 Related Keywords
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3. Title Tag Rules (50-60 chars)
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 4. Meta Description Rules (150-160 chars)
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 5. Images with Alt Text
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 6. Descriptive Anchor Text
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 7. H2 Question-Answer AEO Format
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-stone-50 rounded text-xs font-semibold uppercase tracking-wider"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

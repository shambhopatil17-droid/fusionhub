import React, { useState } from 'react';
import { Bookmark, Menu, X, Search, Sparkles, Table2 } from 'lucide-react';

interface NavbarProps {
  onNavigateHome: () => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  savedCount: number;
  onOpenReadingList: () => void;
  onOpenSubscribe: () => void;
  onOpenKeywordMap: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onSelectCategory,
  activeCategory,
  savedCount,
  onOpenReadingList,
  onOpenSubscribe,
  onOpenKeywordMap,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navLinks = [
    { label: "All Essays", category: "All Disciplines" },
    { label: "Haute Couture", category: "Haute Couture" },
    { label: "Pattern & Cut", category: "Pattern & Cut" },
    { label: "Textile Science", category: "Textile Science" },
    { label: "Tailoring", category: "Tailoring & Menswear" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onNavigateHome}
              className="text-2xl sm:text-3xl font-serif tracking-tight text-stone-900 hover:text-stone-700 transition-colors whitespace-nowrap text-left"
            >
              ÉTOFFE
            </button>
            <span className="hidden lg:inline text-xs text-stone-600 uppercase tracking-widest pl-3 border-l border-stone-300">
              Fashion Design Journal
            </span>
          </div>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            {navLinks.map((item) => {
              const isActive = activeCategory === item.category;
              return (
                <button
                  key={item.category}
                  onClick={() => {
                    onSelectCategory(item.category);
                  }}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 ${
                    isActive ? "text-stone-950 font-semibold" : "text-stone-600"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Utilities */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Keyword Research Table / SEO Map button */}
            <button
              onClick={onOpenKeywordMap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-200/80 hover:bg-stone-300 rounded-md transition-colors"
              title="View Part A: Keyword Research Table & On-Page SEO Validator"
            >
              <Table2 className="w-3.5 h-3.5 text-stone-700" />
              <span className="hidden sm:inline">Keyword Map (Part A)</span>
              <span className="sm:hidden font-mono">SEO</span>
            </button>

            {/* Quick search input toggle */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search fashion essays, craft..."
                    className="w-40 sm:w-56 text-xs px-3 py-2 bg-stone-100 border border-stone-300 rounded-md text-stone-900 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-700"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      onSearchChange('');
                    }}
                    className="p-1.5 ml-1 text-stone-500 hover:text-stone-900"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
                  aria-label="Search articles"
                  title="Search articles"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Reading List affordance */}
            <button
              onClick={onOpenReadingList}
              className="relative p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
              aria-label="View saved articles"
              title="Reading List"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-stone-900 text-stone-50 text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenSubscribe}
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-50 bg-stone-900 hover:bg-stone-800 rounded-md transition-colors whitespace-nowrap shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              The Dispatch
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 space-y-2">
            <div className="px-2 pb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search fashion essays..."
                className="w-full text-xs px-3 py-2 bg-stone-100 border border-stone-300 rounded-md text-stone-900"
              />
            </div>
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((item) => (
                <button
                  key={item.category}
                  onClick={() => {
                    onSelectCategory(item.category);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    activeCategory === item.category
                      ? "bg-stone-200 text-stone-900 font-semibold"
                      : "text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-stone-200 space-y-2 px-3">
              <button
                onClick={() => {
                  onOpenKeywordMap();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-stone-200 text-stone-900 text-xs font-semibold rounded text-center flex items-center justify-center gap-2"
              >
                <Table2 className="w-4 h-4" />
                <span>View Keyword Research Map (Part A)</span>
              </button>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    onOpenReadingList();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-medium text-stone-700 flex items-center gap-2 py-1"
                >
                  <Bookmark className="w-4 h-4" />
                  Reading List ({savedCount})
                </button>
                <button
                  onClick={() => {
                    onOpenSubscribe();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold px-3 py-1.5 bg-stone-900 text-white rounded-md"
                >
                  Join Dispatch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

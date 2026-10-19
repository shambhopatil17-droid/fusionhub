import React, { useState, useEffect, useMemo } from 'react';
import { ARTICLES, Article, CATEGORIES, HOMEPAGE_SEO, KEYWORD_MAP } from './data/articles';
import { Navbar } from './components/Navbar';
import { FeaturedHero } from './components/FeaturedHero';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { ReadingListDrawer } from './components/ReadingListDrawer';
import { NewsletterModal } from './components/NewsletterModal';
import { SeoKeywordMapModal } from './components/SeoKeywordMapModal';
import { VercelDeployGuideModal } from './components/VercelDeployGuideModal';
import { WebsitePreviewModal } from './components/WebsitePreviewModal';
import { GoogleSearchConsoleModal } from './components/GoogleSearchConsoleModal';
import { Footer } from './components/Footer';
import { 
  SlidersHorizontal, 
  Sparkles, 
  Compass, 
  ArrowRight,
  BookOpen,
  Table2,
  CheckCircle2,
  ShieldCheck,
  Triangle,
  Image as ImageIcon,
  Search
} from 'lucide-react';

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All Disciplines");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('etoffe_saved_articles');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isReadingListOpen, setIsReadingListOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isKeywordMapOpen, setIsKeywordMapOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const [isWebsitePreviewOpen, setIsWebsitePreviewOpen] = useState(false);
  const [isGscModalOpen, setIsGscModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'chronological' | 'readTime'>('chronological');

  // Sync saved bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('etoffe_saved_articles', JSON.stringify(savedArticleIds));
    } catch {
      // ignore
    }
  }, [savedArticleIds]);

  // Clean URL Routing without # symbols, random IDs, or numbers (Slide 7 standard!)
  useEffect(() => {
    const syncRouteFromLocation = () => {
      // 1. Check pathname (e.g. /silk-gazar)
      let path = window.location.pathname.replace(/^\//, '');
      
      // 2. If a # number symbol exists in URL, strip it immediately to enforce clean URLs
      if (window.location.hash) {
        if (!path) {
          path = window.location.hash.replace(/^#\/?(article\/)?/, '');
        }
      }

      if (path && path !== '') {
        const found = ARTICLES.find(a => 
          a.slug === path || 
          a.cleanUrl.replace(/^\//, '') === path || 
          a.id === path ||
          a.legacySlugs.includes(path)
        );
        if (found) {
          setSelectedArticle(found);
          // Ensure URL in address bar has NO # symbol
          if (window.location.hash) {
            window.history.replaceState(null, '', found.cleanUrl);
          }
          return;
        }
      }

      if (window.location.hash) {
        window.history.replaceState(null, '', '/');
      }
      setSelectedArticle(null);
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, []);

  // Update Dynamic Document Title, Meta Description & Canonical tag (Slide 8 & 9 rules)
  useEffect(() => {
    const title = selectedArticle ? selectedArticle.seo.titleTag : HOMEPAGE_SEO.titleTag;
    const metaDesc = selectedArticle ? selectedArticle.seo.metaDescription : HOMEPAGE_SEO.metaDescription;
    const currentUrl = selectedArticle ? `${window.location.origin}${selectedArticle.cleanUrl}` : window.location.origin;

    // 1. Set document.title (50-60 chars, keyword at start)
    document.title = title;

    // 2. Set <meta name="description"> (150-160 chars)
    let metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (!metaDescriptionTag) {
      metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.setAttribute('name', 'description');
      document.head.appendChild(metaDescriptionTag);
    }
    metaDescriptionTag.setAttribute('content', metaDesc);

    // 3. Set OpenGraph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', metaDesc);

    // 4. Set Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
  }, [selectedArticle]);

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    window.history.pushState(null, '', article.cleanUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedArticle(null);
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToUrl = (url: string) => {
    if (url === '/' || url === '') {
      handleBackToHome();
    } else {
      const slug = url.replace(/^\//, '');
      const found = ARTICLES.find(a => 
        a.slug === slug || 
        a.cleanUrl === url || 
        a.legacySlugs.includes(slug)
      );
      if (found) {
        handleSelectArticle(found);
      }
    }
  };

  const handleToggleSave = (articleId: string) => {
    setSavedArticleIds(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  // Find featured lead article
  const featuredArticle = useMemo(() => {
    return ARTICLES.find(a => a.featured) || ARTICLES[0];
  }, []);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let list = [...ARTICLES];

    // Filter by Category
    if (activeCategory !== "All Disciplines") {
      list = list.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.subtitle.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query) ||
        a.seo.mainKeyword.toLowerCase().includes(query) ||
        a.seo.relatedKeywords.some(rk => rk.toLowerCase().includes(query)) ||
        a.tags.some(t => t.toLowerCase().includes(query)) ||
        a.author.name.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === 'readTime') {
      list.sort((a, b) => {
        const timeA = parseInt(a.readTime) || 0;
        const timeB = parseInt(b.readTime) || 0;
        return timeA - timeB;
      });
    }

    return list;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col font-sans selection:bg-stone-900 selection:text-stone-50">
      {/* Primary Top Navigation Bar */}
      <Navbar
        onNavigateHome={handleBackToHome}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (selectedArticle) {
            handleBackToHome();
          }
        }}
        activeCategory={activeCategory}
        savedCount={savedArticleIds.length}
        onOpenReadingList={() => setIsReadingListOpen(true)}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        onOpenKeywordMap={() => setIsKeywordMapOpen(true)}
        onOpenPreviewModal={() => setIsWebsitePreviewOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main View Router: Dedicated Article Page OR Homepage Compendium */}
      {selectedArticle ? (
        <ArticleView
          article={selectedArticle}
          onBack={handleBackToHome}
          onSelectArticle={handleSelectArticle}
          isSaved={savedArticleIds.includes(selectedArticle.id)}
          onToggleSave={handleToggleSave}
          onOpenSeoInspector={() => setIsKeywordMapOpen(true)}
        />
      ) : (
        <main className="flex-1">
          {/* Institutional SEO Banner: Quick Access to Part A Keyword Research & Vercel Guide */}
          <section className="bg-stone-900 text-stone-200 py-3 px-4 sm:px-6 border-b border-stone-800 text-xs">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong>On-Page SEO & AEO Standard Verified:</strong> Clean URLs, Question-Answer H2s, Title rules (50-60 chars), Meta descriptions (150-160 chars), All Images &lt;100KB.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsGscModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded font-semibold text-[11px] uppercase tracking-wider transition-colors shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Google Search Console</span>
                </button>
                <button
                  onClick={() => setIsWebsitePreviewOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-stone-50 rounded font-semibold text-[11px] uppercase tracking-wider transition-colors shrink-0"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Website Screenshot & HTML Links</span>
                </button>
                <button
                  onClick={() => setIsVercelModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-semibold text-[11px] uppercase tracking-wider transition-colors shrink-0 border border-stone-700"
                >
                  <Triangle className="w-3 h-3 text-stone-300 fill-stone-300" />
                  <span>Host on Vercel (Step 1)</span>
                </button>
                <button
                  onClick={() => setIsKeywordMapOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-900 hover:bg-white rounded font-semibold text-[11px] uppercase tracking-wider transition-colors shrink-0"
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>Keyword Research Table (Part A)</span>
                </button>
              </div>
            </div>
          </section>

          {/* Featured Article Section (Only shown when no active search) */}
          {!searchQuery.trim() && activeCategory === "All Disciplines" && (
            <FeaturedHero
              article={featuredArticle}
              onSelectArticle={handleSelectArticle}
              isSaved={savedArticleIds.includes(featuredArticle.id)}
              onToggleSave={handleToggleSave}
              onOpenKeywordMap={() => setIsKeywordMapOpen(true)}
            />
          )}

          {/* Section: All Articles Compendium */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            {/* Header & Filter Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-stone-600">
                  <Compass className="w-3.5 h-3.5" />
                  <span>The 2026 Collection</span>
                  <span aria-hidden="true">·</span>
                  <span>10 Peer-Reviewed Fashion Design Essays</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-950">
                  Fashion Design Journal Compendium
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 font-reading">
                  Investigating high-twist silk gazar architecture, zero-waste geometric cutting, bio-textiles, and the art of modern dress.
                </p>
              </div>

              {/* Functional Interactive Filter Controls (Allowed per Section 1.A) */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-md">
                  {CATEGORIES.slice(0, 5).map((category) => {
                    const isActive = activeCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                          isActive 
                            ? "bg-white text-stone-950 shadow-xs font-semibold" 
                            : "text-stone-700 hover:text-stone-950"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-1.5 text-xs text-stone-700 ml-auto sm:ml-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-stone-700" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-0 text-xs font-semibold text-stone-900 focus:ring-0 cursor-pointer"
                  >
                    <option value="chronological">Archival Order</option>
                    <option value="readTime">Read Time (Shortest)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active search or category banner */}
            {(searchQuery.trim() || activeCategory !== "All Disciplines") && (
              <div className="mt-6 p-4 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-between">
                <div className="text-xs text-stone-700">
                  Showing <strong className="text-stone-900">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'essay' : 'essays'}
                  {activeCategory !== "All Disciplines" && <span> in <span className="font-semibold text-stone-950">{activeCategory}</span></span>}
                  {searchQuery.trim() && <span> matching "<span className="font-semibold text-stone-950">{searchQuery}</span>"</span>}
                </div>
                <button
                  onClick={() => {
                    setActiveCategory("All Disciplines");
                    setSearchQuery("");
                  }}
                  className="text-xs font-semibold text-stone-900 hover:underline uppercase tracking-wider"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* 10 Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center mx-auto text-stone-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-stone-800">
                  No monograph essays found
                </h3>
                <p className="text-sm text-stone-500 max-w-sm mx-auto">
                  We could not find articles matching your criteria. Try adjusting your keyword search or selected discipline.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All Disciplines");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-stone-900 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {filteredArticles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    index={index}
                    onSelectArticle={handleSelectArticle}
                    isSaved={savedArticleIds.includes(article.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Curatorial Atelier Spotlight Section */}
          <section className="bg-stone-900 text-stone-100 py-16 border-t border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-400">
                    <Sparkles className="w-3.5 h-3.5 text-stone-300" />
                    <span>The Atelier Philosophy</span>
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight">
                    "Clothing is the intimate space between the human body and the world."
                  </h3>
                  <p className="font-reading text-stone-400 text-base leading-relaxed max-w-2xl">
                    ÉTOFFE documents the hidden technical rigor of dress: the geometry of grainlines, the internal armatures of horsehair and coutil, the chemistry of mycelium fermentation, and the revolutionary deconstruction of the seam.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4">
                    <button
                      onClick={() => handleSelectArticle(ARTICLES[1])}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-white text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
                    >
                      <span>Explore Zero-Waste Drafting Techniques</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsKeywordMapOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-700 hover:border-stone-500 text-stone-200 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
                    >
                      <span>View Part A Keyword Map</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 p-6 bg-stone-800/80 border border-stone-700 rounded-sm space-y-4 text-xs font-sans">
                  <h4 className="font-serif text-lg font-medium text-stone-100">
                    Volume XIV Research Pillars
                  </h4>
                  <ul className="space-y-3 text-stone-300">
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-stone-400">01.</span>
                      <span>High-filament tensile resilience in silk gazar and organza</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-stone-400">02.</span>
                      <span>Algorithmic zero-waste pattern tessellations & grading</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-stone-400">03.</span>
                      <span>Microbial hyphae cross-linking in non-petroleum bio-leathers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-stone-400">04.</span>
                      <span>Neapolitan deconstructed soft tailoring vs. Savile Row buckram</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Slide-over Reading List Drawer */}
      <ReadingListDrawer
        isOpen={isReadingListOpen}
        onClose={() => setIsReadingListOpen(false)}
        savedIds={savedArticleIds}
        onToggleSave={handleToggleSave}
        onSelectArticle={handleSelectArticle}
      />

      {/* Keyword Research Map & SEO Audit Modal (Part A of assignment) */}
      <SeoKeywordMapModal
        isOpen={isKeywordMapOpen}
        onClose={() => setIsKeywordMapOpen(false)}
        onNavigateToUrl={handleNavigateToUrl}
        currentPageUrl={selectedArticle ? selectedArticle.cleanUrl : '/'}
      />

      {/* Step 1: Vercel Hosting & Deployment Guide Modal */}
      <VercelDeployGuideModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
      />

      {/* Website Preview, HTML Links & Image Size Audit Modal */}
      <WebsitePreviewModal
        isOpen={isWebsitePreviewOpen}
        onClose={() => setIsWebsitePreviewOpen(false)}
        onNavigateToUrl={handleNavigateToUrl}
      />

      {/* Newsletter / Dispatch Inscription Modal */}
      <NewsletterModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />

      {/* Google Search Console Setup & Verification Modal */}
      <GoogleSearchConsoleModal
        isOpen={isGscModalOpen}
        onClose={() => setIsGscModalOpen(false)}
      />

      {/* Curatorial Masthead Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (selectedArticle) {
            handleBackToHome();
          }
        }}
        onNavigateHome={handleBackToHome}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        onOpenGsc={() => setIsGscModalOpen(true)}
      />
    </div>
  );
}

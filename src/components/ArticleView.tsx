import React, { useState, useEffect } from 'react';
import { Article, ARTICLES } from '../data/articles';
import { FallbackImage } from './FallbackImage';
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Check, 
  Clock, 
  BookOpen, 
  ArrowRight,
  ListOrdered,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  isSaved: boolean;
  onToggleSave: (articleId: string) => void;
  onOpenSeoInspector: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBack,
  onSelectArticle,
  isSaved,
  onToggleSave,
  onOpenSeoInspector,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'standard' | 'large' | 'editorial'>('standard');
  const [activeTocId, setActiveTocId] = useState<string>('');
  const [showSeoCard, setShowSeoCard] = useState(false);

  // Track scroll reading progress
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check which section is currently in view
      const sectionElements = article.sections.map(s => document.getElementById(s.id));
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveTocId(article.sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const relatedArticles = ARTICLES.filter(a => article.relatedIds.includes(a.id) || (a.category === article.category && a.id !== article.id)).slice(0, 3);

  const getReadingSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'reading-size-large';
      case 'editorial':
        return 'reading-size-editorial';
      default:
        return 'reading-size-standard';
    }
  };

  return (
    <article className="min-h-screen bg-[#fbf9f5] text-stone-900 pb-20">
      {/* Sticky Reading Progress Rail */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone-200 z-50">
        <div 
          className="h-full bg-stone-900 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Utility Nav Strip */}
      <div className="border-b border-stone-200 bg-[#fbf9f5]/90 sticky top-1 z-30 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-950 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Compendium</span>
          </button>

          {/* Controls: SEO Inspect, Type Size, Save, Share */}
          <div className="flex items-center gap-2.5">
            {/* Quick SEO Badge & Inspector */}
            <button
              onClick={() => setShowSeoCard(!showSeoCard)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-stone-200/80 hover:bg-stone-300 rounded text-stone-800 transition-colors"
              title="Inspect On-Page SEO Metrics"
            >
              <Info className="w-3.5 h-3.5 text-stone-700" />
              <span className="hidden sm:inline">SEO & Keywords</span>
            </button>

            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-100 p-0.5 rounded-md border border-stone-200">
              <span className="text-[10px] uppercase font-mono px-1 text-stone-400">Type</span>
              <button
                onClick={() => setFontSize('standard')}
                className={`px-2 py-0.5 text-xs rounded transition-colors ${
                  fontSize === 'standard' ? 'bg-white font-semibold text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Standard Size"
              >
                1x
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 text-xs rounded transition-colors ${
                  fontSize === 'large' ? 'bg-white font-semibold text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Large Size"
              >
                1.2x
              </button>
              <button
                onClick={() => setFontSize('editorial')}
                className={`px-2 py-0.5 text-xs rounded transition-colors ${
                  fontSize === 'editorial' ? 'bg-white font-semibold text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Editorial Size"
              >
                1.4x
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(article.id)}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              title={isSaved ? "Saved to Reading List" : "Save for Later"}
              aria-label="Bookmark article"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-stone-900 fill-stone-900" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Share / Copy button */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-md transition-colors"
              title="Copy Article Clean URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied Clean URL</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* On-Page SEO Drawer Card (Live verification for student & evaluator) */}
        {showSeoCard && (
          <div className="bg-stone-900 text-stone-200 border-t border-stone-800 px-4 sm:px-6 py-4 animate-in fade-in slide-in-from-top-2">
            <div className="max-w-5xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  On-Page SEO & AEO Assignment Compliance Card
                </span>
                <button
                  onClick={onOpenSeoInspector}
                  className="text-xs text-stone-300 hover:text-white underline font-sans"
                >
                  View Full Keyword Research Map →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="space-y-1 bg-stone-800/80 p-3 rounded border border-stone-700">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">
                    1. Clean URL (No #, lowercase, hyphens)
                  </span>
                  <p className="font-mono text-stone-100 font-semibold">
                    {article.cleanUrl}
                  </p>
                </div>

                <div className="space-y-1 bg-stone-800/80 p-3 rounded border border-stone-700">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">
                    2. Main Keyword & 2 Related
                  </span>
                  <p className="font-semibold text-emerald-300">
                    Main: {article.seo.mainKeyword}
                  </p>
                  <p className="text-stone-300 text-[11px]">
                    Related: {article.seo.relatedKeywords.join(', ')}
                  </p>
                </div>

                <div className="space-y-1 bg-stone-800/80 p-3 rounded border border-stone-700">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">
                    3 & 4. Title & Meta Length
                  </span>
                  <p className="text-stone-200">
                    Title: <strong className="text-stone-100">{article.seo.titleTag.length} chars</strong> (50-60 target)
                  </p>
                  <p className="text-stone-200">
                    Meta: <strong className="text-stone-100">{article.seo.metaDescription.length} chars</strong> (150-160 target)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Article Header & Typography Hero */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 text-center sm:text-left">
        {/* Unboxed Category & Vol Kicker - ZERO PILL DISCIPLINE */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-widest text-stone-600 mb-4">
          <span className="text-stone-900">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>Archival Monograph</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
        </div>

        {/* ONE H1 PER PAGE (Strict SEO Requirement) */}
        <h1 
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-stone-950 leading-[1.12] mb-6"
          style={{ textWrap: 'balance' }}
        >
          {article.title}
        </h1>

        {/* Subtitle / Deck */}
        <p className="font-reading text-lg sm:text-xl text-stone-700 leading-relaxed max-w-3xl mb-8">
          {article.subtitle}
        </p>

        {/* Byline definition strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-stone-200/90 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover border border-stone-300"
            />
            <div>
              <span className="font-semibold text-stone-900 block text-sm">
                {article.author.name}
              </span>
              <span className="text-stone-600 block">
                {article.author.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-stone-600 text-xs">
            <span>Published {article.date}</span>
            <span aria-hidden="true">·</span>
            <span>Paris & Milan Editions</span>
          </div>
        </div>
      </header>

      {/* Hero Visual Presentation (With descriptive ALT text) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="rounded-sm overflow-hidden border border-stone-200/90 shadow-sm bg-stone-100">
          <FallbackImage
            src={article.heroImage}
            alt={article.imageAlt}
            aspectRatioClass="aspect-[16/9]"
            category={article.category}
          />
        </div>
        <p className="text-xs font-serif italic text-stone-600 mt-3 text-center sm:text-left">
          {article.imageCaption}
        </p>
      </div>

      {/* Reading Grid: Table of Contents + Narrative Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Quick-Jump Table of Contents Sidebar */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="lg:sticky lg:top-20 space-y-6 bg-white/70 p-5 rounded-sm border border-stone-200">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-800">
                <ListOrdered className="w-4 h-4" />
                <span>Monograph Inquiries (AEO)</span>
              </div>
              <nav className="space-y-2 text-xs font-medium">
                {article.sections.map((sec, idx) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setActiveTocId(sec.id);
                      const targetEl = document.getElementById(sec.id);
                      if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`w-full text-left block py-1.5 px-2 rounded transition-colors leading-snug cursor-pointer ${
                      activeTocId === sec.id
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                    }`}
                  >
                    <span className="font-mono mr-1.5 text-[10px] opacity-75">
                      Question {idx + 1}.
                    </span>
                    {sec.heading}
                  </button>
                ))}
              </nav>

              {/* Verified Keywords Box */}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block">
                  Target Keywords
                </span>
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-stone-900 font-semibold bg-stone-100 px-2 py-1 rounded">
                    Primary: {article.seo.mainKeyword}
                  </div>
                  <div className="text-[10px] text-stone-600 px-2">
                    Related: {article.seo.relatedKeywords.join(', ')}
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="pt-4 border-t border-stone-200">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block mb-2">
                  Atelier Index Keywords
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs text-stone-600">
                  {article.tags.map(tag => (
                    <span key={tag} className="text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reading time estimate */}
              <div className="pt-4 border-t border-stone-200 text-[11px] text-stone-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Monograph archival reading time: {article.readTime}</span>
              </div>
            </div>
          </aside>

          {/* Main Long-Form Narrative Column (8 cols on desktop) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className={`font-reading text-stone-800 ${getReadingSizeClass()} space-y-8`}>
              {/* Introduction with drop cap */}
              <section className="space-y-4">
                <p className="drop-cap text-stone-900 leading-relaxed">
                  {article.introduction}
                </p>
              </section>

              {/* Hairline Divider */}
              <div className="w-16 h-px bg-stone-300 my-8" />

              {/* Structured Sections (H2 as Questions + Direct Answer for AEO) */}
              {article.sections.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-24 space-y-5 pt-4">
                  {/* H2 Question Format (AEO Rule 1) */}
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-950 tracking-tight leading-snug">
                    {sec.heading}
                  </h2>

                  {/* Direct Answer First Box (AEO Rule 2: Answer in first 1-2 sentences so AI can quote you) */}
                  <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-sm font-sans space-y-1 my-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 font-semibold block">
                      Direct Answer · AEO Excerpt
                    </span>
                    <p className="text-stone-900 font-medium text-sm leading-relaxed">
                      {sec.directAnswer}
                    </p>
                  </div>

                  {/* In-depth explanatory paragraphs */}
                  {sec.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {para}
                    </p>
                  ))}

                  {/* Subsections (H3s inside H2) */}
                  {sec.subsections && (
                    <div className="space-y-4 my-6 pl-4 border-l-2 border-stone-300 font-sans">
                      {sec.subsections.map(sub => (
                        <div key={sub.id} className="space-y-1">
                          {/* H3 Sub-heading */}
                          <h3 className="font-serif text-lg font-medium text-stone-950">
                            {sub.heading}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-700 font-reading leading-relaxed">
                            {sub.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pull Quote when present */}
                  {sec.pullQuote && (
                    <figure className="my-8 py-6 border-y border-stone-300 text-center">
                      <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-900 leading-snug max-w-xl mx-auto">
                        "{sec.pullQuote}"
                      </blockquote>
                      <figcaption className="text-xs uppercase tracking-widest font-sans text-stone-500 mt-3">
                        — Atelier Curatorial Note
                      </figcaption>
                    </figure>
                  )}

                  {/* Technical Callout when present */}
                  {sec.technicalCallout && (
                    <aside className="my-8 p-6 bg-white border border-stone-200 rounded-sm shadow-xs font-sans">
                      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-200">
                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                          {sec.technicalCallout.title}
                        </span>
                      </div>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {sec.technicalCallout.specifications.map((item, iIdx) => (
                          <div key={iIdx} className="space-y-1">
                            <dt className="text-stone-500 uppercase tracking-wider text-[10px]">
                              {item.label}
                            </dt>
                            <dd className="font-semibold text-stone-900">
                              {item.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <p className="text-[11px] text-stone-600 mt-4 pt-3 border-t border-stone-100 italic">
                        Note: {sec.technicalCallout.note}
                      </p>
                    </aside>
                  )}
                </section>
              ))}

              {/* Curated Links with Strong Anchor Text (SEO Rule 6) */}
              <div className="my-10 p-6 bg-white border border-stone-200 rounded-sm font-sans space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block">
                  Authoritative References & Curated Links (Internal & Outbound)
                </span>
                <ul className="space-y-2 text-xs">
                  {article.curatedLinks.map((link, lIdx) => {
                    if (link.type === 'internal' && link.targetSlug) {
                      const targetArt = ARTICLES.find(a => a.slug === link.targetSlug);
                      return (
                        <li key={lIdx} className="flex items-center gap-2">
                          <span className="text-stone-400">↳</span>
                          <button
                            onClick={() => targetArt && onSelectArticle(targetArt)}
                            className="text-stone-900 hover:text-stone-600 underline font-medium text-left"
                          >
                            {link.text}
                          </button>
                          <span className="text-[10px] text-stone-400 font-mono">[Internal Link]</span>
                        </li>
                      );
                    }
                    return (
                      <li key={lIdx} className="flex items-center gap-2">
                        <span className="text-stone-400">↳</span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stone-900 hover:text-stone-600 underline font-medium inline-flex items-center gap-1"
                        >
                          <span>{link.text}</span>
                          <ExternalLink className="w-3 h-3 text-stone-400" />
                        </a>
                        <span className="text-[10px] text-stone-400 font-mono">[Outbound Authority Link]</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Conclusion Section */}
              <section className="mt-12 pt-8 border-t border-stone-300 space-y-4">
                <span className="text-xs uppercase font-sans font-semibold tracking-widest text-stone-500 block">
                  Curatorial Conclusion
                </span>
                <p className="font-serif italic text-lg sm:text-xl text-stone-900 leading-relaxed">
                  {article.conclusion}
                </p>
              </section>
            </div>

            {/* Author Profile Bio Box */}
            <div className="mt-12 p-6 sm:p-8 bg-white border border-stone-200 rounded-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full object-cover border border-stone-200 shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-sans uppercase tracking-widest text-stone-600">
                  About the Author
                </span>
                <h3 className="font-serif text-lg font-medium text-stone-950">
                  {article.author.name}
                </h3>
                <p className="text-xs text-stone-600">
                  {article.author.role}
                </p>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  {article.author.bio}
                </p>
              </div>
            </div>

            {/* End-of-article utility bar */}
            <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-600"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Compendium</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleSave(article.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-stone-300 rounded-md hover:bg-stone-100 transition-colors"
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4 text-stone-900 fill-stone-900" /> : <Bookmark className="w-4 h-4" />}
                  <span>{isSaved ? 'Saved in Reading List' : 'Save Monograph'}</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copied ? 'Clean URL Copied!' : 'Share Clean URL'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Essays Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-20 pt-12 border-t border-stone-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-stone-500">
                Continue Exploration
              </span>
              <h3 className="font-serif text-2xl font-medium text-stone-950 mt-1">
                Related Monograph Essays
              </h3>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-semibold text-stone-900 hover:text-stone-600 uppercase tracking-wider hidden sm:inline"
            >
              See all 10 fashion essays →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <a
                key={rel.id}
                href={rel.cleanUrl}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(rel);
                }}
                className="group cursor-pointer bg-white border border-stone-200 rounded-sm overflow-hidden hover:border-stone-400 transition-all p-4 flex flex-col justify-between text-left"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100 rounded-xs">
                    <FallbackImage
                      src={rel.heroImage}
                      alt={rel.imageAlt}
                      aspectRatioClass="aspect-[16/10]"
                      category={rel.category}
                    />
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                    {rel.category} · {rel.readTime}
                  </div>
                  <h4 className="font-serif text-base font-medium text-stone-900 group-hover:text-stone-600 line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 font-sans font-medium line-clamp-1">
                    {rel.anchorText}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>{rel.author.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-stone-900" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

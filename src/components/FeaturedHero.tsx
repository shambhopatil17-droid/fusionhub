import React from 'react';
import { Article } from '../data/articles';
import { FallbackImage } from './FallbackImage';
import { ArrowRight, Bookmark, BookmarkCheck, Clock } from 'lucide-react';

interface FeaturedHeroProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isSaved: boolean;
  onToggleSave: (articleId: string) => void;
  onOpenKeywordMap: () => void;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({
  article,
  onSelectArticle,
  isSaved,
  onToggleSave,
  onOpenKeywordMap,
}) => {
  return (
    <section className="relative border-b border-stone-200/90 bg-[#faf8f5]">
      {/* Institutional Issue Header Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-wrap items-center justify-between text-xs font-sans tracking-widest text-stone-600 uppercase border-b border-stone-300 pb-3 gap-2">
          <span>VOL. XIV · SPRING COMPENDIUM · THE ARCHITECTURE OF CLOTH</span>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenKeywordMap}
              className="text-stone-700 hover:text-stone-950 underline font-mono lowercase tracking-normal"
            >
              [view part a: keyword research table]
            </button>
            <span className="hidden sm:inline">PARIS · MILAN · TOKYO · LONDON</span>
          </div>
          <span>EST. 2026</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Main Visual Column (7 cols on desktop) */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
            <div 
              onClick={() => onSelectArticle(article)}
              className="cursor-pointer group relative overflow-hidden rounded-sm shadow-xs border border-stone-300/80 bg-stone-100"
            >
              <FallbackImage
                src={article.heroImage}
                alt={article.imageAlt}
                aspectRatioClass="aspect-[16/10] sm:aspect-[16/9]"
                category={article.category}
              />
              <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-300" />
            </div>
            <p className="text-xs font-serif italic text-stone-600 mt-2 text-right">
              {article.imageCaption}
            </p>
          </div>

          {/* Lead Editorial Narrative Column (5 cols on desktop) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Unboxed category & issue kicker - ZERO PILL DISCIPLINE */}
              <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-stone-600">
                <span className="text-stone-900 font-semibold">{article.category}</span>
                <span aria-hidden="true">·</span>
                <span>Lead Investigation</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              {/* Dominant Headline */}
              <h2
                onClick={() => onSelectArticle(article)}
                className="font-serif text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-medium tracking-tight text-stone-950 leading-[1.15] cursor-pointer hover:text-stone-700 transition-colors"
                style={{ textWrap: 'balance' }}
              >
                {article.title}
              </h2>

              {/* Subtitle / Deck */}
              <p className="text-base sm:text-lg text-stone-700 font-reading leading-relaxed">
                {article.subtitle}
              </p>

              {/* AEO Question Answered Preview */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-sm text-xs font-sans space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 font-semibold block">
                  AEO Inquired Question
                </span>
                <p className="font-serif text-stone-900 italic font-medium">
                  "{article.seo.questionItAnswers}"
                </p>
              </div>

              {/* Excerpt */}
              <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
                {article.introduction}
              </p>
            </div>

            {/* Author Byline & Actions */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={article.author.avatar}
                    alt={`Curator portrait of ${article.author.name}`}
                    className="w-10 h-10 rounded-full object-cover border border-stone-300"
                  />
                  <div>
                    <h3 className="text-xs font-semibold text-stone-900 font-sans">
                      {article.author.name}
                    </h3>
                    <p className="text-[11px] text-stone-600">
                      {article.author.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleSave(article.id)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors"
                    title={isSaved ? "Remove from Reading List" : "Save to Reading List"}
                    aria-label="Save article to reading list"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-stone-900 fill-stone-900" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Read CTA with Strong Anchor Text */}
              <button
                onClick={() => onSelectArticle(article)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-950 hover:bg-stone-800 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors group shadow-xs"
              >
                <span>Read Silk Gazar Architecture Investigation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

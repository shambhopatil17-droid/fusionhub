import React from 'react';
import { Article } from '../data/articles';
import { FallbackImage } from './FallbackImage';
import { Bookmark, BookmarkCheck, Clock, ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isSaved: boolean;
  onToggleSave: (articleId: string) => void;
  index: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  isSaved,
  onToggleSave,
  index,
}) => {
  return (
    <article className="group flex flex-col justify-between h-full bg-white border border-stone-200/90 rounded-sm overflow-hidden hover:border-stone-400/80 transition-all duration-300 hover:shadow-sm">
      {/* Visual Plate with Descriptive Alt Text */}
      <div 
        onClick={() => onSelectArticle(article)}
        className="cursor-pointer relative overflow-hidden bg-stone-100"
      >
        <FallbackImage
          src={article.heroImage}
          alt={article.imageAlt}
          aspectRatioClass="aspect-[16/10]"
          category={article.category}
        />
        
        {/* Subtle Index Watermark/Plate index */}
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-stone-100 text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-xs">
          PLATE {String(index + 1).padStart(2, '0')}
        </div>

        {/* Quick Bookmark Float */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(article.id);
          }}
          className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 rounded-full shadow-xs transition-colors"
          title={isSaved ? "Remove from saved reading list" : "Save article to reading list"}
          aria-label={isSaved ? "Remove from saved reading list" : "Save article to reading list"}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-stone-900 fill-stone-900" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Metadata Row - ZERO PILL DISCIPLINE */}
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase text-stone-600">
            <span className="text-stone-900 font-semibold">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          {/* Title */}
          <h2
            onClick={() => onSelectArticle(article)}
            className="font-serif text-xl sm:text-2xl font-medium text-stone-950 group-hover:text-stone-700 transition-colors leading-snug cursor-pointer line-clamp-2"
          >
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className="text-stone-600 text-xs sm:text-sm font-reading leading-relaxed line-clamp-3">
            {article.subtitle}
          </p>

          {/* Target AEO Question Preview */}
          <div className="text-[11px] text-stone-700 font-sans italic bg-stone-50 p-2 rounded border border-stone-100">
            Q: {article.seo.questionItAnswers}
          </div>
        </div>

        {/* Card Footer: Author and Descriptive Anchor Link */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={article.author.avatar}
              alt={`Curator portrait of ${article.author.name}`}
              className="w-7 h-7 rounded-full object-cover border border-stone-200"
            />
            <div className="text-[11px] leading-tight">
              <span className="font-medium text-stone-900 block truncate max-w-[120px]">
                {article.author.name}
              </span>
              <span className="text-stone-600 font-sans block">
                {article.date}
              </span>
            </div>
          </div>

          {/* Descriptive anchor text instead of generic 'read more' */}
          <button
            onClick={() => onSelectArticle(article)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-stone-600 transition-colors uppercase tracking-wider"
            aria-label={`Read ${article.title} full monograph`}
          >
            <span>Read Essay</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

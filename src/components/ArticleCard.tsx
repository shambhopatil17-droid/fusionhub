import React from 'react';
import { Article } from '../data/articles';
import { FallbackImage } from './FallbackImage';
import { Bookmark, BookmarkCheck, Clock, ArrowUpRight, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

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
      {/* Visual Plate with Descriptive Alt Text & Small Image Size Badge */}
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

        {/* Small Image Size Indicator (<100KB verified) */}
        <div className="absolute bottom-3 left-3 bg-stone-950/75 backdrop-blur-xs text-stone-200 text-[10px] font-mono px-2 py-0.5 rounded-xs flex items-center gap-1">
          <ImageIcon className="w-3 h-3 text-emerald-400" />
          <span>{article.imageFileSize} (&lt;100KB)</span>
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
          {/* Metadata Row: Category & Unique Small Clean URL */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium tracking-wider uppercase text-stone-600">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-900 font-semibold">{article.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
            
            {/* Small Unique URL badge */}
            <span className="font-mono text-[10px] text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 lowercase tracking-normal flex items-center gap-1">
              <LinkIcon className="w-2.5 h-2.5 text-stone-500" />
              {article.cleanUrl}
            </span>
          </div>

          {/* Title with Anchor Link */}
          <h2
            onClick={() => onSelectArticle(article)}
            className="font-serif text-xl sm:text-2xl font-medium text-stone-950 group-hover:text-stone-700 transition-colors leading-snug cursor-pointer line-clamp-2"
          >
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className="text-stone-600 text-xs sm:text-sm font-reading leading-relaxed line-clamp-2">
            {article.subtitle}
          </p>

          {/* Target AEO Question Preview */}
          <div className="text-[11px] text-stone-700 font-sans italic bg-stone-50 p-2 rounded border border-stone-100">
            Q: {article.seo.questionItAnswers}
          </div>
        </div>

        {/* Card Footer: Author and Explicit Anchor Text Link */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={`Curator portrait of ${article.author.name}`}
              className="w-7 h-7 rounded-full object-cover border border-stone-200 shrink-0"
            />
            <div className="text-[11px] leading-tight">
              <span className="font-medium text-stone-900 block truncate max-w-[130px]">
                {article.author.name}
              </span>
              <span className="text-stone-600 font-sans block text-[10px]">
                {article.date}
              </span>
            </div>
          </div>

          {/* Explicit Descriptive Anchor Text Button (Mandatory SEO Link & Anchor Rule) */}
          <a
            href={article.cleanUrl}
            onClick={(e) => {
              e.preventDefault();
              onSelectArticle(article);
            }}
            className="inline-flex items-center justify-between gap-1 text-xs font-semibold text-stone-950 hover:text-stone-600 transition-colors bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded text-left"
            aria-label={article.anchorText}
            title={article.anchorText}
          >
            <span className="line-clamp-1">{article.anchorText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
};

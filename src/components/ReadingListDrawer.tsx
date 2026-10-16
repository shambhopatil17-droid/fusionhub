import React from 'react';
import { Article, ARTICLES } from '../data/articles';
import { X, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { FallbackImage } from './FallbackImage';

interface ReadingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectArticle: (article: Article) => void;
}

export const ReadingListDrawer: React.FC<ReadingListDrawerProps> = ({
  isOpen,
  onClose,
  savedIds,
  onToggleSave,
  onSelectArticle,
}) => {
  if (!isOpen) return null;

  const savedArticles = ARTICLES.filter(a => savedIds.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="relative w-full max-w-md bg-[#faf8f5] shadow-2xl h-full flex flex-col z-10 border-l border-stone-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-sans font-semibold text-stone-500">
              Personal Archive
            </span>
            <h2 className="font-serif text-xl font-medium text-stone-900">
              Reading List ({savedArticles.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md"
            aria-label="Close reading list"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="font-serif text-stone-700 text-lg">
                Your reading list is empty.
              </p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Bookmark essays from the compendium to curate your personalized fashion design research library.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="group p-4 bg-white border border-stone-200 rounded-sm hover:border-stone-300 transition-all flex gap-4 items-start"
              >
                <div 
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="w-20 h-20 shrink-0 cursor-pointer overflow-hidden rounded-xs bg-stone-100"
                >
                  <FallbackImage
                    src={article.heroImage}
                    alt={article.title}
                    aspectRatioClass="aspect-square"
                    category={article.category}
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider block">
                    {article.category} · {article.readTime}
                  </span>
                  <h3
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="font-serif text-sm font-medium text-stone-900 group-hover:text-stone-600 cursor-pointer line-clamp-2 leading-snug"
                  >
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                      className="text-xs font-semibold text-stone-900 hover:text-stone-600 inline-flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onToggleSave(article.id)}
                      className="text-stone-400 hover:text-rose-700 p-1 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedArticles.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white">
            <button
              onClick={() => {
                onSelectArticle(savedArticles[0]);
                onClose();
              }}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
            >
              Begin Reading First Article
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

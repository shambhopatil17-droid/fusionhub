import React from 'react';
import { CATEGORIES } from '../data/articles';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onNavigateHome: () => void;
  onOpenSubscribe: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateHome,
  onOpenSubscribe,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-stone-800">
          {/* Brand & Editorial Charter (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={onNavigateHome}
              className="text-3xl font-serif tracking-tight text-stone-100 hover:text-stone-300 transition-colors text-left"
            >
              ÉTOFFE
            </button>
            <p className="text-xs uppercase tracking-widest text-stone-400 font-sans">
              Journal of Contemporary Fashion Design & Pattern Architecture
            </p>
            <p className="text-sm text-stone-400 font-reading leading-relaxed max-w-sm">
              Dedicated to rigorous analysis of garment construction, bias-grain physics, historical understructures, sustainable zero-waste cutting, and bio-fabricated textiles.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenSubscribe}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-900 bg-stone-100 hover:bg-white rounded-md transition-colors"
              >
                Subscribe to The Dispatch
              </button>
            </div>
          </div>

          {/* Disciplines Column (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase font-sans font-semibold tracking-widest text-stone-400">
              Research Disciplines
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      scrollToTop();
                    }}
                    className="text-stone-400 hover:text-stone-100 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial Masthead & Colophon (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs text-stone-400">
            <h4 className="uppercase font-sans font-semibold tracking-widest text-stone-400">
              Atelier Masthead
            </h4>
            <p className="leading-relaxed">
              Published quarterly in Paris, Milan, London, and Tokyo. Printed on archival FSC-certified cotton paper and published digitally under open curatorial review.
            </p>
            <div className="pt-2 space-y-1 text-[11px] text-stone-500 font-mono">
              <p>ISSN 2814-9920</p>
              <p>Vol. XIV · Spring Edition</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 ÉTOFFE Journal. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Independent Fashion Design Scholarship</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors uppercase tracking-wider"
          >
            <span>Top of Compendium</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

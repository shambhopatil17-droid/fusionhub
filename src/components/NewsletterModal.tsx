import React, { useState } from 'react';
import { X, CheckCircle2, Mail, Sparkles } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [discipline, setDiscipline] = useState('All Topics');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-sm border border-stone-300 shadow-2xl p-6 sm:p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-stone-900 rounded-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-stone-900">
              Welcome to The Atelier Dispatch
            </h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
              We have inscribed <strong className="text-stone-900">{email}</strong> into our archival correspondence roll. You will receive our monthly monograph review covering cutting-edge haute couture construction, bio-fabrics, and patternmaking.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                  onClose();
                }}
                className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-stone-800 transition-colors"
              >
                Return to Compendium
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs uppercase font-sans font-semibold tracking-widest text-stone-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Monthly Atelier Dispatches</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-950">
                The Atelier Dispatch
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-reading leading-relaxed">
                A curatorial digest dispatched twice monthly to 34,000 couturiers, patternmakers, materials scientists, and fashion historians worldwide. No promotional spam, ever.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="couturier@atelier.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-md text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Primary Research Discipline
                </label>
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-white border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                >
                  <option value="All Topics">All Fashion Design Topics</option>
                  <option value="Haute Couture Architecture">Haute Couture Architecture</option>
                  <option value="Patternmaking & Cut">Zero-Waste & Pattern Drafting</option>
                  <option value="Textile Science & Bio-Fabrics">Textile Science & Bio-Fabrics</option>
                  <option value="Avant-Garde & Theory">Avant-Garde & Fashion Theory</option>
                  <option value="Bespoke Tailoring">Bespoke Tailoring & Menswear</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-xs"
                >
                  Inscribe into the Dispatch
                </button>
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                Strict privacy protocol. Unsubscribe at any time with one click.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

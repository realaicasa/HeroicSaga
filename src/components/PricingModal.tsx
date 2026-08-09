import React from 'react';
import { X, Check, ShieldCheck, Crown, Sparkles, Zap, Award } from 'lucide-react';
import { PRICING_TIERS } from '../data/mockTemplates';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTier: (tierId: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectTier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Limited Lifetime Access Offer (~80% Off)
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 font-serif">
            Publish KDP Bestsellers at Scale
          </h2>
          <p className="text-slate-400 text-sm">
            Unlock complete 100% commercial ownership, multi-engine continuity tracking, EPUB/DOCX exports, and automated Author Launch Kits.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {PRICING_TIERS.map((tier) => {
            const isPopular = tier.id === 'pro';
            return (
              <div
                key={tier.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full tracking-wider uppercase shadow-md">
                    Most Popular for Authors
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 font-serif">{tier.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-100">MX${tier.priceMXN.toLocaleString()}</span>
                      <span className="text-xs text-slate-400">/ ~${tier.approxUSD} USD</span>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 font-semibold block mt-0.5">
                      {tier.creditsMonthly.toLocaleString()} Monthly Credits
                    </span>
                  </div>

                  <ul className="space-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-slate-800/60 mt-4 space-y-2">
                  <button
                    onClick={() => {
                      onSelectTier(tier.id);
                      onClose();
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                      isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
                    }`}
                  >
                    Select {tier.name} Plan
                  </button>
                  <p className="text-[10px] text-center text-slate-500">Instant Access • One-time or Monthly</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block">30-Day Money-Back Guarantee</span>
              <span>Backed by Paddle as Merchant of Record with automated Content Rights Certificates.</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[11px] text-indigo-300">
            <Award className="w-4 h-4 text-amber-400" /> 100% Commercial Ownership
          </div>
        </div>
      </div>
    </div>
  );
};

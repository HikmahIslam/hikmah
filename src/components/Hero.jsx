import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Headset } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-brand-emerald-800 to-brand-emerald-950 text-white rounded-3xl p-5 sm:p-8 md:p-12 overflow-hidden shadow-lg border border-brand-emerald-900/50">
      
      {/* Decorative crescent moon / arch pattern in BG */}
      <div className="absolute right-0 bottom-0 top-0 opacity-10 sm:opacity-20 flex items-center justify-end select-none pointer-events-none p-4 max-w-xs overflow-hidden">
        <svg viewBox="0 0 100 100" className="h-full w-auto text-brand-gold-500 fill-current">
          <path d="M50 0a50 50 0 000 100 40 40 0 110-80 50 50 0 000-20z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-emerald-500/20 border border-brand-emerald-500/35 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider text-brand-gold-400">
          ✨ Spiritual Reflection Companion
        </div>
        
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
          Find Peace and Clarity in <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-400 to-amber-300">
            The Holy Qur'an
          </span>
        </h1>
        
        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-brand-emerald-100 font-light max-w-lg">
          "Verily, this Qur'an guides to that which is most suitable and gives good tidings to the believers who do righteous deeds..."
          <span className="block mt-1 font-semibold text-brand-gold-400/80 text-[11px] sm:text-xs">— Surah Al-Isra (17:9)</span>
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2 w-full sm:w-auto">
          <Link
            to="/quran"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-gold-500 text-slate-900 font-bold hover:bg-brand-gold-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-gold-500/10 text-sm min-h-[44px] w-full sm:w-auto"
          >
            <BookOpen className="w-4.5 h-4.5" />
            Read Qur'an
          </Link>
          <Link
            to="/quran"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] text-sm min-h-[44px] w-full sm:w-auto"
          >
            <Headset className="w-4.5 h-4.5 text-brand-gold-400" />
            Listen Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Headset, Compass } from 'lucide-react';
import HikmahIcon from './HikmahIcon';

export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 md:p-14 overflow-hidden shadow-2xl shadow-emerald-950/40 border border-amber-500/25">
      
      {/* Ambient Radial Golden & Emerald Aura Glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Geometric Islamic Pattern & Mihrab Arch Vector Overlay */}
      <div className="absolute right-0 bottom-0 top-0 w-full sm:w-1/2 opacity-15 sm:opacity-25 flex items-center justify-end select-none pointer-events-none overflow-hidden p-4">
        <svg viewBox="0 0 200 200" className="h-full w-auto text-amber-400 fill-current">
          <defs>
            <pattern id="islamicGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="5" y="5" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
              <rect x="5" y="5" width="30" height="30" rx="4" transform="rotate(45 20 20)" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
              <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.3" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#islamicGrid)" />
          {/* Mihrab Arch Path Overlay */}
          <path d="M 50 190 V 90 C 50 40, 100 15, 100 15 C 100 15, 150 40, 150 90 V 190 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.6" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl space-y-5 sm:space-y-6">
        
        {/* Calligraphic Spiritual Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-900/60 border border-amber-400/35 rounded-full text-xs font-semibold tracking-wider text-amber-300 backdrop-blur-md shadow-inner">
          <HikmahIcon className="w-4 h-4 text-amber-300" />
          <span>Surah Al-Isra • 17:9</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="font-calligraphic font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.15]">
          Find Peace and Clarity in <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 drop-shadow-md">
            The Holy Qur'an
          </span>
        </h1>

        {/* Arabic Ayah Calligraphy & Translation */}
        <div className="space-y-2 pt-1 border-l-2 border-amber-500/40 pl-4 sm:pl-5">
          <p className="font-arabic text-xl sm:text-2xl text-amber-200/90 leading-relaxed font-semibold">
            إِنَّ هٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ
          </p>
          <p className="text-xs sm:text-sm md:text-base leading-relaxed text-emerald-100/90 font-light max-w-lg">
            "Verily, this Qur'an guides to that which is most upright and gives glad tidings to the believers..."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <Link
            to="/quran"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-300 hover:to-amber-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20 text-sm min-h-[46px]"
          >
            <BookOpen className="w-4.5 h-4.5 text-slate-950" />
            <span>Read Qur'an</span>
          </Link>

          <Link
            to="/quran"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/18 text-white border border-white/20 font-semibold backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] text-sm min-h-[46px]"
          >
            <Headset className="w-4.5 h-4.5 text-amber-300" />
            <span>Listen Recitations</span>
          </Link>

          <Link
            to="/qibla"
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-200 border border-emerald-500/30 font-medium backdrop-blur-md transition-all text-xs sm:text-sm min-h-[46px]"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Qibla Finder</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Hero;

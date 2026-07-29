import React from 'react';
import { Link } from 'react-router-dom';
import { Headset } from 'lucide-react';
import HikmahIcon from './HikmahIcon';
import QuranBookIcon from './QuranBookIcon';
import KaabaIcon from './KaabaIcon';
import { useSettings } from '../context/SettingsContext';

export const Hero = () => {
  const { t } = useSettings();

  return (
    <div className="relative bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 md:p-14 lg:p-16 overflow-hidden shadow-2xl shadow-emerald-900/40 border border-emerald-500/40">
      
      {/* Ambient Radial Golden & Lighter Emerald Aura Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Pure Code Vector Islamic Geometric Pattern & Dual Mihrab Arches */}
      <div className="absolute right-0 bottom-0 top-0 w-full sm:w-1/2 opacity-20 sm:opacity-30 flex items-center justify-end select-none pointer-events-none overflow-hidden p-2">
        <svg viewBox="0 0 300 300" className="h-full w-auto text-amber-400 fill-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heroGoldStroke" x1="0" y1="0" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            <pattern id="octagramPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="40" height="40" rx="6" stroke="url(#heroGoldStroke)" strokeWidth="1" strokeOpacity="0.4" fill="none" />
              <rect x="10" y="10" width="40" height="40" rx="6" transform="rotate(45 30 30)" stroke="url(#heroGoldStroke)" strokeWidth="1" strokeOpacity="0.4" fill="none" />
              <circle cx="30" cy="30" r="3" fill="#F59E0B" fillOpacity="0.5" />
            </pattern>
          </defs>

          <rect width="300" height="300" fill="url(#octagramPattern)" />

          <path
            d="M 60 290 V 140 C 60 70, 150 25, 150 25 C 150 25, 240 70, 240 140 V 290 Z"
            stroke="url(#heroGoldStroke)"
            strokeWidth="3"
            strokeOpacity="0.7"
            strokeLinejoin="round"
          />
          <path
            d="M 85 290 V 150 C 85 90, 150 50, 150 50 C 150 50, 215 90, 215 150 V 290 Z"
            stroke="url(#heroGoldStroke)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeOpacity="0.5"
          />

          <circle cx="150" cy="90" r="18" fill="#F59E0B" fillOpacity="0.15" />
          <path
            d="M 150 72 L 154 84 L 166 88 L 154 92 L 150 104 L 146 92 L 134 88 L 146 84 Z"
            fill="#FEF08A"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl space-y-6">
        
        {/* Calligraphic Spiritual Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-900/60 border border-amber-400/35 rounded-full text-xs font-semibold tracking-wider text-amber-300 backdrop-blur-md shadow-inner">
          <HikmahIcon className="w-4 h-4 text-amber-300" />
          <span className="font-calligraphic tracking-widest uppercase text-[11px]">Hikmah Sanctuary</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="font-calligraphic font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.12]">
          {t('heroTitle')} <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-md text-2xl sm:text-3xl md:text-4xl block mt-2 font-normal">
            {t('heroSubtitle')}
          </span>
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to="/quran"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-300 hover:to-amber-500 transition-all hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-amber-500/25 text-sm min-h-[46px]"
          >
            <QuranBookIcon className="w-5 h-5 text-slate-950" />
            <span>{t('readQuran')}</span>
          </Link>

          <Link
            to="/quran"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-900/40 hover:bg-emerald-800/60 text-white border border-emerald-400/30 font-semibold backdrop-blur-md transition-all hover:scale-[1.03] active:scale-[0.98] text-sm min-h-[46px]"
          >
            <Headset className="w-4.5 h-4.5 text-amber-300" />
            <span>{t('listenNow')}</span>
          </Link>

          <Link
            to="/qibla"
            className="inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-900/80 text-emerald-200 border border-emerald-500/30 font-medium backdrop-blur-md transition-all text-xs sm:text-sm min-h-[46px]"
          >
            <KaabaIcon className="w-5 h-5" />
            <span>{t('qiblaFinder')}</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Hero;

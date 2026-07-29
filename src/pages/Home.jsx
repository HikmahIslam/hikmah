import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import DailyAyah from '../components/DailyAyah';
import ContinueReading from '../components/ContinueReading';
import SurahCard from '../components/SurahCard';
import QuranRadioCard from '../components/QuranRadioCard';
import { BookOpen, Headphones, Compass, Heart, Flame, Sparkles, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const POPULAR_SURAHS = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatiha", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Meccan" },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'a", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" }
];

export const Home = () => {
  const { t } = useSettings();

  const quickAccessItems = [
    { name: t('readQuran'), path: "/quran", icon: BookOpen, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" },
    { name: t('listenNow'), path: "/quran", icon: Headphones, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400" },
    { name: t('qiblaFinder'), path: "/qibla", icon: Compass, color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" },
    { name: t('duasCollection'), path: "/duas", icon: Heart, color: "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" },
    { name: t('tasbeehDhikr'), path: "/dhikr", icon: Flame, color: "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      
      {/* Hero Banner */}
      <Hero />

      {/* Grid: Daily Ayah and Continue Reading */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2">
          <DailyAyah />
        </div>
        <div className="lg:col-span-1">
          <ContinueReading />
        </div>
      </div>

      {/* Quick Access section */}
      <div className="space-y-3.5 sm:space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 rtl:pr-1 rtl:pl-0">
          {t('quickAccess')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {quickAccessItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.path}
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3.5 group min-h-[100px]"
              >
                <div className={`p-2.5 sm:p-3 rounded-2xl ${item.color} group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-emerald-500 dark:group-hover:text-brand-emerald-400 transition-colors">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Asmaul Husna Banner Card under Quick Access */}
      <Link
        to="/asmaul-husna"
        className="block bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-emerald-900/20 border border-amber-400/40 hover:border-amber-400 transition-all duration-300 group hover:scale-[1.01]"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Arabic Emblem Badge */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400/15 border border-amber-400/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <span className="arabic-text font-bold text-xl sm:text-2xl text-amber-300">
                اللَّه
              </span>
            </div>
            {/* Title & Subtitle */}
            <div className="min-w-0 space-y-0.5">
              <h3 className="font-calligraphic font-bold text-lg sm:text-xl text-white group-hover:text-amber-300 transition-colors">
                {t('asmaulHusna')}
              </h3>
              <p className="text-xs text-emerald-100/75 truncate">
                {t('asmaulHusnaSub')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform flex-shrink-0">
            <Sparkles className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </div>
        </div>
      </Link>

      {/* Popular Surahs section */}
      <div className="space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900/60 pb-3 gap-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 rtl:pr-1 rtl:pl-0 truncate">
            {t('popularSurahs')}
          </h2>
          <Link
            to="/quran"
            className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 hover:underline flex-shrink-0"
          >
            {t('viewAll114')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {POPULAR_SURAHS.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      </div>

      {/* 24/7 Live Qur'an Radio Section (Bottom of Home) */}
      <div className="pt-2">
        <QuranRadioCard />
      </div>

    </div>
  );
};

export default Home;

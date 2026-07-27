import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import DailyAyah from '../components/DailyAyah';
import ContinueReading from '../components/ContinueReading';
import SurahCard from '../components/SurahCard';
import { BookOpen, Headphones, Bookmark, Heart, Flame, ShieldAlert, Award } from 'lucide-react';

const POPULAR_SURAHS = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatiha", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Meccan" },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'a", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" }
];

export const Home = () => {
  const quickAccessItems = [
    { name: "Read Qur'an", path: "/quran", icon: BookOpen, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" },
    { name: "Listen Now", path: "/quran", icon: Headphones, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400" },
    { name: "Bookmarks", path: "/bookmarks", icon: Bookmark, color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" },
    { name: "Duas Collection", path: "/duas", icon: Heart, color: "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" },
    { name: "Tasbeeh / Dhikr", path: "/dhikr", icon: Flame, color: "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400" },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Hero Banner */}
      <Hero />

      {/* Grid: Daily Ayah and Continue Reading */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyAyah />
        </div>
        <div className="lg:col-span-1">
          <ContinueReading />
        </div>
      </div>

      {/* Quick Access section */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickAccessItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.path}
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center gap-3.5 group"
              >
                <div className={`p-3 rounded-2xl ${item.color} group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-emerald-500 dark:group-hover:text-brand-emerald-400 transition-colors">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Popular Surahs section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900/60 pb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
            Popular Surahs
          </h2>
          <Link
            to="/quran"
            className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 hover:underline"
          >
            View All 114 Surahs →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POPULAR_SURAHS.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;

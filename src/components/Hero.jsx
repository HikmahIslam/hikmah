import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ArrowRight, 
  Compass, 
  Clock, 
  HeartHandshake, 
  Bot, 
  BookMarked
} from 'lucide-react';
import HikmahIcon from './HikmahIcon';

export const Hero = () => {
  // Quick feature mini cards (Emerald & Gold logo theme)
  const quickFeatures = [
    { name: "Quran", icon: BookOpen, path: "/quran", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" },
    { name: "Duas", icon: HeartHandshake, path: "/duas", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" },
    { name: "Qibla", icon: Compass, path: "/qibla", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" },
    { name: "Hikmah AI", icon: Bot, path: "/quran", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FCFBF8] dark:bg-slate-950 text-[#111827] dark:text-slate-100 rounded-3xl p-6 sm:p-10 md:p-14 lg:p-16 border border-slate-200/70 dark:border-slate-800/80 shadow-xs">
      
      {/* Soft Ambient Radial Logo Lighting (Emerald & Gold) */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
        
        {/* LEFT COLUMN (Content) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-7 space-y-6 sm:space-y-7"
        >
          {/* Glassmorphism Logo Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
            <HikmahIcon className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-xs text-[#059669] dark:text-emerald-400">Hikmah</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">Digital Islamic Companion</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#111827] dark:text-white tracking-tight leading-[1.08]">
            Read. Learn. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Live Islam.
            </span>
          </h1>

          {/* Minimal Subtitle */}
          <p className="max-w-[500px] text-base sm:text-lg text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">
            Read the Holy Quran, listen to recitations, find Qibla direction, and explore daily duas in one peaceful companion.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/quran"
              className="group inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-900/15 hover:shadow-lg hover:shadow-emerald-900/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 min-h-[46px]"
            >
              <span>Read Quran</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              to="/quran"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-[#111827] dark:text-slate-200 font-semibold text-sm hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:-translate-y-0.5 shadow-xs min-h-[46px]"
            >
              <span>Explore Features</span>
            </Link>
          </div>

          {/* Quick Access Mini Cards */}
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {quickFeatures.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <Link
                    key={feat.name}
                    to={feat.path}
                    className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 shadow-xs hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    <div className={`p-1.5 rounded-xl ${feat.color} transition-transform group-hover:scale-105`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-[#111827] dark:text-slate-200 truncate">
                      {feat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>


        {/* RIGHT COLUMN (Minimal Logo Glass Emblem & Floating Cards) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-5 mt-10 lg:mt-0 relative flex items-center justify-center min-h-[340px] sm:min-h-[400px]"
        >
          {/* Central Logo Shield Glass Emblem */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900/90 to-emerald-900/80 border border-amber-400/30 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-950 border border-amber-300/40 p-2.5 flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform duration-300">
              <HikmahIcon className="w-full h-full text-amber-300" />
            </div>
            <span className="font-calligraphic font-bold text-xl sm:text-2xl mt-4 tracking-[0.14em] bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
              HIKMAH
            </span>
            <span className="text-[10px] text-emerald-300/80 font-medium tracking-widest uppercase mt-1">
              Spiritual Companion
            </span>
          </div>

          {/* FLOATING GLASS CARDS (Logo Palette Theme) */}
          
          {/* Card 1: Prayer Times (Top Left) */}
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-2 -left-2 sm:-left-6 p-3 rounded-[18px] bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-lg shadow-emerald-950/5 flex items-center gap-2.5 z-20"
          >
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider font-semibold text-[#6B7280] dark:text-slate-500">Prayer</p>
              <p className="text-xs font-bold text-[#111827] dark:text-white">Fajr 05:12 AM</p>
            </div>
          </motion.div>

          {/* Card 2: Qibla Direction (Top Right) */}
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-8 -right-2 sm:-right-4 p-3 rounded-[18px] bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-lg shadow-emerald-950/5 flex items-center gap-2.5 z-20"
          >
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider font-semibold text-[#6B7280] dark:text-slate-500">Qibla</p>
              <p className="text-xs font-bold text-[#111827] dark:text-white">294° NW</p>
            </div>
          </motion.div>

          {/* Card 3: Continue Reading (Bottom Left) */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute bottom-4 -left-2 sm:-left-4 p-3 rounded-[18px] bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-lg shadow-emerald-950/5 flex items-center gap-2.5 z-20"
          >
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <BookMarked className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider font-semibold text-[#6B7280] dark:text-slate-500">Surah</p>
              <p className="text-xs font-bold text-[#111827] dark:text-white">Al-Mulk v.1</p>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;

import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Sun, Moon, Type, Volume2, Globe, RotateCcw } from 'lucide-react';

const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahmaan As-Sudais' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify' },
  { id: 'ar.shaatree', name: 'Abu Bakr Al-Shatri' },
  { id: 'ar.gghamidi', name: 'Saad Al-Ghamdi' }
];

export const Settings = () => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400">
          <SettingsIcon className="w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl tracking-wide text-slate-800 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Customize your reading, listening, and visual experience</p>
        </div>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Appearance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3.5 mb-5">
            <Sun className="w-5 h-5 text-brand-gold-600 dark:text-brand-gold-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Theme Mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark modes</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-purple-400 fill-purple-400" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-brand-gold-500 fill-brand-gold-500" />
                  Light Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3.5 mb-6">
            <Type className="w-5 h-5 text-brand-emerald-600 dark:text-brand-emerald-400" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Typography</h2>
          </div>
          
          <div className="space-y-6">
            {/* Arabic Font Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-800 dark:text-slate-200">Arabic Font Size</label>
                <span className="font-mono font-medium text-brand-emerald-600 dark:text-brand-emerald-400">{settings.arabicFontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="48"
                step="2"
                value={settings.arabicFontSize}
                onChange={(e) => updateSetting('arabicFontSize', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg accent-brand-emerald-500 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              />
              <div className="border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 mt-2 bg-slate-50/50 dark:bg-slate-950/20 text-center">
                <p className="arabic-text text-slate-900 dark:text-white" style={{ fontSize: `${settings.arabicFontSize}px` }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            </div>

            {/* Translation Font Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-800 dark:text-slate-200">Translation Font Size</label>
                <span className="font-mono font-medium text-brand-emerald-600 dark:text-brand-emerald-400">{settings.translationFontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={settings.translationFontSize}
                onChange={(e) => updateSetting('translationFontSize', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg accent-brand-emerald-500 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              />
              <div className="border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 mt-2 bg-slate-50/50 dark:bg-slate-950/20">
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed" style={{ fontSize: `${settings.translationFontSize}px` }}>
                  In the name of Allah, the Entirely Merciful, the Especially Merciful.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Translation & Audio Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Language */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <Globe className="w-5 h-5 text-brand-emerald-600 dark:text-brand-emerald-400" />
                <label className="text-sm font-bold">Default Translation</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateSetting('defaultLanguage', 'en')}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    settings.defaultLanguage === 'en'
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/30 text-brand-emerald-600 dark:bg-brand-emerald-950/20 dark:text-brand-emerald-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => updateSetting('defaultLanguage', 'ml')}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    settings.defaultLanguage === 'ml'
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/30 text-brand-emerald-600 dark:bg-brand-emerald-950/20 dark:text-brand-emerald-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  മലയാളം
                </button>
                <button
                  onClick={() => updateSetting('defaultLanguage', 'both')}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    settings.defaultLanguage === 'both'
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/30 text-brand-emerald-600 dark:bg-brand-emerald-950/20 dark:text-brand-emerald-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            {/* Reciter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <Volume2 className="w-5 h-5 text-brand-emerald-600 dark:text-brand-emerald-400" />
                <label className="text-sm font-bold">Default Reciter</label>
              </div>
              <select
                value={settings.defaultReciter}
                onChange={(e) => updateSetting('defaultReciter', e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-emerald-500 focus:outline-none transition-all"
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Audio Playback Mode */}
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-5 space-y-3">
            <label className="text-sm font-bold text-slate-800 dark:text-white block">Audio Playback Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'arabic', label: 'Arabic Recitation Only', desc: 'Plays traditional Arabic audio reciters' },
                { id: 'translation', label: 'Translation Audio Only', desc: 'Speaks English / Malayalam translation' },
                { id: 'both', label: 'Arabic + Translation', desc: 'Plays Arabic verse then speaks translation' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => updateSetting('audioMode', mode.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    (settings.audioMode || 'arabic') === mode.id
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/30 dark:bg-brand-emerald-950/20 text-brand-emerald-600 dark:text-brand-emerald-400 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <p className="text-xs font-bold">{mode.label}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Reset Settings Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={resetSettings}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/15 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;

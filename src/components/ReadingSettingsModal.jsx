import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, Type, Layers, Eye, Compass, RotateCcw } from 'lucide-react';

export const ReadingSettingsModal = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings } = useSettings();

  if (!isOpen) return null;

  const fontPresets = [
    { label: 'Small', value: 24 },
    { label: 'Medium', value: 32 },
    { label: 'Large', value: 40 },
    { label: 'XL', value: 48 },
  ];

  const translationFontPresets = [
    { label: 'Small', value: 14 },
    { label: 'Medium', value: 16 },
    { label: 'Large', value: 18 },
  ];

  const lineHeightOptions = [
    { label: 'Compact', value: 'compact' },
    { label: 'Comfortable', value: 'comfortable' },
    { label: 'Spacious', value: 'spacious' },
  ];

  const translationModes = [
    { label: 'English', value: 'en' },
    { label: 'Malayalam', value: 'ml' },
    { label: 'Both', value: 'both' },
    { label: 'None', value: 'none' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4 transition-all duration-300">
      {/* Backdrop overlay click */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet / Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400">
              <Type className="w-4 h-4" />
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-800 dark:text-white">
              Reading Settings
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close reading settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Arabic Text Size */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-brand-emerald-500" />
              Arabic Font Size
            </span>
            <span className="font-mono text-brand-emerald-600 dark:text-brand-emerald-400 font-bold">
              {settings.arabicFontSize}px
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {fontPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => updateSetting('arabicFontSize', preset.value)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all min-h-[40px] ${
                  settings.arabicFontSize === preset.value
                    ? 'bg-brand-emerald-500 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="22"
            max="52"
            step="2"
            value={settings.arabicFontSize}
            onChange={(e) => updateSetting('arabicFontSize', parseInt(e.target.value, 10))}
            className="w-full h-1.5 rounded-lg accent-brand-emerald-500 bg-slate-200 dark:bg-slate-800 cursor-pointer"
            aria-label="Arabic font size slider"
          />
        </div>

        {/* 2. Translation Font Size */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-brand-emerald-500" />
              Translation Font Size
            </span>
            <span className="font-mono text-brand-emerald-600 dark:text-brand-emerald-400 font-bold">
              {settings.translationFontSize}px
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {translationFontPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => updateSetting('translationFontSize', preset.value)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all min-h-[40px] ${
                  settings.translationFontSize === preset.value
                    ? 'bg-brand-emerald-500 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="12"
            max="24"
            step="1"
            value={settings.translationFontSize}
            onChange={(e) => updateSetting('translationFontSize', parseInt(e.target.value, 10))}
            className="w-full h-1.5 rounded-lg accent-brand-emerald-500 bg-slate-200 dark:bg-slate-800 cursor-pointer"
            aria-label="Translation font size slider"
          />
        </div>

        {/* 3. Line Height */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-emerald-500" />
            Line Spacing
          </div>

          <div className="grid grid-cols-3 gap-2">
            {lineHeightOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateSetting('lineHeight', opt.value)}
                className={`py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[40px] ${
                  settings.lineHeight === opt.value
                    ? 'bg-brand-emerald-500 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Translation Language Mode */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-brand-emerald-500" />
            Translation Language
          </div>

          <div className="grid grid-cols-4 gap-2">
            {translationModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => updateSetting('defaultLanguage', mode.value)}
                className={`py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[40px] ${
                  settings.defaultLanguage === mode.value
                    ? 'bg-brand-emerald-500 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Preferences */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <button
            onClick={resetSettings}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-brand-emerald-500 text-white text-xs font-bold hover:bg-brand-emerald-600 transition-all min-h-[44px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingSettingsModal;

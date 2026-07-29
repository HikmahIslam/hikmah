import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../utils/translations';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  appLanguage: 'en', // 'en', 'ar', or 'ml'
  arabicFontSize: 32, // in px
  translationFontSize: 16, // in px
  defaultLanguage: 'en', // 'en' or 'ml'
  defaultReciter: 'ar.alafasy', // Alafasy
  audioPlaybackMode: 'ayah', // 'ayah' or 'continuous'
  viewMode: 'continuous', // 'continuous' (full text) or 'card' (verse-by-verse)
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('hikmah-settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('hikmah-settings', JSON.stringify(settings));

    // Update document dir and lang attributes for full accessibility & RTL support
    const lang = settings.appLanguage || 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Translation helper
  const t = (key) => {
    const lang = settings.appLanguage || 'en';
    const langDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

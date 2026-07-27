import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getSurahDetails } from '../services/quranApi';
import SurahHeader from '../components/SurahHeader';
import ReadingControls from '../components/ReadingControls';
import ReadingSettingsModal from '../components/ReadingSettingsModal';
import Bismillah from '../components/Bismillah';
import AyahCard from '../components/AyahCard';
import ContinuousMushafView from '../components/ContinuousMushafView';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSettings } from '../context/SettingsContext';
import { ArrowLeft } from 'lucide-react';

export const SurahDetails = () => {
  const { surahId } = useParams();
  const [searchParams] = useSearchParams();
  
  const { settings } = useSettings();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const targetAyah = searchParams.get('ayah');

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getSurahDetails(surahId, settings.defaultReciter);
        if (isMounted) {
          setSurah(data);
          setError(null);
          
          // Save continue reading progress
          const progress = {
            surahNumber: data.number,
            surahEnglishName: data.englishName,
            surahArabicName: data.name,
            totalAyahs: data.numberOfAyahs,
            timestamp: new Date().getTime(),
          };
          localStorage.setItem('hikmah-continue-reading', JSON.stringify(progress));
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load Surah details. Please check your network connection.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [surahId, settings.defaultReciter]);

  // Scroll to target ayah on load if ?ayah= parameter is present
  useEffect(() => {
    if (targetAyah && !loading && surah) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`ayah-${targetAyah}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-brand-emerald-500/30', 'bg-brand-emerald-50/10', 'dark:bg-brand-emerald-950/15');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-brand-emerald-500/30', 'bg-brand-emerald-50/10', 'dark:bg-brand-emerald-950/15');
          }, 3000);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [targetAyah, loading, surah]);

  const currentViewMode = settings.viewMode || 'continuous';

  if (loading) return <LoadingSpinner message={`Loading Surah details...`} />;

  if (error || !surah) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <div className="text-rose-500 text-sm font-semibold">{error || "Surah not found"}</div>
        <Link
          to="/quran"
          className="inline-flex items-center gap-2 text-brand-emerald-600 font-semibold text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Surah List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. Surah Responsive Header */}
      <SurahHeader surah={surah} />

      {/* 2. Reading Controls & Listen Surah CTA */}
      <ReadingControls
        surah={surah}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 3. Bismillah Header */}
      <Bismillah surahNumber={surah.number} />

      {/* 4. Main View: Full Text Continuous Mushaf or Ayah Cards */}
      {currentViewMode === 'continuous' ? (
        <ContinuousMushafView surah={surah} />
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {surah.ayahs.map((ayah) => (
            <AyahCard key={ayah.numberInSurah} ayah={ayah} surah={surah} />
          ))}
        </div>
      )}

      {/* 5. Mobile & Desktop Reading Settings Modal / Bottom Sheet */}
      <ReadingSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default SurahDetails;

// Quran API Service Layer using api.alquran.cloud

const BASE_URL = 'https://api.alquran.cloud/v1';

/**
 * Fetches the metadata list of all 114 Surahs
 */
export const getSurahList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/surah`);
    if (!response.ok) throw new Error('Failed to fetch Surah list');
    const data = await response.json();
    return data.data; // Array of 114 Surahs
  } catch (error) {
    console.error('Error fetching Surah list:', error);
    throw error;
  }
};

/**
 * Fetches a detailed Surah, combining Arabic text, English translation,
 * Malayalam translation, and Audio links into a unified list of Ayahs.
 * 
 * @param {number|string} surahId - Surah number (1-114)
 * @param {string} reciter - Reciter identifier (default: 'ar.alafasy')
 */
export const getSurahDetails = async (surahId, reciter = 'ar.alafasy') => {
  try {
    // We request the following editions:
    // 1. quran-uthmani (Arabic text font)
    // 2. en.sahih (English translation)
    // 3. ml.abdulhameed (Malayalam translation)
    // 4. the selected reciter (for audio URLs)
    const editions = `quran-uthmani,en.sahih,ml.abdulhameed,${reciter}`;
    const response = await fetch(`${BASE_URL}/surah/${surahId}/editions/${editions}`);
    
    if (!response.ok) {
      // If the multi-edition query fails (e.g. due to reciter issues), fallback to basic text and audio
      return getSurahDetailsFallback(surahId);
    }
    
    const json = await response.json();
    const data = json.data;

    if (!data || data.length < 3) {
      throw new Error('Incomplete data returned from API');
    }

    const arabicEdition = data[0];
    const englishEdition = data[1];
    const malayalamEdition = data[2];
    const audioEdition = data[3] || data[0]; // Fallback to arabic if audio edition is missing

    // Combine them into a clean single structure
    const combinedAyahs = arabicEdition.ayahs.map((ayah, index) => {
      return {
        number: ayah.number, // Global Ayah number
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        juz: ayah.juz,
        manzil: ayah.manzil,
        page: ayah.page,
        ruku: ayah.ruku,
        hizbQuarter: ayah.hizbQuarter,
        sajda: ayah.sajda,
        enTranslation: englishEdition.ayahs[index]?.text || '',
        mlTranslation: malayalamEdition.ayahs[index]?.text || '',
        audio: audioEdition.ayahs[index]?.audio || `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`,
      };
    });

    return {
      number: arabicEdition.number,
      name: arabicEdition.name,
      englishName: arabicEdition.englishName,
      englishNameTranslation: arabicEdition.englishNameTranslation,
      revelationType: arabicEdition.revelationType,
      numberOfAyahs: arabicEdition.numberOfAyahs,
      ayahs: combinedAyahs,
    };
  } catch (error) {
    console.error(`Error fetching details for Surah ${surahId}:`, error);
    // Attempt fallback
    return getSurahDetailsFallback(surahId);
  }
};

/**
 * Fallback loader that tries to get Arabic and English text if the multi-edition request fails
 */
const getSurahDetailsFallback = async (surahId) => {
  try {
    const response = await fetch(`${BASE_URL}/surah/${surahId}/editions/quran-uthmani,en.sahih`);
    if (!response.ok) throw new Error('Fallback failed');
    const json = await response.json();
    const data = json.data;
    
    const arabicEdition = data[0];
    const englishEdition = data[1];

    const combinedAyahs = arabicEdition.ayahs.map((ayah, index) => {
      return {
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        juz: ayah.juz,
        enTranslation: englishEdition.ayahs[index]?.text || '',
        mlTranslation: '', // No Malayalam translation in fallback
        audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`, // Default to Alafasy audio CDN
      };
    });

    return {
      number: arabicEdition.number,
      name: arabicEdition.name,
      englishName: arabicEdition.englishName,
      englishNameTranslation: arabicEdition.englishNameTranslation,
      revelationType: arabicEdition.revelationType,
      numberOfAyahs: arabicEdition.numberOfAyahs,
      ayahs: combinedAyahs,
    };
  } catch (err) {
    console.error('Final fallback error:', err);
    throw err;
  }
};

/**
 * Fetches a dynamic "Daily Ayah" based on the current day of the year
 */
export const getDailyAyah = async () => {
  try {
    // Total Ayahs in Quran is 6236
    const totalAyahs = 6236;
    
    // Calculate Day of the Year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Use day of year to get a deterministic ayah number
    const ayahNumber = (dayOfYear % totalAyahs) + 1;
    
    // Fetch Arabic + English + Malayalam for this Ayah
    // Standard ayah editions format: /ayah/{number}/editions/quran-uthmani,en.sahih,ml.abdulhameed
    const response = await fetch(`${BASE_URL}/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih,ml.abdulhameed`);
    if (!response.ok) {
      // Try fetching basic English translation
      const fallbackResponse = await fetch(`${BASE_URL}/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih`);
      if (!fallbackResponse.ok) throw new Error('Failed to fetch daily Ayah');
      const fallbackJson = await fallbackResponse.json();
      return {
        number: fallbackJson.data[0].number,
        numberInSurah: fallbackJson.data[0].numberInSurah,
        text: fallbackJson.data[0].text,
        surah: fallbackJson.data[0].surah, // Contains Surah details like number, name, englishName
        enTranslation: fallbackJson.data[1].text,
        mlTranslation: '',
      };
    }
    
    const json = await response.json();
    const data = json.data;
    
    return {
      number: data[0].number,
      numberInSurah: data[0].numberInSurah,
      text: data[0].text,
      surah: data[0].surah,
      enTranslation: data[1].text,
      mlTranslation: data[2]?.text || '',
    };
  } catch (error) {
    console.error('Error fetching Daily Ayah:', error);
    
    // Hardcoded high-quality fallback (Ayat al-Kursi or similar) if offline or API error
    return {
      number: 262,
      numberInSurah: 255,
      text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۚ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۚ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۚ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      surah: {
        number: 2,
        name: "البقرة",
        englishName: "Al-Baqara",
        englishNameTranslation: "The Cow",
      },
      enTranslation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
      mlTranslation: "അല്ലാഹു - അവനല്ലാതെ യാതൊരു ദൈവവുമില്ല. ജീവനുള്ളവനും എല്ലാം നിയന്ത്രിക്കുന്നവനുമത്രെ അവന്‍. മയക്കമോ ഉറക്കമോ അവനെ ബാധിക്കുകയില്ല. ആകാശങ്ങളിലുള്ളതും ഭൂമിയിലുള്ളതുമെല്ലാം അവന്റേതാണ്. അവന്റെ അനുവാദപ്രകാരമല്ലാതെ അവന്റെയടുക്കല്‍ ശുപാര്‍ശ നടത്താന്‍ കഴിയുന്നവന്‍ ആരാണുള്ളത്? അവരുടെ മുമ്പിലുള്ളതും അവര്‍ക്ക് പിന്നിലുള്ളതും അവന്‍ അറിയുന്നു. അവന്റെ അറിവില്‍ നിന്ന് അവന്‍ ഇച്ഛിക്കുന്നതല്ലാതെ യാതൊന്നും അവര്‍ക്ക് കൈവശപ്പെടുത്താനാകില്ല. അവന്റെ കുര്‍സി ആകാശഭൂമികളെയൊക്കെ ഉള്‍ക്കൊള്ളുന്നതാകുന്നു. അവയുടെ സംരക്ഷണം അവന് ഒട്ടും ഭാരമുള്ളതല്ല. അവന്‍ ഉന്നതനും മഹാനുമത്രെ.",
    };
  }
};

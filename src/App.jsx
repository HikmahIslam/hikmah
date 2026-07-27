import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';

// Layout and Pages
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Quran from './pages/Quran';
import SurahDetails from './pages/SurahDetails';
import JuzReader from './pages/JuzReader';
import Qibla from './pages/Qibla';
import Duas from './pages/Duas';
import Dhikr from './pages/Dhikr';
import Settings from './pages/Settings';

function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <AudioProvider>
          <Router>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quran" element={<Quran />} />
                <Route path="/quran/:surahId" element={<SurahDetails />} />
                <Route path="/quran/juz/:juzNumber" element={<JuzReader />} />
                <Route path="/qibla" element={<Qibla />} />
                <Route path="/duas" element={<Duas />} />
                <Route path="/dhikr" element={<Dhikr />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </MainLayout>
          </Router>
        </AudioProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;

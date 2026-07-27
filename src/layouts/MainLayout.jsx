import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AudioPlayer from '../components/AudioPlayer';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 islamic-pattern transition-colors duration-300">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pb-32">
        {children}
      </main>

      <Footer />
      
      {/* Sticky Bottom Audio Player */}
      <AudioPlayer />
    </div>
  );
};

export default MainLayout;

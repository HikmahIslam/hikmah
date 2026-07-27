import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AudioPlayer from '../components/AudioPlayer';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 islamic-pattern transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 pb-36 sm:pb-32">
        {children}
      </main>

      <Footer />
      
      {/* Sticky Bottom Audio Player */}
      <AudioPlayer />
    </div>
  );
};

export default MainLayout;

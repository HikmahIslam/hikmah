import React, { createContext, useContext, useState, useEffect } from 'react';

const BookmarksContext = createContext();

export const BookmarksProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('hikmah-bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('hikmah-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (bookmark) => {
    // bookmark: { id, surahNumber, surahName, surahEnglishName, ayahNumber, arabicText, translationText }
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === bookmark.id)) return prev;
      return [bookmark, ...prev];
    });
  };

  const removeBookmark = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const isBookmarked = (surahNumber, ayahNumber) => {
    const targetId = `${surahNumber}_${ayahNumber}`;
    return bookmarks.some((b) => b.id === targetId);
  };

  const toggleBookmark = (bookmark) => {
    if (isBookmarked(bookmark.surahNumber, bookmark.ayahNumber)) {
      removeBookmark(`${bookmark.surahNumber}_${bookmark.ayahNumber}`);
    } else {
      addBookmark({
        ...bookmark,
        id: `${bookmark.surahNumber}_${bookmark.ayahNumber}`
      });
    }
  };

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};

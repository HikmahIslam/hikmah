<div align="center">

<h1>📖 Hikmah — The Noble Qur'an Companion</h1>

<p>A modern, elegant, and responsive Qur'an web application designed for peaceful, distraction-free spiritual reading and reflection.</p>

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)

![Hikmah App Preview](https://raw.githubusercontent.com/HikmahIslam/hikmah/main/preview.png)

</div>

---

## ✨ Features

- 📖 **Read the Qur'an** — All 114 Surahs with clear Arabic text (RTL), English & Malayalam translations
- 🔊 **Audio Recitations** — Listen with a sticky bottom player supporting 5 reciters (Alafasy, Sudais, Al-Shatri, etc.)
- 📅 **Daily Ayah** — A new verse every day, fetched dynamically based on the calendar
- 🔖 **Bookmarks** — Save verses for quick reference, persisted in `localStorage`
- 🤲 **Duas Collection** — 14 authentic supplications across 8 categories (Morning, Evening, Forgiveness, Rizq, etc.)
- 📿 **Tasbeeh / Dhikr Counter** — Digital SVG-ring counter with 33/99/100 targets and round tracking
- 🌙 **Dark & Light Mode** — System-aware on first load, manually toggleable
- 🔎 **Surah Search & Filter** — Search by English name, Arabic name, translation, or number; filter Meccan/Medinan
- ⚙️ **Customizable Settings** — Adjust Arabic font size, translation size, language, and default reciter
- 📱 **Fully Responsive** — Mobile-first layout with hamburger navigation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI Framework |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS v4** | Styling (via `@tailwindcss/vite` plugin) |
| **React Router DOM v7** | Client-side routing |
| **Lucide React** | Icon library |
| **Google Fonts** | Amiri (Arabic), Inter & Outfit (UI) |
| **api.alquran.cloud** | Qur'an text, translations & audio |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/HikmahIslam/hikmah.git
cd hikmah

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── context/          # Global state (Theme, Settings, Bookmarks, Audio)
├── hooks/            # Custom React hooks
├── data/             # Static data (duas.js)
├── services/         # API service layer (quranApi.js)
├── components/       # Reusable UI components
├── layouts/          # Page layout wrappers
├── pages/            # Route-level page components
├── App.jsx           # Root component with providers & routing
└── index.css         # Global styles + Tailwind v4 setup
```

---

## 🗺️ Routes

| Route | Page |
|---|---|
| `/` | Home (Hero, Daily Ayah, Popular Surahs) |
| `/quran` | Qur'an Index (114 Surahs, search & filter) |
| `/quran/:surahId` | Surah Details (reading + audio) |
| `/bookmarks` | Saved Verses |
| `/duas` | Duas Collection |
| `/dhikr` | Tasbeeh Counter |
| `/settings` | App Settings |

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Made with ❤️ for the Ummah
</div>

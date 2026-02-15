<div align="center">

# 🎵 Next-FM

[![Project Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/jerome-fosse/next-fm)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.5.18-5AD7E4?logo=daisyui)](https://daisyui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Zod](https://img.shields.io/badge/Zod-4.3.6-3E67B1?logo=zod)](https://zod.dev/)

**Next-FM** is a modern web application designed to search and explore music albums using Discogs and Last.fm APIs.

[Tech Stack](#tech-stack) • [Features](#features) • [Getting Started](#getting-started) • [Contributing](#contributing)

</div>

---

## 🚀 Overview

Next-FM is a personal project primarily created to improve my skills and expertise in **React** and **Next.js**. It provides a seamless interface to search for your favorite albums across multiple music databases, view detailed tracklists, and manage your music collection with ease.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: DaisyUI 5
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **Icons**: React Icons
- **Language**: TypeScript

## ✨ Features

- 🔍 **Multi-API Search**: Search albums on both Discogs and Last.fm.
- 🖼️ **Visual Gallery**: Responsive album thumbnail grid with smart image fallback.
- 📝 **Detailed Information**: View tracklists, genres, and styles for each album.
- 🔗 **Direct Links**: Quick access to original album pages on Discogs/Last.fm.
- ⚡ **Modern UI**: Built with Next.js 16, Tailwind CSS 4, and DaisyUI.

## 🗺️ Roadmap

- [ ] 🔍 **Setlist.fm Integration**: Integrate the Setlist.fm API to view live performance data.
- [ ] 🔑 **Last.fm Authentication**: Implement secure login with Last.fm accounts.
- [ ] 🎵 **Scrobbling**: Enable scrobbling albums and tracks directly to Last.fm.
- [ ] 📊 **Advanced Statistics**: Detailed insights and visualizations of your music listening habits.
- [ ] 📱 **Mobile App**: Develop a dedicated React Native version for a native mobile experience.
- [ ] 🚀 **Many more to come...**

Feel free to [open an issue](https://github.com/jerome-fosse/next-fm/issues) to suggest new features or improvements!

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jerome-fosse/next-fm.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (create a `.env.local` file):
   ```env
   DISCOGS_API_KEY=your_key
   LASTFM_API_KEY=your_key
   ```
4. Run the server:
   ```bash
   npm run build && npm run start
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

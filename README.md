# 🎵 Spotify Clone – Music Streaming Web App

🔗 **Live Demo**: [https://spotify-clone-ndqh.onrender.com](https://spotify-clone-ndqh.onrender.com)  
💻 **GitHub Repo**: [https://github.com/Rahul-B47/spotify_clone](https://github.com/Rahul-B47/spotify_clone)

A full-stack Spotify-inspired music streaming application built with Next.js, Tailwind CSS, Firebase, and Cloudinary. Users can listen to songs, like them, create playlists, search music from Firebase and YouTube, and follow artists.

---

## 🧩 Features

- 🎧 Stream songs with audio playback
- ❤️ Like and unlike songs
- 📝 Create and manage personal playlists
- 🔍 Search songs using Firebase and YouTube API
- 👤 View artist pages and follow them
- 🔐 Firebase authentication (Email + Google)
- 📱 Fully responsive design
- ☁️ Admin panel for song & artist uploads via Cloudinary

---

## ⚙️ Tech Stack

| Technology        | Description                            |
|-------------------|----------------------------------------|
| Next.js 14        | React-based full-stack framework        |
| Tailwind CSS      | Utility-first CSS for modern UI         |
| Firebase          | Auth, Firestore for DB, Hosting         |
| Cloudinary        | Upload and manage audio/media files     |
| YouTube Data API  | Search and fallback music results       |
| React Icons       | Iconography throughout the app          |

---

## 📁 Project Structure

```
spotify_clone/
├── public/
│   ├── images/            # Static assets (album art, etc.)
│   ├── songs/             # Sample MP3 files (if any)
│   └── favicon.svg        # App icon
├── src/
│   ├── components/        # UI components (Header, PlayerBar, SongCard, etc.)
│   ├── context/           # Auth & Player context providers
│   ├── data/              # Hardcoded playlists and mock data
│   ├── firebase.js        # Firebase SDK setup
│   ├── layouts/           # App layout wrappers
│   ├── lib/               # Firestore interaction helpers
│   ├── pages/
│   │   ├── admin/         # Admin panel pages
│   │   ├── api/           # (Optional) API route handlers
│   │   ├── artist/        # Dynamic artist pages
│   │   ├── playlist/      # Dynamic & static playlist pages
│   │   ├── liked.js       # Liked songs page
│   │   ├── create-playlist.js
│   │   ├── library.js     # Followed artists/playlists
│   │   ├── search.js      # Search results page
│   │   ├── login.js       # Login page
│   │   ├── signup.js      # Signup page
│   │   ├── profile.js     # User profile settings
│   │   └── index.js       # Homepage
│   ├── styles/            # Tailwind + custom styles
│   └── utils/             # Helper functions (like toggleLike, uploader, etc.)
├── .env.local             # Env config (API keys, etc.)
├── next.config.mjs        # Next.js config
├── tailwind.config.js     # Tailwind config
└── package.json           # Project dependencies
```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Rahul-B47/spotify_clone.git
cd spotify_clone
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 👨‍💻 Author

**Rahulrakesh Poojary**  
🔗 [Portfolio](https://rahulworks-dev.onrender.com/)  
🐙 [GitHub](https://github.com/Rahul-B47)

---

## 📦 Deploy Your Own

- Set up Firebase project (Auth + Firestore)
- Configure Cloudinary account for media uploads
- Add all credentials in `.env.local`
- Deploy using platforms like **Vercel** or **Render**
- Enjoy your own Spotify clone 🎶

---

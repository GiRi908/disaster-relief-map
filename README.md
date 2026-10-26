# 🗺️ Disaster Relief Map

> Real-time crowdsourced platform to discover, report, and coordinate disaster relief efforts during natural emergencies.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://disaster-relief-map-3zi3.vercel.app/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

🔗 **Live Deployment:** [https://disaster-relief-map-3zi3.vercel.app/](https://disaster-relief-map-3zi3.vercel.app/)

---

## 🌟 Overview

**Disaster Relief Map** is a real-time web application designed to help communities, first responders, and volunteers coordinate and respond during crises (floods, earthquakes, fires, cyclones, etc.). Users can mark shelters, medical facilities, distribution points, hazards, and road blockages directly on an interactive map.

---

## 🚀 Live Demo

Access the live web application here:
👉 **[https://disaster-relief-map-3zi3.vercel.app/](https://disaster-relief-map-3zi3.vercel.app/)**

---

## ✨ Features

- 📍 **Interactive Live Map**: Powered by Leaflet and OpenStreetMap with custom markers categorized by disaster type and severity.
- 📝 **Crowdsourced Incident Reporting**: Easy report submission with click-to-pin geolocation, category tags, severity levels, and descriptions.
- ⚡ **Real-Time Data Sync**: Instant updates powered by Firebase Firestore live listeners (`onSnapshot`).
- 🔐 **Secure Authentication**: Google Sign-In via Firebase Auth.
- 🛡️ **Admin Verification Workflow**: Dedicated admin panel to review, verify, or resolve incoming emergency reports.
- 📊 **Live Dashboard & Analytics**: High-level statistics on active reports, verified incidents, and resolution rates.
- 🚨 **Alerts Panel**: Prioritized view of critical emergency alerts.
- 🌓 **Dark & Light Mode**: Accessible theme switching with persistent preferences.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router DOM v7
- **Mapping**: Leaflet.js, React Leaflet, OpenStreetMap
- **Backend / BaaS**: Firebase Firestore (Real-time NoSQL DB), Firebase Authentication
- **Icons & Styling**: Custom CSS with Glassmorphism, CSS Variables & Fluid Responsive Design
- **Hosting**: Vercel

---

## 📁 Project Structure

```
disaster-relief-map/
├── public/                # Static assets, icons, manifest
├── src/
│   ├── components/
│   │   ├── layout/        # Sidebar, DashboardLayout
│   │   ├── AdminPanel.jsx # Verification & moderation
│   │   ├── AlertsPanel.jsx# Critical alerts view
│   │   ├── Dashboard.jsx  # Overview metrics & charts
│   │   ├── Header.jsx     # Top navigation
│   │   ├── Login.jsx      # Authentication screen
│   │   ├── MapView.jsx    # Interactive Leaflet map
│   │   ├── ProtectedRoute.jsx
│   │   ├── ReportForm.jsx # Incident reporting form
│   │   └── ThemeProvider.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx# Firebase Auth state provider
│   ├── firebase.js        # Firebase SDK initialization
│   ├── App.jsx            # Route definitions
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles & themes
├── .env.example           # Environment template
└── vite.config.js
```

---

## ⚙️ Setup & Local Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Firebase Project](https://console.firebase.google.com/) with **Firestore** and **Google Authentication** enabled.

### 2. Clone the Repository
```bash
git clone https://github.com/GiRi908/disaster-relief-map.git
cd disaster-relief-map
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deployment (Vercel)

1. Import repository into [Vercel](https://vercel.com).
2. Under **Settings** > **Environment Variables**, add all `VITE_FIREBASE_*` variables.
3. In [Firebase Console](https://console.firebase.google.com/), add your Vercel domain (`disaster-relief-map-3zi3.vercel.app`) under **Authentication > Settings > Authorized Domains**.
4. Deploy!

---

## 📄 License

This project is licensed under the MIT License.

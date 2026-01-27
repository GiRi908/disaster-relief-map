# 🌍 Disaster Relief Map

A **crowdsourced disaster relief platform** that helps communities report and discover real-time updates during natural disasters (floods, earthquakes, cyclones, etc.). Users can share shelters, medical aid, food distribution points, hazards, and blocked roads on an interactive live map.

---

## 🚀 Features

* 📌 **Crowdsourced Reports** – users mark safe shelters, hazards, and aid points.
* 🗺️ **Interactive Map** – real-time markers with category-based icons.
* ⚡ **Instant Updates** – powered by Firebase real-time database.
* 🔍 **Filters** – view only what you need (medical aid, food, shelters, etc.).
* 👤 **Authentication** – Google login to prevent spam.
* 🛠️ **Admin Panel** – verify reports before they go live.
* 📷 **Image Uploads** – attach shelter or hazard photos.
* 🔥 **Heatmap View** (bonus) – visualize disaster density areas.

---

## 🏗️ Tech Stack

**Frontend:** Vue.js (Vite), Leaflet.js / Mapbox
**Backend:** Node.js + Express (optional, for admin APIs)
**Database:** Firebase Firestore (real-time sync)
**Auth:** Firebase Authentication (Google Sign-In)
**Storage:** Firebase Storage (report images)
**Hosting:** Netlify / Vercel (frontend), Firebase Hosting (backend + DB)

---

## 📂 Project Structure

```
disaster-relief-map/
├─ src/
│  ├─ components/
│  │  ├─ MapView.vue
│  │  ├─ ReportForm.vue
│  │  ├─ AdminPanel.vue
│  ├─ firebase.js
│  ├─ main.js
│  └─ App.vue
├─ .env.local
└─ README.md
```

---

## ⚙️ Setup & Installation

1. Clone this repository

   ```bash
   git clone https://github.com/<your-username>/disaster-relief-map.git
   cd disaster-relief-map
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a **Firebase Project** and enable:

   * Firestore Database
   * Firebase Authentication (Google)
   * Firebase Storage

4. Add Firebase credentials in `.env.local`

   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. Run the project locally

   ```bash
   npm run dev
   ```

---

## 🚀 Deployment

* **Frontend:** Deploy to Netlify or Vercel.
* **Backend (optional):** Firebase Functions or Node/Express on Render/Heroku.
* **Database & Storage:** Firebase Firestore + Storage.

---

## 📸 Screenshots (to add later)

* [ ] Map view with reports
* [ ] Report submission form
* [ ] Admin panel

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

---

## 📜 License

This project is licensed under the MIT License.

---

## 🌟 Acknowledgements

* [Leaflet.js](https://leafletjs.com/) – open-source interactive maps
* [Firebase](https://firebase.google.com/) – real-time backend services
* [OpenStreetMap](https://www.openstreetmap.org/) – free map tiles

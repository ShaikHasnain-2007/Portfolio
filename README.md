# 🚀 Shaik Hasnain | AI/ML & Game Dev Engineer Portfolio

An immersive, high-performance creative portfolio showcase built with React, Vite, Tailwind CSS, GSAP, Framer Motion, and deployed using Firebase. This project features fluid scroll animations, interactive canvas rendering, a responsive Bento Grid design, and a custom AI Chat Widget.

🔗 **Live Link:** [https://shaikhasnain0709.web.app/](https://shaikhasnain0709.web.app/)

---

## 🛠️ Tech Stack & Key Libraries

### **Frontend & Core**
*   **React 19** - Component-based interactive UI.
*   **Vite** - Lightning-fast build tool and development server.
*   **Tailwind CSS** - Modern utility-first CSS styling.
*   **Lucide React** - High-quality minimalist SVG icon library.

### **Animations & Motion Design**
*   **GSAP (GreenSock Animation Platform)** - Heavyweight timeline-based scroll animations and canvas sequence drivers.
*   **Framer Motion** - Fluid micro-interactions, spring physics, and entry animations.
*   **Lenis Scroll** - Butter-smooth scrolling synchronized with GSAP ScrollTrigger.

### **Hosting & Deployment**
*   **Firebase Hosting** - Production-grade web hosting with fast SSL and global CDN delivery.

---

## 🌟 Key Features

*   **Network Preloader:** A professional, animated preloading screen that monitors font and image resource load progress.
*   **Hero Canvas Sequence:** A high-end interactive canvas element displaying image-sequence animations linked to scroll position.
*   **Bento Grid Layout:** A sleek, content-dense dashboard showing education (SRM University AP), interests, projects, and tech competencies.
*   **AI Chat Widget:** An inline, interactive AI companion widget allowing visitors to ask questions about Shaik's skills and experience.
*   **Custom Fluid Cursor:** A dynamic cursor effect that follows user pointer movement with custom lag and hover-state scales.
*   **Film Grain Overlay:** A subtle overlay giving the portfolio a premium, cinematic textured look.

---

## 📁 Project Structure

Since this is a fully serverless, frontend-centric Single Page Application (SPA), the code is kept at the root level for optimal Vite compilation and Firebase deployment:

```
├── .firebase/             # Firebase local configuration caches
├── public/                # Static public assets (Favicon, images, PWA assets)
├── src/
│   ├── components/        # Reusable UI & animation components
│   │   ├── AIChatWidget.jsx          # AI interaction modal & logic
│   │   ├── BentoGrid.jsx             # Grid display of cards & highlights
│   │   ├── CustomCursor.jsx          # Follow-pointer micro-interaction
│   │   ├── FilmGrain.jsx             # Visual grain overlay
│   │   ├── HeroCanvas.jsx            # Scroll-sequence canvas controller
│   │   ├── InteractiveTimeline.jsx   # Project & work chronology
│   │   ├── NetworkPreloader.jsx      # Resource loader and entry gate
│   │   └── ...
│   ├── App.jsx            # Main app page shell and initialization (Lenis/GSAP)
│   ├── index.css          # Global Tailwind directives & custom CSS animations
│   └── main.jsx           # React DOM Entrypoint
├── .firebaserc            # Firebase project association
├── firebase.json          # Firebase Hosting configuration (dist/ as public dir)
├── tailwind.config.js     # Tailwind setup and theme extensions
├── vite.config.js         # Vite compilation options
└── package.json           # Project dependencies & build scripts
```

> [!NOTE]
> **No Backend Folder?** This portfolio is built using serverless hosting. Dynamic services (such as the chat widget) connect directly to APIs or Firebase services, eliminating the need for a dedicated local backend server. If a backend is needed in the future (e.g. Node.js/Express, Flask), you can create a `/backend` directory and move the web files to a `/frontend` directory.

---

## 🚀 Getting Started Locally

Follow these steps to run the portfolio on your local machine:

### **Prerequisites**
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### **1. Clone the Repository**
```bash
git clone https://github.com/ShaikHasnain-2007/Portfolio.git
cd Portfolio
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start the Development Server**
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Build and Deployment

### **Build for Production**
To generate optimized static assets:
```bash
npm run build
```
This outputs the compiled site inside the `/dist` directory.

### **Deploy to Firebase**
If you have the Firebase CLI installed and logged in, you can deploy using:
```bash
firebase deploy
```
This publishes the `/dist` folder to your Firebase Hosting domain.

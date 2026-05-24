# 📌 Restroly FrontEnd

FrontEnd web application for **Restroly** — a QR-based restaurant menu and contactless ordering experience.
This project provides the user interface for browsing menus, selecting items, and placing orders — connecting seamlessly with the Restroly backend.

Restroly enables restaurants and hotels to offer digital menus and order placement by scanning QR codes placed at tables or rooms. :contentReference[oaicite:0]{index=0}

---
github deployment
https://share.google/aimode/hNGOvLxyr870LUf6Z

## 🚀 Features

✔ Responsive UI for menu browsing
✔ Category & food listing
✔ View food details
✔ Add to cart & place orders
✔ Connects with Restroly backend APIs
✔ Clean design with modern frontend stack

---

## 🧱 Tech Stack

This project is built using:

- **React.js** (or your chosen frontend framework – update accordingly)
- **HTML5 & CSS3**
- **JavaScript / JSX**
- **React Router**
- **Axios / Fetch for API calls**
- CSS Framework (Tailwind / Bootstrap / Custom — update accordingly)

---

## 📁 Project Structure

```

Restroly-FrontEnd/
├─ public/
│ └─ index.html
├─ src/
│ ├─ components/
│ ├─ pages/
│ ├─ services/
│ ├─ assets/
│ ├─ App.jsx
│ └─ index.js
├─ .gitignore
├─ package.json
└─ README.md

````

---

## 🔧 Setup & Installation

### 📌 Prerequisites

Ensure you have installed:
- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (comes with Node.js)
- **Git**
- **Code Editor** (VS Code recommended)

---

### 📌 Getting Started

#### 1. Navigate to Frontend Directory
From the root of the cloned `RestroHub` repository, enter the frontend directory:
```bash
cd RestroHub-FrontEnd
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Create a `.env` file in the frontend root directory:
```bash
cp .env.example .env
```
Open `.env` and enter your actual config values:
- `VITE_API_BASE_URL=http://localhost:8181/restroly` (Should point to your Spring Boot backend)
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID (Must match the one configured on the backend)

---

### 📌 Run Locally

To launch the Vite development server:
```bash
npm run dev
```

By default, Vite will start the frontend on port **3000**:
```
http://localhost:3000
```

---

## 🌐 Backend Integration

The frontend app automatically integrates with the **Restroly backend API** to load menus, categories, handle orders, and perform authentication.

The API client configuration can be found at `src/services/common/api.js`. It is set up to automatically look at `VITE_API_BASE_URL` from your `.env` file, falling back to `http://localhost:8181/restroly` when not specified.

---

## 🧠 Features in UI

### 📋 Menu & Categories

* View all menus
* Filter by category
* Search food items

### 🛒 Cart & Order

* Add / remove items from cart
* View cart summary
* Place orders using backend APIs

> Expand features as needed: Authentication, user profiles, order history, live order tracking.

---

## 📦 Deployment

You can deploy this frontend to:

✔ Vercel
✔ Netlify
✔ GitHub Pages
✔ AWS Amplify
✔ Firebase Hosting

Example (Netlify):

```bash
npm run build
# then deploy the build folder
npm run deploy

```

---

## 🧩 Environment Variables

Create a `.env` file in the root (Vite only exposes variables prefixed with `VITE_`):

```env
VITE_API_BASE_URL=http://localhost:8181/restroly
# Google OAuth: create credentials in Google Cloud Console and set your client id here
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

How to obtain a Google Client ID:

1. Go to https://console.cloud.google.com/apis/credentials
2. Create or select a project
3. Click "Create Credentials" → "OAuth client ID" and choose "Web application"
4. Add `http://localhost:5173` (or your Vite dev URL) to Authorized JavaScript origins
5. Copy the `Client ID` and add it to your `.env` as `VITE_GOOGLE_CLIENT_ID`

After updating `.env`, restart the dev server.

---

## 📸 Screenshots

(Add relevant screenshots or a demo GIF here once available.)

---

## 👍 Contributing

Contributions are welcome! To contribute:

1. Fork this repo
2. Create a branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push: `git push origin feature-name`
5. Submit a Pull Request

---

## 📝 License

Licensed under **MIT License** — see the `LICENSE` file for details.

---

## 📞 Contact

If you have questions or feedback, feel free to reach out:

📧 `rdodiya201@gmail.com`
🌐 [https://github.com/rdodiya](https://github.com/rdodiya)

---

## ⭐ About Restroly

Restroly is a QR-based food ordering platform that enables contactless menu browsing and seamless order placement for hotels and restaurants, enhancing guest experiences and driving revenue. ([restrohub.com][1])

```

---

### 🔧 Tips to Enhance README

✅ Add **Screenshots or GIFs**
✅ Include **Live Demo Link** (if hosted)
✅ Add **API documentation section**
✅ Include **Contributing Guidelines & Code of Conduct**

---

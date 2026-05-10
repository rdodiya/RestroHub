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

### 📌 Clone Repository

```bash
git clone https://github.com/rdodiya/Restroly-FrontEnd.git
cd Restroly-FrontEnd
````

### 📌 Install Dependencies

```bash
npm install
```

or with Yarn:

```bash
yarn install
```

### 📌 Run Locally

```bash
npm start
```

or

```bash
yarn start
```

Open your browser at:

```
http://localhost:3000
```

---

## 🌐 Backend Integration

This frontend app connects to the **Restroly backend** to fetch menus, categories, and handle orders.

Ensure your backend is running and update the API base URL in:

```
src/services/api.js
```

Example:

```js
export const API_BASE_URL = "http://localhost:8080/api";
```

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

Create a `.env` file in the root:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
# any other keys you need
```

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

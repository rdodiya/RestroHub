# 🍽️ Restroly - Digital Menu & Restaurant Management Platform

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GSSOC](https://img.shields.io/badge/GSSOC-2026-blue.svg)](https://gssoc.girlscript.tech/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](#-prerequisites)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](#-prerequisites)

**Empowering Indian Restaurants to Go Digital — Simple, Fast & Powerful!**

[Features](#-features) • [Quick Start](#-quick-start) • [Docs](#-documentation) • [Contributing](#-contributing) • [Contact](#-contact--support)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)
- [Contact & Support](#-contact--support)

---

## 🎯 About

**Restroly** is a comprehensive digital solution designed specifically for Indian restaurants. From street-side dhabas to fine dining establishments, Restroly helps restaurants create digital menus, accept payments, manage orders, and build their online presence with minimal effort.

### Why Restroly?

| Challenge | Our Solution |
|-----------|--------------|
| 🇮🇳 Complex payment integration | Direct UPI payment links & QR codes |
| 📱 Limited digital presence | Auto-generated restaurant websites with QR menus |
| 🌐 Language barriers | Multi-language menu support |
| 📊 Manual order management | Centralized order dashboard |
| 📦 Aggregator hassles | One-platform menu & order management |

---

## ✨ Features

### 📱 Core Features

- **📱 QR Menu Generation** - Generate scannable QR codes for contactless menus
- **📂 Menu Management** - Organize items into categories with images and descriptions
- **💳 UPI Payment Integration** - Direct payment links supporting GPay, PhonePe, Paytm, and BHIM
- **🌐 Restaurant Website** - Auto-generated landing pages with live menus
- **📊 Order Dashboard** - Centralized order management and tracking
- **🔐 Authentication** - Secure login for restaurant owners and admins
- **📈 Analytics** - Track orders, revenue, and popular items
- **🎨 Customizable Templates** - Different themes for Cafes, Dhabas, Fine Dining, etc.

### 🚀 Advanced Features (In Development)

- WhatsApp Business API integration for status updates
- AI-powered menu translation (25+ languages)
- Zomato & Swiggy aggregator sync
- Multi-branch management
- Inventory & stock management

---

## 🏗️ Tech Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot
- **Build Tool**: Gradle
- **Database**: PostgreSQL
- **Cache**: Redis (planned for some features; not required for local development)
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Context API / Local State
- **HTTP Client**: Axios
- **Routing**: React Router v6+

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Frontend Hosting**: Vercel / Netlify
- **Version Control**: Git

---

## 📋 Prerequisites

### System Requirements

Before starting, ensure you have the following installed on your machine:

**For Backend (Java Development):**
```bash
- Java Development Kit (JDK) 21 or higher
- Gradle 8.0 or higher
- PostgreSQL 14 or higher
- Git
- IDE: IntelliJ IDEA (recommended) or Eclipse
- Maven/Gradle plugin for your IDE
```

**For Frontend (Web Development):**
```bash
- Node.js 18.0 or higher
- npm 9.0 or higher (comes with Node.js)
- Git
- Code Editor: VS Code (recommended)
```

**For Google OAuth Integration:**
```bash
- Google Cloud Console account (free)
- OAuth 2.0 Client ID from Google Cloud
```

### Verify Installation

```bash
# Check Java version
java -version

# Check Gradle version
gradle --version

# Check Node.js version
node --version

# Check npm version
npm --version

# Verify PostgreSQL (if installed locally)
psql --version
```

---

## 🚀 Quick Start

### Clone the Repository

```bash
# Clone the repository
git clone https://github.com/rdodiya/RestroHub.git

# Navigate to project directory
cd RestroHub

# For GSSoC contributions, work from this branch
git checkout gssoc_develop
git pull origin gssoc_develop
```

### Backend Setup

#### 1. Database configuration

Create a PostgreSQL database named **`RestroHub_DB`** (must match the default JDBC URL; use quotes in SQL if you need mixed case):

```bash
createdb RestroHub_DB
# or: psql -U postgres -c 'CREATE DATABASE "RestroHub_DB";'
```

Ensure the PostgreSQL user you use can connect to that database. By default the app expects username **`postgres`** with password **`postgres`**. Override with environment variables if your setup differs:

```bash
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
# Optional: full JDBC URL
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/RestroHub_DB
```

#### 2. Google OAuth Setup (Required for Login)

**Get Google OAuth Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Click **"Create Credentials"** → **"OAuth client ID"** → **"Web application"**
4. Add authorized URIs:
   - `http://localhost:5173` (Frontend dev)
   - `http://localhost:3000` (Alternative)
   - Your production domain
5. Copy the **Client ID**

**Set Backend Configuration:**

```bash
export GOOGLE_OAUTH_CLIENT_ID=your_client_id_from_google_cloud
export JWT_SECRET=your-256-bit-secret-key-change-in-production
export JWT_EXPIRATION=86400000
export JWT_REFRESH_EXPIRATION=604800000
```

To generate a secure JWT_SECRET:
```bash
# macOS/Linux
openssl rand -hex 32

# Or Python
python3 -c "import os; print(os.urandom(32).hex())"

# Or Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3. Backend configuration (optional)

Most defaults are already in `RestroHub/src/main/resources/application.properties` and `application-dev.properties`. Prefer environment variables for secrets (for example `DB_PASSWORD`, `JWT_SECRET`) instead of committing passwords.

#### 4. Build and run backend

```bash
# Navigate to backend directory
cd RestroHub

# If ./gradlew is not executable: chmod +x gradlew

# Ensure the Gradle wrapper JAR is present (commit includes RestroHub/gradle/wrapper/gradle-wrapper.jar).
# If it is missing, regenerate with: gradle wrapper --gradle-version 8.7

# Build the project
./gradlew clean build

# Run the application
./gradlew bootRun
```

The backend will be available at:
```
http://localhost:8181/restroly/api/v1
```

**Swagger API Documentation:**
```
http://localhost:8181/restroly/swagger-ui.html
```

### Frontend Setup

#### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd RestroHub-FrontEnd

# Install dependencies
npm install
```

#### 2. Environment configuration - Google OAuth

Create a `.env` file in `RestroHub-FrontEnd/` (see `.env.example`):

```env
# Frontend API and Google OAuth
VITE_API_BASE_URL=http://localhost:8181/restroly
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

**Important:** Use the **same Google Client ID** from Google Cloud Console as used in backend configuration.

Optional:

```env
VITE_NODE_ENV=development
VITE_ENABLE_ANALYTICS=false
```

#### 3. Run Development Server

```bash
# Start development server
npm run dev
```

The frontend dev server uses port **3000** by default (see `RestroHub-FrontEnd/vite.config.js`). If that port is busy, Vite picks the next free port (for example **3001**).

```
http://localhost:3000
```

### Verify Both Services Are Running

1. **Backend health (Spring Boot Actuator):**
   ```bash
   curl http://localhost:8181/restroly/actuator/health
   ```
   Expect `{"status":"UP"}`. API routes live under `/restroly/api/v1` (and related paths); there is no `/api/v1/health` endpoint.

2. **Frontend:** Open the URL printed by Vite (usually `http://localhost:3000`).

---

## 📁 Project Structure

```
RestroHub/
├── RestroHub/                          # Backend (Java/Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/restroly/
│   │   │   │   ├── controller/         # REST API endpoints
│   │   │   │   ├── service/            # Business logic
│   │   │   │   ├── repository/         # Database access
│   │   │   │   ├── model/              # Entity classes
│   │   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   ├── config/             # Configuration classes
│   │   │   │   └── exception/          # Custom exceptions
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       ├── application-prod.properties
│   │   │       └── logback-spring.xml
│   │   └── test/
│   ├── build.gradle                    # Gradle build configuration
│   ├── settings.gradle
│   └── README.md
│
├── RestroHub-FrontEnd/                 # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                  # Admin dashboard components
│   │   │   ├── customer/               # Customer-facing components
│   │   │   └── common/                 # Reusable components
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   └── public/
│   │   ├── services/
│   │   │   ├── api.js                  # API client configuration
│   │   │   └── ApiService.js           # API service functions
│   │   ├── context/
│   │   │   └── SiteContext.jsx         # Context for state management
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── landing.css
│   │   │   └── variables.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example                    # Template for Vite env (copy to .env)
│   ├── .env                            # Local env (create from .env.example; not committed)
│   └── README.md
│
├── ReadMe.md                           # Main project README (this file)
├── LICENSE
└── CONTRIBUTING.md
```

---

## 📚 API Documentation

### Running Swagger UI

Once the backend is running, access the complete API documentation at:

```
http://localhost:8181/restroly/swagger-ui.html
```

### Key API Endpoints

#### Menu Management
- `GET /api/v1/menus` - Get all menus
- `POST /api/v1/menus` - Create new menu
- `PUT /api/v1/menus/{id}` - Update menu
- `DELETE /api/v1/menus/{id}` - Delete menu

#### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category

#### Food Items
- `GET /api/v1/foods` - Get all food items
- `POST /api/v1/foods` - Add food item
- `PUT /api/v1/foods/{id}` - Update food item
- `DELETE /api/v1/foods/{id}` - Delete food item

#### Orders
- `GET /api/v1/orders` - Get all orders
- `POST /api/v1/orders` - Place new order
- `GET /api/v1/orders/{id}` - Get order details

---

## 🤝 Contributing

We love contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is valuable.

### 🎯 How to Contribute

**1. Fork the Repository**
```bash
# Click the Fork button on GitHub
```

**2. Clone Your Fork**
```bash
git clone https://github.com/YOUR_USERNAME/RestroHub.git
cd RestroHub
```

**3. Create a Feature Branch from gssoc_develop branch**
```bash
git checkout -b feature/your-feature-name gssoc_develop
# or for bug fixes:
git checkout -b fix/bug-name gssoc_develop
```

**4. Make Your Changes**
- Write clean, well-commented code
- Follow the project's coding standards
- Test your changes thoroughly

**5. Build & Test Locally**

**For Backend:**
```bash
cd RestroHub
./gradlew clean build
./gradlew bootRun
# Test at: http://localhost:8181/restroly/swagger-ui.html
```

**For Frontend:**
```bash
cd RestroHub-FrontEnd
npm install
npm run dev
# Test at: http://localhost:3000 (or the URL Vite prints)
```

**6. Commit with Conventional Commits**
```bash
git commit -m "type(scope): description"

# Examples:
git commit -m "feat(menu): add menu categories"
git commit -m "fix(api): resolve food item endpoint"
git commit -m "docs(readme): update setup instructions"
```

**Commit Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring without feature changes
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates

**7. Push to Your Fork**
```bash
git push origin feature/your-feature-name
```

**8. Open a Pull Request**
- Go to the original repository
- Click "New Pull Request"
- Select your branch and provide a clear description
- Wait for review and feedback

### 📋 Contribution Guidelines

- **Code Style**: Follow existing code patterns
- **Testing**: Test your changes locally before submitting
- **Documentation**: Update ReadMe.md if adding new features
- **Commit Messages**: Use clear, descriptive messages
- **PR Descriptions**: Explain what and why, not just what

### 🔍 Areas Needing Contributions

| Feature | Difficulty | Impact |
|---------|-----------|--------|
| Backend Api Changes as per requirements of Frontend | Low | High |
| Frontend Highly Responsive UI | Low | High |
| Frontend & Backend Integration | Low | High |
| WhatsApp Integration | Medium | High |
| UPI Payment Service | Medium | High |
| Menu Templates | Easy | Medium |
| Aggregator Sync | Hard | High |
| Analytics Dashboard | Medium | Medium |
| Multi-language Support | Easy | Medium |

---

## 🚀 Deployment (Not for Local)

### Docker Deployment

**1. Build Docker Images**
```bash
# Build the entire stack
docker-compose build
```

**2. Run with Docker Compose**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Frontend Deployment

#### Option 0: Local (Recommended)
npm run dev

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd RestroHub-FrontEnd

# Deploy
vercel --prod
```

#### Option 2: Netlify

```bash
# Build the project
npm run build

# Deploy using Netlify CLI or upload the dist folder manually
netlify deploy --prod --dir=dist
```

### Backend Deployment

#### Option 0: Embedded Tomcat

For local development, use the embedded Tomcat server from Spring Boot (`./gradlew bootRun`).

#### Option 1: Docker to Cloud (AWS, GCP, Azure)

```bash
# Build JAR
cd RestroHub
./gradlew build

# Create Docker image and push to registry
docker build -t your-registry/restrohub:latest .
docker push your-registry/restrohub:latest
```

#### Option 2: Traditional Server 

```bash
# Build JAR
./gradlew build

# Copy WAR to server
build/libs/restroly-0.0.1-SNAPSHOT-plain.war user@server:/opt/tomcat/webapps/restroly

# Restart web server
systemctl restart tomcat
```

---

## 🔧 Troubleshooting

### Backend Issues

**Issue: PostgreSQL Connection Failed**
```
Error: org.postgresql.util.PSQLException: Connection refused
```
**Solution:**
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# If not running, start PostgreSQL service
# On Windows: Services > PostgreSQL
# On macOS: brew services start postgresql
# On Linux: sudo systemctl start postgresql
```

**Issue: Port 8181 Already in Use**
```bash
# Find process using port 8181
lsof -i :8181    # macOS/Linux
netstat -ano | findstr :8181  # Windows

# Kill process (get PID from above)
kill -9 <PID>    # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Frontend Issues

**Issue: Dependencies Installation Failed**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: API Calls Returning 404**
```bash
# Verify backend is running:
curl http://localhost:8181/restroly/actuator/health

# Check .env: base URL should be the server + context path (not .../api/v1)
grep VITE_API_BASE_URL .env
```

**Issue: Port 3000 Already in Use**
```bash
# Run on a different port (ensure CORS_ALLOWED_ORIGINS on the backend includes that origin)
npm run dev -- --port 5173
```

### General Issues

**Issue: Git Clone Fails**
```bash
# Check git is installed
git --version

# Verify SSH/HTTPS connection
git ls-remote https://github.com/rdodiya/RestroHub.git
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**You are free to:**
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute the software
- ✅ Use privately

**You must:**
- ✅ Include license and copyright notice

---

## 📞 Contact & Support

### Project Owner
**Raj Dodiya**
- 👨‍💻 LinkedIn : [@rdodiya](https://www.linkedin.com/in/rdodiya/)
- 🐙 GitHub: [@rdodiya](https://github.com/rdodiya)
- 📧 Email: rdodiya2601@gmail.com
- 💬 Twitter: [@RestroHub](https://x.com/rdodiya2001)

### Support Channels
- 📝 **Issue Tracker**: [GitHub Issues](https://github.com/rdodiya/RestroHub/issues)
- 📧 **Email**: rdodiya2601@gmail.com

### Reporting Issues

When reporting bugs, please include:
1. Description of the issue
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots/error logs (if applicable)
5. Your environment (OS, Java version, Node version, etc.)

---

## 🙏 Acknowledgments

- **Spring Boot Team** - For the amazing backend framework
- **React Team** - For the powerful frontend library
- **Tailwind CSS** - For beautiful styling
- **PostgreSQL Community** - For reliable database
- **All Contributors** - For making RestroHub better

---

<div align="center">

**Made with ❤️ for Indian Restaurants**

[⬆ Back to top](#-restrohub---digital-menu--restaurant-management-platform)

</div>

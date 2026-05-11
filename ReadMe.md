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
- **Cache**: Redis
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
```

### Backend Setup

#### 1. Database Configuration

```bash
# Create PostgreSQL database
createdb restrohub_db

# Create database user (optional but recommended)
# In PostgreSQL terminal:
# CREATE USER restrohub_user WITH PASSWORD 'password';
# GRANT ALL PRIVILEGES ON DATABASE restrohub_db TO restrohub_user;
```

#### 2. Environment Variables

Navigate to `RestroHub/src/main/resources/` and configure:

**application.properties** (or create `application-dev.properties`):
```properties
# Server Configuration
server.port=8181
server.servlet.context-path=/restroly
spring.application.name=Restroly

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/restrohub_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Redis Configuration (optional for caching)
spring.redis.host=localhost
spring.redis.port=6379

# Logging
logging.level.root=INFO
logging.level.com.restroly=DEBUG
```

#### 3. Build and Run Backend

```bash
# Navigate to backend directory
cd RestroHub

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

#### 2. Environment Configuration

Create a `.env` file in `RestroHub-FrontEnd/` root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8181/restroly/api/v1

# Application Environment
VITE_NODE_ENV=development

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
```

#### 3. Run Development Server

```bash
# Start development server
npm run dev
```

The frontend will be available at:
```
http://localhost:5173
```

### Verify Both Services Are Running

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8181/restroly/api/v1/health
   ```

2. **Frontend:** Open browser and navigate to `http://localhost:5173`

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
│   ├── .env                            # Environment variables (create this)
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
# Test at: http://localhost:5173
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
- **Documentation**: Update README if adding new features
- **Commit Messages**: Use clear, descriptive messages
- **PR Descriptions**: Explain what and why, not just what

### 🔍 Areas Needing Contributions

| Feature | Difficulty | Impact |
|---------|-----------|--------|
| Backend Api Changes as per requiremen of Frontne | Low | High |
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

#### Option 0: Embedded tomcat

For Local,use embaedded tomcat server of Spring Boot

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

# Copy WAT to server
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
# Verify backend is running at:
curl http://localhost:8181/restroly/api/v1/health

# Check .env file has correct API URL
cat .env | grep VITE_API_BASE_URL
```

**Issue: Port 5173 Already in Use**
```bash
# Run on different port
npm run dev -- --port 3000
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

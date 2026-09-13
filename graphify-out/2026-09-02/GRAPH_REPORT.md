# Graph Report - RestroHub  (2026-09-02)

## Corpus Check
- 335 files · ~153,535 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2356 nodes · 6064 edges · 130 communities (107 shown, 23 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 403 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aa98c817`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- lombok.Builder
- org.junit.jupiter.api.Test
- AuthServiceImpl
- SecurityConfig.java
- ApiErrorResponse
- UpiLinkResponseDTO
- RestaurantRequestDTO
- RestaurantResponseDTO
- org.springframework.security.access.prepost.PreAuthorize
- Order
- JwtTokenProvider
- JwtAuthenticationFilter
- Category
- 🍽️ Restroly - Digital Menu & Restaurant Management Platform
- react
- OrderItemResponse
- CreateOrderRequest
- OrderItem
- lombok.extern.slf4j.Slf4j
- FoodResponseDTO
- Profile.jsx
- ThemeSelector.jsx
- ServiceRequest
- SubscriptionServiceImpl
- 📘 Project Details — Restroly
- devDependencies
- dependencies
- OrderResponse
- RoleResponse
- Menus.jsx
- Address
- .deleteMenu
- CustomUserDetailsService.java
- 📌 Restroly FrontEnd
- Restaurant
- org.springframework.transaction.annotation.Transactional
- User
- Login.jsx
- Register.jsx
- io.swagger.v3.oas.annotations.Operation
- org.springframework.stereotype.Service
- ApiResponse
- GenericMapper
- 🤝 Contributing to Restroly
- AdminSkeleton.jsx
- Tables
- SubscriptionPlanDto
- UpiLink
- org.springframework.web.servlet.mvc.method.annotation.SseEmitter
- routes/index.jsx
- SiteConfigDTO
- 🤝 Contributing to RestroHub
- Menu
- OrderStatus
- org.springframework.data.domain.Pageable
- Tables.jsx
- DashboardStatDTO
- Theme
- SubscriptionPlan
- org.springframework.data.jpa.repository.JpaRepository
- 🍽️ Restroly - Digital Menu & Restaurant Management Platform
- RestaurantSubscription
- .deleteBranch
- package.json
- Orders.jsx
- QRDisplay.jsx
- WhatsappServiceImpl
- Backend Setup
- UPILinks.jsx
- App.jsx
- Code of Conduct
- OrderStatus
- Branches.jsx
- ThemeContext.jsx
- Backend Deployment
- SiteConfig
- RestaurantApplication
- ForgotPassword.jsx
- PlanFeatureMapping
- org.springframework.stereotype.Component
- .deleteRestaurant
- 📋 Development Workflow
- scripts
- LiveNotificationService
- Key API Endpoints
- MenusGrid.jsx
- UserRoleManagement.jsx
- .restoreBranch
- 📝 Pull Requests
- ApiService.js
- ✨ Features
- org.springframework.http.ResponseEntity
- ServiceRequestResponseDTO
- Branch
- 🤝 Contributing
- 🏗️ Tech Stack
- 📞 Contact & Support
- useAuth.js
- useWebSocketNotifications.js
- gradlew
- Constants
- RestaurantApplicationTests
- axios
- framer-motion
- react-dom
- react-router-dom
- @react-three/drei
- recharts
- eslint.config.js
- three
- AuthControllerTest.java
- io.swagger.v3.oas.annotations.media.Schema
- CategoryResponseDTO
- MenuResponseDTO
- SiteConfigServiceImpl.java
- SubscriptionFeature
- SiteConfigServiceImpl
- ServiceRequestDTO

## God Nodes (most connected - your core abstractions)
1. `react` - 74 edges
2. `Branch` - 67 edges
3. `ResourceNotFoundException` - 62 edges
4. `OrderResponse` - 62 edges
5. `Food` - 48 edges
6. `PageResponseDTO` - 45 edges
7. `MenuResponseDTO` - 42 edges
8. `BranchResponseDTO` - 41 edges
9. `Order` - 40 edges
10. `Category` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Header()` --calls--> `clearAuthSession()`  [EXTRACTED]
  RestroHub-FrontEnd/src/components/admin/Header.jsx → RestroHub-FrontEnd/src/services/common/authStorage.js
- `TablesGrid()` --indirect_call--> `normalizeTable()`  [INFERRED]
  RestroHub-FrontEnd/src/components/admin/store/tables/TablesGrid.jsx → RestroHub-FrontEnd/src/components/admin/store/tables/tableMapper.js
- `Address` --references--> `Branch`  [EXTRACTED]
  RestroHub/src/main/java/com/restroly/qrmenu/address/entity/Address.java → RestroHub/src/main/java/com/restroly/qrmenu/branch/entity/Branch.java
- `DashboardServiceImpl` --implements--> `DashboardService`  [EXTRACTED]
  RestroHub/src/main/java/com/restroly/qrmenu/admin/dashboard/service/DashboardServiceImpl.java → RestroHub/src/main/java/com/restroly/qrmenu/admin/dashboard/service/DashboardService.java
- `PasswordResetToken` --references--> `User`  [EXTRACTED]
  RestroHub/src/main/java/com/restroly/qrmenu/auth/entity/PasswordResetToken.java → RestroHub/src/main/java/com/restroly/qrmenu/user/entity/User.java

## Import Cycles
- None detected.

## Communities (130 total, 23 thin omitted)

### Community 0 - "lombok.Builder"
Cohesion: 0.14
Nodes (27): lombok.AllArgsConstructor, lombok.Builder, lombok.Data, lombok.NoArgsConstructor, ForgotPasswordRequest, GoogleAuthRequest, ResetPasswordRequest, VerifyResetCodeRequest (+19 more)

### Community 1 - "org.junit.jupiter.api.Test"
Cohesion: 0.06
Nodes (18): jakarta.transaction.Transactional, org.junit.jupiter.api.BeforeEach, org.junit.jupiter.api.extension.ExtendWith, org.junit.jupiter.api.Test, org.springframework.core.io.Resource, PaymentStatus, CANCELLED, PENDING (+10 more)

### Community 2 - "AuthServiceImpl"
Cohesion: 0.12
Nodes (9): org.springframework.http.HttpStatus, org.springframework.mail.javamail.JavaMailSender, org.springframework.security.crypto.password.PasswordEncoder, AuthServiceImpl, Override, BusinessException, EmailService, EmailServiceImpl (+1 more)

### Community 3 - "SecurityConfig.java"
Cohesion: 0.07
Nodes (34): io.swagger.v3.oas.annotations.security.SecurityScheme, io.swagger.v3.oas.models.OpenAPI, jakarta.validation.Validator, jakarta.validation.ValidatorFactory, OpenAPI, org.junit.jupiter.api.AfterAll, org.junit.jupiter.api.BeforeAll, org.junit.jupiter.params.ParameterizedTest (+26 more)

### Community 4 - "ApiErrorResponse"
Cohesion: 0.12
Nodes (25): jakarta.servlet.http.HttpServletRequest, jakarta.validation.ConstraintViolation, jakarta.validation.ConstraintViolationException, org.springframework.dao.DataIntegrityViolationException, org.springframework.http.converter.HttpMessageNotReadableException, org.springframework.security.access.AccessDeniedException, org.springframework.security.authentication.BadCredentialsException, org.springframework.security.core.AuthenticationException (+17 more)

### Community 5 - "UpiLinkResponseDTO"
Cohesion: 0.11
Nodes (13): org.springframework.web.bind.annotation.CrossOrigin, org.springframework.web.bind.annotation.DeleteMapping, org.springframework.web.bind.annotation.GetMapping, org.springframework.web.bind.annotation.PutMapping, org.springframework.web.bind.annotation.RequestMapping, org.springframework.web.bind.annotation.RestController, HomeController, BranchService (+5 more)

### Community 6 - "RestaurantRequestDTO"
Cohesion: 0.16
Nodes (11): AllArgsConstructor, Builder, Data, NoArgsConstructor, RestaurantRequestDTO, AllArgsConstructor, Builder, Data (+3 more)

### Community 7 - "RestaurantResponseDTO"
Cohesion: 0.14
Nodes (9): GetMapping, GetMapping, PostMapping, PutMapping, AllArgsConstructor, Builder, Data, NoArgsConstructor (+1 more)

### Community 8 - "org.springframework.security.access.prepost.PreAuthorize"
Cohesion: 0.07
Nodes (15): org.springframework.security.access.prepost.PreAuthorize, DeleteMapping, GetMapping, DeleteMapping, PutMapping, ResponseStatus, DeleteMapping, GetMapping (+7 more)

### Community 9 - "Order"
Cohesion: 0.08
Nodes (18): DashboardServiceImpl, Override, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist (+10 more)

### Community 10 - "JwtTokenProvider"
Cohesion: 0.20
Nodes (5): jakarta.annotation.PostConstruct, javax.crypto.SecretKey, org.springframework.security.core.userdetails.UserDetails, SuppressWarnings, JwtTokenProvider

### Community 11 - "JwtAuthenticationFilter"
Cohesion: 0.31
Nodes (6): jakarta.servlet.FilterChain, jakarta.servlet.http.HttpServletResponse, org.springframework.security.core.userdetails.UserDetailsService, org.springframework.web.filter.OncePerRequestFilter, Override, JwtAuthenticationFilter

### Community 12 - "Category"
Cohesion: 0.07
Nodes (10): Category, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PreUpdate, Setter (+2 more)

### Community 13 - "🍽️ Restroly - Digital Menu & Restaurant Management Platform"
Cohesion: 0.05
Nodes (41): 🎯 About, 🙏 Acknowledgments, 📊 Additional Features, 🔄 Aggregator Integration, Aggregator Sync, 🌍 AI Menu Translation, AI Menu Translation, ☕ Backend Setup (Java / Spring Boot) (+33 more)

### Community 14 - "react"
Cohesion: 0.08
Nodes (4): react, KanbanBoard(), OrderCard(), styles

### Community 16 - "CreateOrderRequest"
Cohesion: 0.09
Nodes (4): OrderDirector, OrderItemBuilder, CreateOrderRequest, OrderItemRequest

### Community 17 - "OrderItem"
Cohesion: 0.12
Nodes (11): OrderBuilder, Override, OrderBuilderImpl, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor (+3 more)

### Community 18 - "lombok.extern.slf4j.Slf4j"
Cohesion: 0.15
Nodes (24): io.swagger.v3.oas.annotations.tags.Tag, lombok.extern.slf4j.Slf4j, lombok.RequiredArgsConstructor, org.springframework.validation.annotation.Validated, BranchController, RequestMapping, RestController, ApiConstants (+16 more)

### Community 19 - "FoodResponseDTO"
Cohesion: 0.07
Nodes (22): com.cloudinary.Cloudinary, org.springframework.cache.annotation.Cacheable, org.springframework.cache.annotation.CacheEvict, org.springframework.web.multipart.MultipartFile, CloudinaryService, ResourceAlreadyExistsException, PostMapping, FoodMapper (+14 more)

### Community 20 - "Profile.jsx"
Cohesion: 0.07
Nodes (32): Header(), TODO: Replace hardcoded branchId with actual branch from auth context, formatGender(), getNames(), PersonalInfoCard(), ProfileHeader(), ProfileImageModal(), ProfileSidebar() (+24 more)

### Community 21 - "ThemeSelector.jsx"
Cohesion: 0.09
Nodes (18): fileToBase64(), SectionEditor(), COLOR_FIELDS, FONT_BODY_OPTIONS, FONT_HEADING_OPTIONS, ThemeSelector(), Website(), WebsiteHeader() (+10 more)

### Community 22 - "ServiceRequest"
Cohesion: 0.14
Nodes (14): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, Setter, Table (+6 more)

### Community 24 - "📘 Project Details — Restroly"
Cohesion: 0.07
Nodes (27): 1) Public Customer Flow, 2) Admin / Manager Flow, 🌐 API Structure, 🏗️ Architecture, AUTH APIS, 🔄 Business Flow, Business Rules, 🧩 Core Features (+19 more)

### Community 25 - "devDependencies"
Cohesion: 0.07
Nodes (27): autoprefixer, eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, gh-pages, postcss, devDependencies (+19 more)

### Community 26 - "dependencies"
Cohesion: 0.07
Nodes (27): formik, @headlessui/react, lenis, lucide-react, react, react-hot-toast, react-icons, @react-oauth/google (+19 more)

### Community 27 - "OrderResponse"
Cohesion: 0.09
Nodes (6): org.springframework.scheduling.annotation.Async, org.springframework.web.bind.annotation.PatchMapping, OrderResponse, OrderService, WhatsappOrderNotificationServiceImpl, WhatsappOrderNotificationService

### Community 28 - "RoleResponse"
Cohesion: 0.09
Nodes (18): org.slf4j.Logger, org.springframework.boot.ApplicationArguments, org.springframework.boot.ApplicationRunner, RoleResponse, AllArgsConstructor, Builder, Entity, Getter (+10 more)

### Community 29 - "Menus.jsx"
Cohesion: 0.14
Nodes (12): BulkActions(), CategoryFormModal(), CategorySidebar(), getErrorMessage(), MenuItemCard(), ACCEPTED_IMAGE_TYPES, getErrorMessage(), MenuFormModal() (+4 more)

### Community 30 - "Address"
Cohesion: 0.11
Nodes (5): Address, AddressRepository, BranchMapper, AddressDTO, MenuDTO

### Community 32 - "CustomUserDetailsService.java"
Cohesion: 0.33
Nodes (4): org.springframework.security.authentication.DisabledException, org.springframework.security.authentication.LockedException, UserDisabledException, UserLockedException

### Community 33 - "📌 Restroly FrontEnd"
Cohesion: 0.08
Nodes (24): 1. Navigate to Frontend Directory, 2. Install Dependencies, 3. Environment Configuration, ⭐ About Restroly, 🌐 Backend Integration, 🛒 Cart & Order, 📞 Contact, 👍 Contributing (+16 more)

### Community 34 - "Restaurant"
Cohesion: 0.09
Nodes (18): org.springframework.boot.CommandLineRunner, org.springframework.jdbc.core.JdbcTemplate, DatabaseInitializer, Override, AllArgsConstructor, Builder, Entity, Getter (+10 more)

### Community 35 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.14
Nodes (6): org.springframework.transaction.annotation.Transactional, BranchServiceImpl, Override, ResourceNotFoundException, Override, MenuServiceImpl

### Community 36 - "User"
Cohesion: 0.08
Nodes (16): CustomUserDetailsService, Override, UserResponse, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor (+8 more)

### Community 39 - "io.swagger.v3.oas.annotations.Operation"
Cohesion: 0.07
Nodes (21): io.swagger.v3.oas.annotations.Operation, io.swagger.v3.oas.annotations.responses.ApiResponses, GetMapping, PostMapping, PutMapping, PageResponseDTO, FoodController, DeleteMapping (+13 more)

### Community 40 - "org.springframework.stereotype.Service"
Cohesion: 0.11
Nodes (15): org.springframework.security.core.Authentication, org.springframework.stereotype.Service, org.springframework.web.bind.annotation.ResponseStatus, DuplicateResourceException, RoleNotFoundException, UserNotFoundException, AllArgsConstructor, Builder (+7 more)

### Community 41 - "ApiResponse"
Cohesion: 0.13
Nodes (15): io.swagger.v3.oas.annotations.parameters.RequestBody, org.springframework.web.bind.annotation.PostMapping, AuthController, AuthResponse, AllArgsConstructor, Builder, Data, NoArgsConstructor (+7 more)

### Community 43 - "🤝 Contributing to Restroly"
Cohesion: 0.11
Nodes (18): 1️⃣ Fork the Repository, 2️⃣ Clone Your Fork, 3️⃣ Create a Feature Branch, 4️⃣ Make Your Changes, 5️⃣ Run the Application & Tests, 6️⃣ Commit Your Changes, 7️⃣ Push to Your Fork, 8️⃣ Open a Pull Request (+10 more)

### Community 44 - "AdminSkeleton.jsx"
Cohesion: 0.16
Nodes (5): AdminSkeleton(), LiveOrders(), QuickActions(), RevenueChart(), StatsSection()

### Community 45 - "Tables"
Cohesion: 0.12
Nodes (10): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate, Setter (+2 more)

### Community 46 - "SubscriptionPlanDto"
Cohesion: 0.10
Nodes (16): GetMapping, RequestMapping, RestController, RestaurantSubscriptionController, PostMapping, PutMapping, RequestMapping, RestController (+8 more)

### Community 47 - "UpiLink"
Cohesion: 0.32
Nodes (4): UpiLink, UpiLinkRepository, Override, UpiLinkServiceImpl

### Community 48 - "org.springframework.web.servlet.mvc.method.annotation.SseEmitter"
Cohesion: 0.24
Nodes (5): org.springframework.web.servlet.mvc.method.annotation.SseEmitter, AbstractSseNotificationService, Override, SseEmitter, SseGenericNotificationService

### Community 49 - "routes/index.jsx"
Cohesion: 0.14
Nodes (10): AdminLayout(), CustomerLayout(), PublicLayout(), App(), Landing(), NotFound(), PrivacyPolicy(), RefundPolicy() (+2 more)

### Community 50 - "SiteConfigDTO"
Cohesion: 0.29
Nodes (5): PatchMapping, SectionDTO, SiteConfigDTO, UpdateSiteConfigRequest, SiteConfigService

### Community 51 - "🤝 Contributing to RestroHub"
Cohesion: 0.12
Nodes (15): Backend (Java), Before Creating a New Issue, 🎨 Code Style Guidelines, 💬 Commit Messages, 🤝 Contributing to RestroHub, Creating Issues, Frontend (React/JavaScript), 🚀 Getting Started (+7 more)

### Community 52 - "Menu"
Cohesion: 0.11
Nodes (11): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Menu (+3 more)

### Community 53 - "OrderStatus"
Cohesion: 0.14
Nodes (10): OrderStatus, BILLED, CANCELLED, COMPLETED, CONFIRMED, PENDING, PREPARING, READY (+2 more)

### Community 54 - "org.springframework.data.domain.Pageable"
Cohesion: 0.11
Nodes (18): org.hibernate.annotations.SQLDelete, org.hibernate.annotations.SQLRestriction, org.springframework.data.domain.Page, org.springframework.data.domain.Pageable, org.springframework.data.jpa.repository.Modifying, org.springframework.data.jpa.repository.Query, Food, AllArgsConstructor (+10 more)

### Community 55 - "Tables.jsx"
Cohesion: 0.19
Nodes (7): TableCard(), TableFormModal(), normalizeTable(), TableQRModal(), TablesGrid(), TablesHeader(), TablesStatusLegend()

### Community 56 - "DashboardStatDTO"
Cohesion: 0.17
Nodes (11): DashboardController, CrossOrigin, GetMapping, RequestMapping, RestController, DashboardStatDTO, AllArgsConstructor, Builder (+3 more)

### Community 57 - "Theme"
Cohesion: 0.18
Nodes (10): AllArgsConstructor, Builder, Data, Entity, EqualsAndHashCode, Getter, NoArgsConstructor, Setter (+2 more)

### Community 58 - "SubscriptionPlan"
Cohesion: 0.12
Nodes (11): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate, Setter (+3 more)

### Community 59 - "org.springframework.data.jpa.repository.JpaRepository"
Cohesion: 0.19
Nodes (7): org.springframework.data.jpa.repository.JpaRepository, org.springframework.stereotype.Repository, PasswordResetTokenRepository, OrderItemRepository, PaymentVerificationRepository, RestaurantSubscriptionRepository, SiteConfigRepository

### Community 60 - "🍽️ Restroly - Digital Menu & Restaurant Management Platform"
Cohesion: 0.14
Nodes (14): 🎯 About, 🙏 Acknowledgments, Backend Issues, Frontend Issues, General Issues, 📄 License, 📋 Prerequisites, 📁 Project Structure (+6 more)

### Community 61 - "RestaurantSubscription"
Cohesion: 0.14
Nodes (10): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate, Setter (+2 more)

### Community 63 - "package.json"
Cohesion: 0.15
Nodes (11): dynamic-theming, responsive, restaurant, vite, author, description, keywords, license (+3 more)

### Community 64 - "Orders.jsx"
Cohesion: 0.15
Nodes (12): actionConfig, formatAmount(), formatTime(), OrderCard(), statusConfig, OrderFilters(), OrdersGrid(), OrdersHeader() (+4 more)

### Community 65 - "QRDisplay.jsx"
Cohesion: 0.36
Nodes (3): QRHeader(), QRPreview(), QRStyleSelector()

### Community 66 - "WhatsappServiceImpl"
Cohesion: 0.26
Nodes (5): org.springframework.beans.factory.annotation.Autowired, org.springframework.boot.web.client.RestTemplateBuilder, org.springframework.web.client.RestTemplate, WhatsappServiceImpl, WhatsappService

### Community 67 - "Backend Setup"
Cohesion: 0.17
Nodes (12): 1. Database configuration, 1. Install Dependencies, 2. Environment configuration - Google OAuth, 2. Google OAuth Setup (Required for Login), 3. Backend configuration (optional), 3. Run Development Server, 4. Build and run backend, Backend Setup (+4 more)

### Community 68 - "UPILinks.jsx"
Cohesion: 0.23
Nodes (6): UPICard(), UPIFormModal(), extractList(), UPIGrid(), UPIHeader(), UPITestModal()

### Community 69 - "App.jsx"
Cohesion: 0.50
Nodes (3): App(), root, AppRoutes()

### Community 70 - "Code of Conduct"
Cohesion: 0.18
Nodes (10): 📖 Attribution, Code of Conduct, 💻 Contribution Guidelines, 🤝 Expected Behavior, ⚖️ Maintainer Responsibilities, ❤️ Our Goal, 🌟 Our Promise, 📣 Reporting Issues (+2 more)

### Community 71 - "OrderStatus"
Cohesion: 0.18
Nodes (10): Deprecated, OrderStatus, BILLED, CANCELLED, COMPLETED, CONFIRMED, PENDING, PREPARING (+2 more)

### Community 72 - "Branches.jsx"
Cohesion: 0.25
Nodes (5): BranchCard(), TODO: Get this from auth context or restaurant state, BranchesGrid, BranchFormModal(), BranchHeader()

### Community 75 - "Backend Deployment"
Cohesion: 0.20
Nodes (10): Backend Deployment, 🚀 Deployment (Not for Local), Docker Deployment, Frontend Deployment, Option 0: Embedded Tomcat, Option 0: Local (Recommended), Option 1: Docker to Cloud (AWS, GCP, Azure), Option 1: Vercel (+2 more)

### Community 76 - "SiteConfig"
Cohesion: 0.12
Nodes (16): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Section (+8 more)

### Community 77 - "RestaurantApplication"
Cohesion: 0.39
Nodes (7): org.springframework.boot.autoconfigure.domain.EntityScan, org.springframework.boot.autoconfigure.SpringBootApplication, org.springframework.boot.web.servlet.support.SpringBootServletInitializer, org.springframework.context.annotation.ComponentScan, org.springframework.data.jpa.repository.config.EnableJpaRepositories, org.springframework.scheduling.annotation.EnableAsync, RestaurantApplication

### Community 78 - "ForgotPassword.jsx"
Cohesion: 0.20
Nodes (5): ForgotPassword(), forgotPasswordSchema, getApiMessage(), resetPasswordSchema, verifyCodeSchema

### Community 79 - "PlanFeatureMapping"
Cohesion: 0.20
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, PlanFeatureMapping (+1 more)

### Community 80 - "org.springframework.stereotype.Component"
Cohesion: 0.36
Nodes (4): org.springframework.stereotype.Component, SectionMapper, SiteConfigMapper, ThemeMapper

### Community 82 - "📋 Development Workflow"
Cohesion: 0.25
Nodes (8): 1. Create a Feature Branch, 2. Make Your Changes, 3. Test Your Changes Locally, 4. Commit Your Changes, 5. Push to Your Fork, 6. Sync Before Creating PR, 7. Create a Pull Request, 📋 Development Workflow

### Community 83 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, deploy, dev, lint, predeploy, preview, tw:init

### Community 85 - "Key API Endpoints"
Cohesion: 0.29
Nodes (7): 📚 API Documentation, Categories, Food Items, Key API Endpoints, Menu Management, Orders, Running Swagger UI

### Community 86 - "MenusGrid.jsx"
Cohesion: 0.27
Nodes (8): cardGradients, CategoryMenuSection(), categoryStyleSets, getCardGradient(), getCategoryStyle(), MenuCard(), MenuDetailModal(), MenusGrid

### Community 87 - "UserRoleManagement.jsx"
Cohesion: 0.33
Nodes (4): INITIAL_ASSIGNMENTS, MOCK_RESTAURANTS, MOCK_ROLES, MOCK_USERS

### Community 90 - "📝 Pull Requests"
Cohesion: 0.40
Nodes (5): Before Submitting a PR, Important PR Guidelines, PR Description Template, PR Requirements, 📝 Pull Requests

### Community 93 - "✨ Features"
Cohesion: 0.40
Nodes (5): 🚀 Advanced Features (In Development), 📱 Core Features, ✅ Feature Checklist, ✨ Features, 🗺️ Roadmap

### Community 94 - "org.springframework.http.ResponseEntity"
Cohesion: 0.11
Nodes (15): org.springframework.http.ResponseEntity, GetMapping, PatchMapping, PostMapping, RestController, ServiceRequestController, GetMapping, DeleteMapping (+7 more)

### Community 95 - "ServiceRequestResponseDTO"
Cohesion: 0.18
Nodes (8): org.mapstruct.Mapper, AllArgsConstructor, Builder, Data, NoArgsConstructor, ServiceRequestResponseDTO, ServiceRequestMapper, ServiceRequestService

### Community 96 - "Branch"
Cohesion: 0.14
Nodes (11): jakarta.persistence.Entity, jakarta.persistence.PrePersist, jakarta.persistence.PreUpdate, jakarta.persistence.Table, lombok.Getter, lombok.Setter, RegisterRequest, PasswordResetToken (+3 more)

### Community 97 - "🤝 Contributing"
Cohesion: 0.50
Nodes (4): 🔍 Areas Needing Contributions, 🤝 Contributing, 📋 Contribution Guidelines, 🎯 How to Contribute

### Community 98 - "🏗️ Tech Stack"
Cohesion: 0.50
Nodes (4): Backend, DevOps & Deployment, Frontend, 🏗️ Tech Stack

### Community 99 - "📞 Contact & Support"
Cohesion: 0.50
Nodes (4): 📞 Contact & Support, Project Owner, Reporting Issues, Support Channels

### Community 100 - "useAuth.js"
Cohesion: 0.83
Nodes (3): getUserRoles(), hasRole(), isAdmin()

### Community 101 - "useWebSocketNotifications.js"
Cohesion: 1.00
Nodes (3): getRelativeTime(), mapToNotification(), useWebSocketNotifications()

### Community 102 - "gradlew"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 127 - "io.swagger.v3.oas.annotations.media.Schema"
Cohesion: 0.11
Nodes (14): io.swagger.v3.oas.annotations.media.Schema, AllArgsConstructor, Builder, Data, NoArgsConstructor, LoginRequest, AllArgsConstructor, Builder (+6 more)

### Community 128 - "CategoryResponseDTO"
Cohesion: 0.07
Nodes (22): CategoryController, GetMapping, PostMapping, PutMapping, RequestMapping, ResponseEntity, RestController, CategoryRequestDTO (+14 more)

### Community 129 - "MenuResponseDTO"
Cohesion: 0.18
Nodes (7): com.fasterxml.jackson.annotation.JsonInclude, MenuRequestDTO, AddressDTO, BranchDTO, CategoryDTO, FoodDTO, MenuResponseDTO

### Community 130 - "SiteConfigServiceImpl.java"
Cohesion: 0.17
Nodes (10): com.fasterxml.jackson.databind.ObjectMapper, SectionType, ABOUT, CONTACT, FOOTER, GALLERY, HERO, NAVIGATION (+2 more)

### Community 132 - "SubscriptionFeature"
Cohesion: 0.20
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, SubscriptionFeature (+1 more)

### Community 133 - "SiteConfigServiceImpl"
Cohesion: 0.16
Nodes (8): AllArgsConstructor, Builder, Data, NoArgsConstructor, ThemeDTO, Override, SuppressWarnings, SiteConfigServiceImpl

### Community 135 - "ServiceRequestDTO"
Cohesion: 0.33
Nodes (5): AllArgsConstructor, Builder, Data, NoArgsConstructor, ServiceRequestDTO

## Knowledge Gaps
- **270 isolated node(s):** `browserGlobals`, `name`, `version`, `description`, `type` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Branch` connect `Branch` to `lombok.Builder`, `org.junit.jupiter.api.Test`, `Restaurant`, `org.springframework.transaction.annotation.Transactional`, `MenuResponseDTO`, `org.springframework.stereotype.Service`, `Order`, `Category`, `Tables`, `UpiLink`, `CreateOrderRequest`, `OrderItem`, `Menu`, `org.springframework.data.domain.Pageable`, `Address`, `io.swagger.v3.oas.annotations.media.Schema`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `Profile.jsx`, `ThemeSelector.jsx`, `Menus.jsx`, `Login.jsx`, `Register.jsx`, `AdminSkeleton.jsx`, `routes/index.jsx`, `Tables.jsx`, `package.json`, `Orders.jsx`, `QRDisplay.jsx`, `UPILinks.jsx`, `App.jsx`, `Branches.jsx`, `ContactSection.jsx`, `ThemeContext.jsx`, `ForgotPassword.jsx`, `MenusGrid.jsx`, `UserRoleManagement.jsx`, `useWebSocketNotifications.js`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `Restaurant` connect `Restaurant` to `Branch`, `AuthServiceImpl`, `User`, `RestaurantRequestDTO`, `org.springframework.stereotype.Service`, `org.springframework.data.domain.Pageable`, `ServiceRequest`, `RestaurantSubscription`, `Address`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `browserGlobals`, `name`, `version` to the rest of the system?**
  _270 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lombok.Builder` be split into smaller, more focused modules?**
  _Cohesion score 0.14255765199161424 - nodes in this community are weakly interconnected._
- **Should `org.junit.jupiter.api.Test` be split into smaller, more focused modules?**
  _Cohesion score 0.058596491228070174 - nodes in this community are weakly interconnected._
- **Should `AuthServiceImpl` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._
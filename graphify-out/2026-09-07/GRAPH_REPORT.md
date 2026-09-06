# Graph Report - RestroHub  (2026-09-07)

## Corpus Check
- 335 files · ~156,981 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2366 nodes · 6097 edges · 133 communities (113 shown, 20 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 409 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aa98c817`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- lombok.AllArgsConstructor
- PaymentServiceImplTest
- FoodServiceImpl
- SecurityConfig.java
- ApiErrorResponse
- OrderController.java
- GenericMapper
- io.swagger.v3.oas.annotations.tags.Tag
- org.springframework.http.ResponseEntity
- Order
- AuthServiceImpl.java
- Food
- Category
- 🍽️ Restroly - Digital Menu & Restaurant Management Platform
- react
- OrderItemResponse
- CreateOrderRequest
- OrderBuilder
- OrderServiceImpl
- PageResponseDTO
- Profile.jsx
- ThemeSelector.jsx
- ServiceRequestResponseDTO
- org.junit.jupiter.api.Test
- 📘 Project Details — Restroly
- devDependencies
- dependencies
- OrderResponse
- RoleResponse
- Menus.jsx
- Address
- MenuController
- PaymentService
- 📌 Restroly FrontEnd
- Menu
- Branch
- User
- SubscriptionServiceImpl
- MenuResponseDTO
- BranchResponseDTO
- Restaurant
- ApiResponse
- TableServiceImpl
- 🤝 Contributing to Restroly
- AdminSkeleton.jsx
- Tables
- SubscriptionPlanDto
- org.springframework.transaction.annotation.Transactional
- org.springframework.web.servlet.mvc.method.annotation.SseEmitter
- routes/index.jsx
- SiteConfigDTO
- 🤝 Contributing to RestroHub
- MenuServiceImpl
- OrderStatus
- org.springframework.data.domain.Pageable
- Tables.jsx
- DashboardStatDTO
- Theme
- SubscriptionPlan
- PlanFeatureMapping
- 🍽️ Restroly - Digital Menu & Restaurant Management Platform
- RestaurantSubscription
- org.springframework.data.jpa.repository.JpaRepository
- package.json
- Orders.jsx
- QRDisplay.jsx
- lombok.extern.slf4j.Slf4j
- Backend Setup
- UPILinks.jsx
- SubscriptionFeature
- Code of Conduct
- OrderStatus
- Branches.jsx
- CustomUserDetailsService.java
- UpiLinkResponseDTO
- Backend Deployment
- Section
- RestaurantApplication
- ForgotPassword.jsx
- auth.js
- org.springframework.stereotype.Component
- io.swagger.v3.oas.annotations.responses.ApiResponses
- 📋 Development Workflow
- scripts
- LoginRequest
- Key API Endpoints
- MenusGrid.jsx
- UserRoleManagement.jsx
- SiteConfig
- io.swagger.v3.oas.annotations.media.Schema
- 📝 Pull Requests
- ApiService.js
- PaymentStatus
- ✨ Features
- WhatsappOrderNotificationServiceImpl.java
- OrderItem
- lombok.Builder
- 🤝 Contributing
- 🏗️ Tech Stack
- 📞 Contact & Support
- useAuth.js
- useWebSocketNotifications.js
- gradlew
- CloudinaryService
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
- RefreshTokenRequest
- TableResponseDTO
- CategoryResponseDTO
- ThemeDTO
- SiteConfigServiceImpl.java
- SiteConfigServiceImpl

## God Nodes (most connected - your core abstractions)
1. `react` - 74 edges
2. `Branch` - 67 edges
3. `ResourceNotFoundException` - 62 edges
4. `OrderResponse` - 62 edges
5. `Food` - 48 edges
6. `PageResponseDTO` - 45 edges
7. `MenuResponseDTO` - 45 edges
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
- `DashboardServiceImpl` --references--> `OrderRepository`  [EXTRACTED]
  RestroHub/src/main/java/com/restroly/qrmenu/admin/dashboard/service/DashboardServiceImpl.java → RestroHub/src/main/java/com/restroly/qrmenu/order/repository/OrderRepository.java

## Import Cycles
- None detected.

## Communities (133 total, 20 thin omitted)

### Community 0 - "lombok.AllArgsConstructor"
Cohesion: 0.14
Nodes (22): lombok.AllArgsConstructor, lombok.Data, lombok.NoArgsConstructor, ForgotPasswordRequest, GoogleAuthRequest, ResetPasswordRequest, VerifyResetCodeRequest, AddressDTO (+14 more)

### Community 1 - "PaymentServiceImplTest"
Cohesion: 0.15
Nodes (4): org.junit.jupiter.api.BeforeEach, org.junit.jupiter.api.extension.ExtendWith, Override, PaymentServiceImplTest

### Community 2 - "FoodServiceImpl"
Cohesion: 0.16
Nodes (5): org.springframework.cache.annotation.Cacheable, org.springframework.cache.annotation.CacheEvict, FoodMapper, FoodServiceImpl, Override

### Community 3 - "SecurityConfig.java"
Cohesion: 0.06
Nodes (34): com.cloudinary.Cloudinary, io.swagger.v3.oas.annotations.security.SecurityScheme, io.swagger.v3.oas.models.OpenAPI, jakarta.validation.Validator, jakarta.validation.ValidatorFactory, OpenAPI, org.junit.jupiter.api.AfterAll, org.junit.jupiter.api.BeforeAll (+26 more)

### Community 4 - "ApiErrorResponse"
Cohesion: 0.12
Nodes (25): jakarta.servlet.http.HttpServletRequest, jakarta.validation.ConstraintViolation, jakarta.validation.ConstraintViolationException, org.springframework.dao.DataIntegrityViolationException, org.springframework.http.converter.HttpMessageNotReadableException, org.springframework.security.access.AccessDeniedException, org.springframework.security.authentication.BadCredentialsException, org.springframework.security.core.AuthenticationException (+17 more)

### Community 5 - "OrderController.java"
Cohesion: 0.15
Nodes (11): org.springframework.web.bind.annotation.CrossOrigin, org.springframework.web.bind.annotation.DeleteMapping, org.springframework.web.bind.annotation.GetMapping, org.springframework.web.bind.annotation.PutMapping, org.springframework.web.bind.annotation.RequestMapping, org.springframework.web.bind.annotation.RestController, HomeController, DashboardNotificationController (+3 more)

### Community 7 - "io.swagger.v3.oas.annotations.tags.Tag"
Cohesion: 0.08
Nodes (29): io.swagger.v3.oas.annotations.tags.Tag, org.springframework.validation.annotation.Validated, ApiConstants, GetMapping, RequestMapping, RestController, PublicRestaurantController, GetMapping (+21 more)

### Community 8 - "org.springframework.http.ResponseEntity"
Cohesion: 0.09
Nodes (23): io.swagger.v3.oas.annotations.Operation, org.springframework.http.ResponseEntity, org.springframework.security.access.prepost.PreAuthorize, PostMapping, PutMapping, GetMapping, DeleteMapping, DeleteMapping (+15 more)

### Community 9 - "Order"
Cohesion: 0.11
Nodes (11): Override, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, Setter (+3 more)

### Community 10 - "AuthServiceImpl.java"
Cohesion: 0.07
Nodes (21): jakarta.annotation.PostConstruct, jakarta.servlet.FilterChain, jakarta.servlet.http.HttpServletResponse, javax.crypto.SecretKey, org.springframework.http.HttpStatus, org.springframework.security.authentication.AuthenticationManager, org.springframework.security.core.Authentication, org.springframework.security.core.userdetails.UserDetails (+13 more)

### Community 11 - "Food"
Cohesion: 0.11
Nodes (13): org.hibernate.annotations.SQLDelete, org.hibernate.annotations.SQLRestriction, Food, AllArgsConstructor, Builder, Entity, EqualsAndHashCode, Getter (+5 more)

### Community 12 - "Category"
Cohesion: 0.07
Nodes (10): Category, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PreUpdate, Setter (+2 more)

### Community 13 - "🍽️ Restroly - Digital Menu & Restaurant Management Platform"
Cohesion: 0.05
Nodes (41): 🎯 About, 🙏 Acknowledgments, 📊 Additional Features, 🔄 Aggregator Integration, Aggregator Sync, 🌍 AI Menu Translation, AI Menu Translation, ☕ Backend Setup (Java / Spring Boot) (+33 more)

### Community 14 - "react"
Cohesion: 0.07
Nodes (5): react, KanbanBoard(), OrderCard(), styles, ThemeContext

### Community 17 - "OrderBuilder"
Cohesion: 0.24
Nodes (3): OrderBuilder, Override, OrderBuilderImpl

### Community 18 - "OrderServiceImpl"
Cohesion: 0.21
Nodes (6): OrderMapper, Override, OrderNotificationServiceImpl, Override, OrderServiceImpl, OrderNotificationService

### Community 19 - "PageResponseDTO"
Cohesion: 0.08
Nodes (22): org.springframework.web.multipart.MultipartFile, PageResponseDTO, FoodController, DeleteMapping, GetMapping, PatchMapping, PostMapping, PutMapping (+14 more)

### Community 20 - "Profile.jsx"
Cohesion: 0.10
Nodes (19): Header(), TODO: Replace hardcoded branchId with actual branch from auth context, formatGender(), getNames(), PersonalInfoCard(), ProfileHeader(), ProfileImageModal(), ProfileSidebar() (+11 more)

### Community 21 - "ThemeSelector.jsx"
Cohesion: 0.09
Nodes (18): fileToBase64(), SectionEditor(), COLOR_FIELDS, FONT_BODY_OPTIONS, FONT_HEADING_OPTIONS, ThemeSelector(), Website(), WebsiteHeader() (+10 more)

### Community 22 - "ServiceRequestResponseDTO"
Cohesion: 0.10
Nodes (20): AllArgsConstructor, Builder, Data, NoArgsConstructor, ServiceRequestResponseDTO, AllArgsConstructor, Builder, Entity (+12 more)

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
Cohesion: 0.08
Nodes (4): org.springframework.scheduling.annotation.Async, org.springframework.web.bind.annotation.PatchMapping, OrderResponse, OrderService

### Community 28 - "RoleResponse"
Cohesion: 0.09
Nodes (18): org.slf4j.Logger, org.springframework.boot.ApplicationArguments, org.springframework.boot.ApplicationRunner, RoleResponse, AllArgsConstructor, Builder, Entity, Getter (+10 more)

### Community 29 - "Menus.jsx"
Cohesion: 0.13
Nodes (13): BulkActions(), CategoryFormModal(), CategorySidebar(), getErrorMessage(), MenuItemCard(), ACCEPTED_IMAGE_TYPES, getErrorMessage(), MenuFormModal() (+5 more)

### Community 30 - "Address"
Cohesion: 0.11
Nodes (5): Address, AddressRepository, BranchMapper, AddressDTO, MenuDTO

### Community 31 - "MenuController"
Cohesion: 0.12
Nodes (8): DeleteMapping, GetMapping, PatchMapping, RequestMapping, ResponseStatus, RestController, MenuController, MenuService

### Community 32 - "PaymentService"
Cohesion: 0.33
Nodes (3): jakarta.transaction.Transactional, org.springframework.core.io.Resource, PaymentService

### Community 33 - "📌 Restroly FrontEnd"
Cohesion: 0.08
Nodes (24): 1. Navigate to Frontend Directory, 2. Install Dependencies, 3. Environment Configuration, ⭐ About Restroly, 🌐 Backend Integration, 🛒 Cart & Order, 📞 Contact, 👍 Contributing (+16 more)

### Community 34 - "Menu"
Cohesion: 0.14
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Menu (+1 more)

### Community 35 - "Branch"
Cohesion: 0.14
Nodes (8): org.springframework.web.bind.annotation.ResponseStatus, Branch, BranchRepository, DuplicateResourceException, ResourceAlreadyExistsException, ResourceNotFoundException, RoleNotFoundException, UserNotFoundException

### Community 36 - "User"
Cohesion: 0.06
Nodes (15): UserResponse, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate (+7 more)

### Community 38 - "MenuResponseDTO"
Cohesion: 0.22
Nodes (7): com.fasterxml.jackson.annotation.JsonInclude, MenuRequestDTO, AddressDTO, BranchDTO, CategoryDTO, FoodDTO, MenuResponseDTO

### Community 39 - "BranchResponseDTO"
Cohesion: 0.15
Nodes (10): BranchController, GetMapping, PatchMapping, PostMapping, PutMapping, RequestMapping, RestController, BranchRequestDTO (+2 more)

### Community 40 - "Restaurant"
Cohesion: 0.07
Nodes (29): org.mapstruct.Mapper, org.springframework.boot.CommandLineRunner, org.springframework.jdbc.core.JdbcTemplate, DatabaseInitializer, Override, AllArgsConstructor, Builder, Entity (+21 more)

### Community 41 - "ApiResponse"
Cohesion: 0.12
Nodes (15): io.swagger.v3.oas.annotations.parameters.RequestBody, org.springframework.web.bind.annotation.PostMapping, AuthController, AuthResponse, AllArgsConstructor, Builder, Data, NoArgsConstructor (+7 more)

### Community 43 - "🤝 Contributing to Restroly"
Cohesion: 0.11
Nodes (18): 1️⃣ Fork the Repository, 2️⃣ Clone Your Fork, 3️⃣ Create a Feature Branch, 4️⃣ Make Your Changes, 5️⃣ Run the Application & Tests, 6️⃣ Commit Your Changes, 7️⃣ Push to Your Fork, 8️⃣ Open a Pull Request (+10 more)

### Community 44 - "AdminSkeleton.jsx"
Cohesion: 0.11
Nodes (13): AdminSkeleton(), LiveOrders(), getBranchId(), QuickActions(), getBranchId(), RevenueChart(), StatsSection(), actionConfig (+5 more)

### Community 45 - "Tables"
Cohesion: 0.13
Nodes (11): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate, Setter (+3 more)

### Community 46 - "SubscriptionPlanDto"
Cohesion: 0.11
Nodes (16): RequestMapping, RestController, RestaurantSubscriptionController, GetMapping, PostMapping, PutMapping, RequestMapping, RestController (+8 more)

### Community 47 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.18
Nodes (5): org.springframework.transaction.annotation.Transactional, BranchServiceImpl, Override, Override, UpiLinkServiceImpl

### Community 48 - "org.springframework.web.servlet.mvc.method.annotation.SseEmitter"
Cohesion: 0.22
Nodes (5): org.springframework.web.servlet.mvc.method.annotation.SseEmitter, AbstractSseNotificationService, Override, SseEmitter, SseGenericNotificationService

### Community 49 - "routes/index.jsx"
Cohesion: 0.06
Nodes (17): App(), root, AdminLayout(), CustomerLayout(), PublicLayout(), App(), Landing(), Login() (+9 more)

### Community 50 - "SiteConfigDTO"
Cohesion: 0.22
Nodes (8): GetMapping, PatchMapping, RequestMapping, RestController, PublicSiteController, SiteConfigDTO, UpdateSiteConfigRequest, SiteConfigService

### Community 51 - "🤝 Contributing to RestroHub"
Cohesion: 0.12
Nodes (15): Backend (Java), Before Creating a New Issue, 🎨 Code Style Guidelines, 💬 Commit Messages, 🤝 Contributing to RestroHub, Creating Issues, Frontend (React/JavaScript), 🚀 Getting Started (+7 more)

### Community 52 - "MenuServiceImpl"
Cohesion: 0.15
Nodes (4): CategoryDTO, MenuMapper, Override, MenuServiceImpl

### Community 53 - "OrderStatus"
Cohesion: 0.13
Nodes (10): OrderStatus, BILLED, CANCELLED, COMPLETED, CONFIRMED, PENDING, PREPARING, READY (+2 more)

### Community 54 - "org.springframework.data.domain.Pageable"
Cohesion: 0.16
Nodes (3): org.springframework.data.domain.Page, org.springframework.data.domain.Pageable, FoodRepository

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

### Community 59 - "PlanFeatureMapping"
Cohesion: 0.18
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, PlanFeatureMapping (+1 more)

### Community 60 - "🍽️ Restroly - Digital Menu & Restaurant Management Platform"
Cohesion: 0.14
Nodes (14): 🎯 About, 🙏 Acknowledgments, Backend Issues, Frontend Issues, General Issues, 📄 License, 📋 Prerequisites, 📁 Project Structure (+6 more)

### Community 61 - "RestaurantSubscription"
Cohesion: 0.14
Nodes (10): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate, Setter (+2 more)

### Community 62 - "org.springframework.data.jpa.repository.JpaRepository"
Cohesion: 0.14
Nodes (11): org.springframework.data.jpa.repository.JpaRepository, org.springframework.data.jpa.repository.Modifying, org.springframework.data.jpa.repository.Query, org.springframework.stereotype.Repository, PasswordResetTokenRepository, CategoryRepository, ServiceRequestRepository, OrderItemRepository (+3 more)

### Community 63 - "package.json"
Cohesion: 0.15
Nodes (11): dynamic-theming, responsive, restaurant, vite, author, description, keywords, license (+3 more)

### Community 64 - "Orders.jsx"
Cohesion: 0.29
Nodes (6): OrderFilters(), OrdersHeader(), StatusLegend(), extractList(), initialOrderState, Orders()

### Community 65 - "QRDisplay.jsx"
Cohesion: 0.36
Nodes (3): QRHeader(), QRPreview(), QRStyleSelector()

### Community 66 - "lombok.extern.slf4j.Slf4j"
Cohesion: 0.13
Nodes (15): lombok.extern.slf4j.Slf4j, lombok.RequiredArgsConstructor, org.springframework.mail.javamail.JavaMailSender, org.springframework.messaging.simp.SimpMessagingTemplate, org.springframework.stereotype.Service, org.springframework.web.client.RestTemplate, DashboardServiceImpl, EmailServiceImpl (+7 more)

### Community 67 - "Backend Setup"
Cohesion: 0.17
Nodes (12): 1. Database configuration, 1. Install Dependencies, 2. Environment configuration - Google OAuth, 2. Google OAuth Setup (Required for Login), 3. Backend configuration (optional), 3. Run Development Server, 4. Build and run backend, Backend Setup (+4 more)

### Community 68 - "UPILinks.jsx"
Cohesion: 0.23
Nodes (6): UPICard(), UPIFormModal(), extractList(), UPIGrid(), UPIHeader(), UPITestModal()

### Community 69 - "SubscriptionFeature"
Cohesion: 0.20
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, SubscriptionFeature (+1 more)

### Community 70 - "Code of Conduct"
Cohesion: 0.18
Nodes (10): 📖 Attribution, Code of Conduct, 💻 Contribution Guidelines, 🤝 Expected Behavior, ⚖️ Maintainer Responsibilities, ❤️ Our Goal, 🌟 Our Promise, 📣 Reporting Issues (+2 more)

### Community 71 - "OrderStatus"
Cohesion: 0.18
Nodes (10): Deprecated, OrderStatus, BILLED, CANCELLED, COMPLETED, CONFIRMED, PENDING, PREPARING (+2 more)

### Community 72 - "Branches.jsx"
Cohesion: 0.25
Nodes (5): BranchCard(), TODO: Get this from auth context or restaurant state, BranchesGrid, BranchFormModal(), BranchHeader()

### Community 73 - "CustomUserDetailsService.java"
Cohesion: 0.33
Nodes (4): org.springframework.security.authentication.DisabledException, org.springframework.security.authentication.LockedException, UserDisabledException, UserLockedException

### Community 75 - "Backend Deployment"
Cohesion: 0.20
Nodes (10): Backend Deployment, 🚀 Deployment (Not for Local), Docker Deployment, Frontend Deployment, Option 0: Embedded Tomcat, Option 0: Local (Recommended), Option 1: Docker to Cloud (AWS, GCP, Azure), Option 1: Vercel (+2 more)

### Community 76 - "Section"
Cohesion: 0.20
Nodes (8): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Section

### Community 77 - "RestaurantApplication"
Cohesion: 0.39
Nodes (7): org.springframework.boot.autoconfigure.domain.EntityScan, org.springframework.boot.autoconfigure.SpringBootApplication, org.springframework.boot.web.servlet.support.SpringBootServletInitializer, org.springframework.context.annotation.ComponentScan, org.springframework.data.jpa.repository.config.EnableJpaRepositories, org.springframework.scheduling.annotation.EnableAsync, RestaurantApplication

### Community 78 - "ForgotPassword.jsx"
Cohesion: 0.20
Nodes (5): ForgotPassword(), forgotPasswordSchema, getApiMessage(), resetPasswordSchema, verifyCodeSchema

### Community 79 - "auth.js"
Cohesion: 0.24
Nodes (13): Sidebar(), emptyFeatureForm, emptyPlanForm, pickData(), SubscriptionManagement(), getStoredRoles(), ADMIN_ACCESS_ROLES, FULL_ADMIN_ROLES (+5 more)

### Community 80 - "org.springframework.stereotype.Component"
Cohesion: 0.33
Nodes (4): org.springframework.stereotype.Component, SectionMapper, SiteConfigMapper, ThemeMapper

### Community 81 - "io.swagger.v3.oas.annotations.responses.ApiResponses"
Cohesion: 0.13
Nodes (10): io.swagger.v3.oas.annotations.responses.ApiResponses, DeleteMapping, ResponseStatus, GetMapping, PatchMapping, PostMapping, RestController, ServiceRequestController (+2 more)

### Community 82 - "📋 Development Workflow"
Cohesion: 0.25
Nodes (8): 1. Create a Feature Branch, 2. Make Your Changes, 3. Test Your Changes Locally, 4. Commit Your Changes, 5. Push to Your Fork, 6. Sync Before Creating PR, 7. Create a Pull Request, 📋 Development Workflow

### Community 83 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, deploy, dev, lint, predeploy, preview, tw:init

### Community 84 - "LoginRequest"
Cohesion: 0.33
Nodes (5): AllArgsConstructor, Builder, Data, NoArgsConstructor, LoginRequest

### Community 85 - "Key API Endpoints"
Cohesion: 0.29
Nodes (7): 📚 API Documentation, Categories, Food Items, Key API Endpoints, Menu Management, Orders, Running Swagger UI

### Community 86 - "MenusGrid.jsx"
Cohesion: 0.27
Nodes (8): cardGradients, CategoryMenuSection(), categoryStyleSets, getCardGradient(), getCategoryStyle(), MenuCard(), MenuDetailModal(), MenusGrid

### Community 87 - "UserRoleManagement.jsx"
Cohesion: 0.33
Nodes (4): INITIAL_ASSIGNMENTS, MOCK_RESTAURANTS, MOCK_ROLES, MOCK_USERS

### Community 88 - "SiteConfig"
Cohesion: 0.22
Nodes (8): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, SiteConfig

### Community 89 - "io.swagger.v3.oas.annotations.media.Schema"
Cohesion: 0.16
Nodes (7): io.swagger.v3.oas.annotations.media.Schema, FoodRequestDTO, AllArgsConstructor, Builder, Data, NoArgsConstructor, ServiceRequestDTO

### Community 90 - "📝 Pull Requests"
Cohesion: 0.40
Nodes (5): Before Submitting a PR, Important PR Guidelines, PR Description Template, PR Requirements, 📝 Pull Requests

### Community 92 - "PaymentStatus"
Cohesion: 0.40
Nodes (4): PaymentStatus, CANCELLED, PENDING, SUCCESS

### Community 93 - "✨ Features"
Cohesion: 0.40
Nodes (5): 🚀 Advanced Features (In Development), 📱 Core Features, ✅ Feature Checklist, ✨ Features, 🗺️ Roadmap

### Community 94 - "WhatsappOrderNotificationServiceImpl.java"
Cohesion: 0.29
Nodes (4): org.springframework.beans.factory.annotation.Autowired, org.springframework.boot.web.client.RestTemplateBuilder, WhatsappOrderNotificationServiceImpl, WhatsappOrderNotificationService

### Community 95 - "OrderItem"
Cohesion: 0.12
Nodes (9): OrderItemBuilder, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 96 - "lombok.Builder"
Cohesion: 0.19
Nodes (14): jakarta.persistence.Entity, jakarta.persistence.PrePersist, jakarta.persistence.PreUpdate, jakarta.persistence.Table, lombok.Builder, lombok.Getter, lombok.Setter, RegisterRequest (+6 more)

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

### Community 117 - "RefreshTokenRequest"
Cohesion: 0.33
Nodes (5): AllArgsConstructor, Builder, Data, NoArgsConstructor, RefreshTokenRequest

### Community 127 - "TableResponseDTO"
Cohesion: 0.17
Nodes (11): DeleteMapping, GetMapping, PostMapping, PutMapping, RequestMapping, ResponseStatus, RestController, TableController (+3 more)

### Community 128 - "CategoryResponseDTO"
Cohesion: 0.09
Nodes (20): CategoryController, GetMapping, PostMapping, PutMapping, RequestMapping, ResponseEntity, RestController, CategoryResponseDTO (+12 more)

### Community 129 - "ThemeDTO"
Cohesion: 0.33
Nodes (5): AllArgsConstructor, Builder, Data, NoArgsConstructor, ThemeDTO

### Community 130 - "SiteConfigServiceImpl.java"
Cohesion: 0.17
Nodes (10): com.fasterxml.jackson.databind.ObjectMapper, SectionType, ABOUT, CONTACT, FOOTER, GALLERY, HERO, NAVIGATION (+2 more)

### Community 133 - "SiteConfigServiceImpl"
Cohesion: 0.24
Nodes (4): SiteConfigRepository, Override, SuppressWarnings, SiteConfigServiceImpl

## Knowledge Gaps
- **271 isolated node(s):** `browserGlobals`, `name`, `version`, `description`, `type` (+266 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Branch` connect `Branch` to `lombok.Builder`, `lombok.AllArgsConstructor`, `Menu`, `lombok.extern.slf4j.Slf4j`, `Restaurant`, `Order`, `Category`, `Tables`, `org.springframework.transaction.annotation.Transactional`, `CreateOrderRequest`, `OrderBuilder`, `MenuServiceImpl`, `OrderStatus`, `org.springframework.data.domain.Pageable`, `org.junit.jupiter.api.Test`, `org.springframework.data.jpa.repository.JpaRepository`, `Address`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `Orders.jsx`, `QRDisplay.jsx`, `ContactSection.jsx`, `UPILinks.jsx`, `useWebSocketNotifications.js`, `Branches.jsx`, `AdminSkeleton.jsx`, `ForgotPassword.jsx`, `auth.js`, `routes/index.jsx`, `Profile.jsx`, `ThemeSelector.jsx`, `MenusGrid.jsx`, `UserRoleManagement.jsx`, `Tables.jsx`, `Menus.jsx`, `package.json`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `ResourceNotFoundException` connect `Branch` to `CategoryResponseDTO`, `lombok.extern.slf4j.Slf4j`, `FoodServiceImpl`, `ApiErrorResponse`, `OrderController.java`, `SiteConfigServiceImpl.java`, `SiteConfigServiceImpl`, `Restaurant`, `User`, `AuthServiceImpl.java`, `UpiLinkResponseDTO`, `TableServiceImpl`, `org.springframework.transaction.annotation.Transactional`, `CreateOrderRequest`, `OrderServiceImpl`, `MenuServiceImpl`, `org.junit.jupiter.api.Test`, `Address`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `browserGlobals`, `name`, `version` to the rest of the system?**
  _271 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lombok.AllArgsConstructor` be split into smaller, more focused modules?**
  _Cohesion score 0.1404040404040404 - nodes in this community are weakly interconnected._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.06487434248977206 - nodes in this community are weakly interconnected._
- **Should `ApiErrorResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.11989795918367346 - nodes in this community are weakly interconnected._
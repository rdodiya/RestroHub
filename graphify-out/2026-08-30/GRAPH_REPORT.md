# Graph Report - RestroHub  (2026-08-30)

## Corpus Check
- 320 files · ~145,741 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2264 nodes · 5676 edges · 132 communities (109 shown, 23 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 369 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aa98c817`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- lombok.Builder
- org.junit.jupiter.api.Test
- AuthServiceImpl.java
- SecurityConfig.java
- ApiErrorResponse
- OrderResponse
- RestaurantResponseDTO
- io.swagger.v3.oas.annotations.Operation
- UserController
- Order
- CategoryResponseDTO
- User
- Category
- 🍽️ Restroly - Digital Menu & Restaurant Management Platform
- react
- OrderItemResponse
- CreateOrderRequest
- OrderBuilder
- lombok.extern.slf4j.Slf4j
- FoodResponseDTO
- Profile.jsx
- ThemeSelector.jsx
- ServiceRequestResponseDTO
- org.springframework.security.access.prepost.PreAuthorize
- 📘 Project Details — Restroly
- devDependencies
- dependencies
- Address
- RoleResponse
- Menus.jsx
- org.springframework.transaction.annotation.Transactional
- MenuController
- org.springframework.data.domain.Pageable
- 📌 Restroly FrontEnd
- Restaurant
- Menu
- Branch
- FoodServiceImpl
- MenuMapper
- AuthController.java
- BranchServiceImpl.java
- OrderController.java
- CustomUserDetailsService.java
- 🤝 Contributing to Restroly
- AdminSkeleton.jsx
- SubscriptionPlan
- ApiResponse
- Food
- org.springframework.web.servlet.mvc.method.annotation.SseEmitter
- routes/index.jsx
- MenuResponseDTO
- 🤝 Contributing to RestroHub
- SubscriptionServiceImpl
- OrderStatus
- org.springframework.http.ResponseEntity
- Tables.jsx
- DashboardStatDTO
- auth.js
- PlanFeatureMapping
- org.springframework.data.jpa.repository.JpaRepository
- 🍽️ Restroly - Digital Menu & Restaurant Management Platform
- RestaurantSubscription
- SectionType
- package.json
- Orders.jsx
- SiteConfigServiceImpl
- WhatsappServiceImpl
- Backend Setup
- UPILinks.jsx
- Tables
- Code of Conduct
- OrderStatus
- Branches.jsx
- Theme
- org.springframework.stereotype.Component
- Backend Deployment
- SiteConfig
- RestaurantApplication
- ForgotPassword.jsx
- Login.jsx
- Register.jsx
- io.swagger.v3.oas.annotations.media.Schema
- 📋 Development Workflow
- scripts
- BranchService
- Key API Endpoints
- MenusGrid.jsx
- UserRoleManagement.jsx
- CategoryController
- ThemeDTO
- 📝 Pull Requests
- ApiService.js
- .getActiveCategories
- ✨ Features
- App.jsx
- BranchMapper
- 🤝 Contributing
- 🏗️ Tech Stack
- 📞 Contact & Support
- useAuth.js
- useWebSocketNotifications.js
- gradlew
- RestaurantMenu.jsx
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
- GenericMapper
- OrderItemBuilder
- data/defaultData.js
- .deleteFood
- .deleteRestaurant
- .deleteTable

## God Nodes (most connected - your core abstractions)
1. `react` - 73 edges
2. `Branch` - 64 edges
3. `OrderResponse` - 62 edges
4. `ResourceNotFoundException` - 56 edges
5. `Food` - 48 edges
6. `PageResponseDTO` - 45 edges
7. `MenuResponseDTO` - 42 edges
8. `BranchResponseDTO` - 41 edges
9. `Order` - 40 edges
10. `Restaurant` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Header()` --calls--> `clearAuthSession()`  [EXTRACTED]
  RestroHub-FrontEnd/src/components/admin/Header.jsx → RestroHub-FrontEnd/src/services/common/authStorage.js
- `TablesGrid()` --indirect_call--> `normalizeTable()`  [INFERRED]
  RestroHub-FrontEnd/src/components/admin/store/tables/TablesGrid.jsx → RestroHub-FrontEnd/src/components/admin/store/tables/tableMapper.js
- `readStoredRoles()` --calls--> `getStoredRoles()`  [EXTRACTED]
  RestroHub-FrontEnd/src/utils/auth.js → RestroHub-FrontEnd/src/services/common/authStorage.js
- `Address` --references--> `Branch`  [EXTRACTED]
  RestroHub/src/main/java/com/restroly/qrmenu/address/entity/Address.java → RestroHub/src/main/java/com/restroly/qrmenu/branch/entity/Branch.java
- `DashboardServiceImpl` --implements--> `DashboardService`  [EXTRACTED]
  RestroHub/src/main/java/com/restroly/qrmenu/admin/dashboard/service/DashboardServiceImpl.java → RestroHub/src/main/java/com/restroly/qrmenu/admin/dashboard/service/DashboardService.java

## Import Cycles
- None detected.

## Communities (132 total, 23 thin omitted)

### Community 0 - "lombok.Builder"
Cohesion: 0.14
Nodes (25): com.fasterxml.jackson.annotation.JsonInclude, lombok.AllArgsConstructor, lombok.Builder, lombok.Data, lombok.NoArgsConstructor, GoogleAuthRequest, AddressDTO, BranchRequestDTO (+17 more)

### Community 1 - "org.junit.jupiter.api.Test"
Cohesion: 0.05
Nodes (27): jakarta.validation.Validator, jakarta.validation.ValidatorFactory, org.junit.jupiter.api.AfterAll, org.junit.jupiter.api.BeforeAll, org.junit.jupiter.api.BeforeEach, org.junit.jupiter.api.extension.ExtendWith, org.junit.jupiter.api.Test, org.junit.jupiter.params.ParameterizedTest (+19 more)

### Community 2 - "AuthServiceImpl.java"
Cohesion: 0.12
Nodes (15): jakarta.annotation.PostConstruct, jakarta.servlet.FilterChain, jakarta.servlet.http.HttpServletResponse, javax.crypto.SecretKey, org.springframework.security.core.Authentication, org.springframework.security.core.userdetails.UserDetails, org.springframework.security.core.userdetails.UserDetailsService, org.springframework.security.crypto.password.PasswordEncoder (+7 more)

### Community 3 - "SecurityConfig.java"
Cohesion: 0.10
Nodes (24): io.swagger.v3.oas.annotations.security.SecurityScheme, io.swagger.v3.oas.models.OpenAPI, OpenAPI, org.springframework.boot.context.properties.EnableConfigurationProperties, org.springframework.context.annotation.Bean, org.springframework.context.annotation.Configuration, org.springframework.messaging.simp.config.MessageBrokerRegistry, org.springframework.security.authentication.AuthenticationManager (+16 more)

### Community 4 - "ApiErrorResponse"
Cohesion: 0.11
Nodes (28): jakarta.servlet.http.HttpServletRequest, jakarta.validation.ConstraintViolation, jakarta.validation.ConstraintViolationException, lombok.Getter, org.springframework.dao.DataIntegrityViolationException, org.springframework.http.converter.HttpMessageNotReadableException, org.springframework.http.HttpStatus, org.springframework.security.access.AccessDeniedException (+20 more)

### Community 5 - "OrderResponse"
Cohesion: 0.08
Nodes (5): org.springframework.scheduling.annotation.Async, org.springframework.web.bind.annotation.PatchMapping, OrderResponse, OrderService, WhatsappOrderNotificationService

### Community 6 - "RestaurantResponseDTO"
Cohesion: 0.08
Nodes (22): ResourceAlreadyExistsException, GetMapping, AllArgsConstructor, Builder, Data, NoArgsConstructor, RestaurantRequestDTO, AllArgsConstructor (+14 more)

### Community 7 - "io.swagger.v3.oas.annotations.Operation"
Cohesion: 0.12
Nodes (14): io.swagger.v3.oas.annotations.Operation, io.swagger.v3.oas.annotations.responses.ApiResponses, BranchController, GetMapping, PostMapping, PutMapping, RequestMapping, RestController (+6 more)

### Community 8 - "UserController"
Cohesion: 0.10
Nodes (9): DeleteMapping, GetMapping, PatchMapping, PostMapping, PutMapping, RequestMapping, RestController, UserController (+1 more)

### Community 9 - "Order"
Cohesion: 0.09
Nodes (15): Override, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, Setter (+7 more)

### Community 10 - "CategoryResponseDTO"
Cohesion: 0.15
Nodes (8): PutMapping, CategoryResponseDTO, AllArgsConstructor, Builder, Data, NoArgsConstructor, CategoryServiceImpl, Override

### Community 11 - "User"
Cohesion: 0.09
Nodes (14): UserResponse, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate (+6 more)

### Community 12 - "Category"
Cohesion: 0.07
Nodes (10): Category, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PreUpdate, Setter (+2 more)

### Community 13 - "🍽️ Restroly - Digital Menu & Restaurant Management Platform"
Cohesion: 0.05
Nodes (41): 🎯 About, 🙏 Acknowledgments, 📊 Additional Features, 🔄 Aggregator Integration, Aggregator Sync, 🌍 AI Menu Translation, AI Menu Translation, ☕ Backend Setup (Java / Spring Boot) (+33 more)

### Community 14 - "react"
Cohesion: 0.06
Nodes (8): react, KanbanBoard(), OrderCard(), QRHeader(), QRPreview(), QRStyleSelector(), styles, ThemeContext

### Community 15 - "OrderItemResponse"
Cohesion: 0.06
Nodes (11): OrderItemResponse, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+3 more)

### Community 16 - "CreateOrderRequest"
Cohesion: 0.10
Nodes (3): OrderDirector, CreateOrderRequest, OrderItemRequest

### Community 17 - "OrderBuilder"
Cohesion: 0.24
Nodes (3): OrderBuilder, Override, OrderBuilderImpl

### Community 18 - "lombok.extern.slf4j.Slf4j"
Cohesion: 0.13
Nodes (25): io.swagger.v3.oas.annotations.tags.Tag, lombok.extern.slf4j.Slf4j, lombok.RequiredArgsConstructor, org.springframework.messaging.simp.SimpMessagingTemplate, org.springframework.stereotype.Service, org.springframework.validation.annotation.Validated, DashboardServiceImpl, ApiConstants (+17 more)

### Community 19 - "FoodResponseDTO"
Cohesion: 0.09
Nodes (15): GetMapping, PostMapping, PutMapping, FoodRequestDTO, FoodResponseDTO, AllArgsConstructor, Builder, Data (+7 more)

### Community 20 - "Profile.jsx"
Cohesion: 0.10
Nodes (18): Header(), TODO: Replace hardcoded branchId with actual branch from auth context, PersonalInfoCard(), ProfileHeader(), ProfileImageModal(), ProfileSidebar(), ProfileSkeleton(), RestaurantInfoCard() (+10 more)

### Community 21 - "ThemeSelector.jsx"
Cohesion: 0.11
Nodes (16): fileToBase64(), SectionEditor(), COLOR_FIELDS, FONT_BODY_OPTIONS, FONT_HEADING_OPTIONS, ThemeSelector(), Website(), WebsiteHeader() (+8 more)

### Community 22 - "ServiceRequestResponseDTO"
Cohesion: 0.07
Nodes (27): org.mapstruct.Mapper, GetMapping, AllArgsConstructor, Builder, Data, NoArgsConstructor, ServiceRequestDTO, AllArgsConstructor (+19 more)

### Community 23 - "org.springframework.security.access.prepost.PreAuthorize"
Cohesion: 0.09
Nodes (16): org.springframework.security.access.prepost.PreAuthorize, GetMapping, RequestMapping, RestController, RestaurantSubscriptionController, DeleteMapping, GetMapping, PostMapping (+8 more)

### Community 24 - "📘 Project Details — Restroly"
Cohesion: 0.07
Nodes (27): 1) Public Customer Flow, 2) Admin / Manager Flow, 🌐 API Structure, 🏗️ Architecture, AUTH APIS, 🔄 Business Flow, Business Rules, 🧩 Core Features (+19 more)

### Community 25 - "devDependencies"
Cohesion: 0.07
Nodes (27): autoprefixer, eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, gh-pages, postcss, devDependencies (+19 more)

### Community 26 - "dependencies"
Cohesion: 0.07
Nodes (27): formik, @headlessui/react, lenis, lucide-react, react, react-hot-toast, react-icons, @react-oauth/google (+19 more)

### Community 27 - "Address"
Cohesion: 0.18
Nodes (3): Address, AddressRepository, AddressDTO

### Community 28 - "RoleResponse"
Cohesion: 0.08
Nodes (19): org.slf4j.Logger, org.springframework.boot.ApplicationArguments, org.springframework.boot.ApplicationRunner, RoleRequest, RoleResponse, AllArgsConstructor, Builder, Entity (+11 more)

### Community 29 - "Menus.jsx"
Cohesion: 0.13
Nodes (13): BulkActions(), CategoryFormModal(), CategorySidebar(), getErrorMessage(), MenuItemCard(), ACCEPTED_IMAGE_TYPES, getErrorMessage(), MenuFormModal() (+5 more)

### Community 30 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.21
Nodes (5): org.springframework.transaction.annotation.Transactional, BranchServiceImpl, Override, ResourceNotFoundException, PaymentNotFoundException

### Community 31 - "MenuController"
Cohesion: 0.13
Nodes (8): DeleteMapping, GetMapping, PatchMapping, RequestMapping, ResponseStatus, RestController, MenuController, MenuService

### Community 32 - "org.springframework.data.domain.Pageable"
Cohesion: 0.12
Nodes (4): org.springframework.data.domain.Page, org.springframework.data.domain.Pageable, CategoryService, PageResponseDTO

### Community 33 - "📌 Restroly FrontEnd"
Cohesion: 0.08
Nodes (24): 1. Navigate to Frontend Directory, 2. Install Dependencies, 3. Environment Configuration, ⭐ About Restroly, 🌐 Backend Integration, 🛒 Cart & Order, 📞 Contact, 👍 Contributing (+16 more)

### Community 34 - "Restaurant"
Cohesion: 0.08
Nodes (23): org.springframework.boot.CommandLineRunner, DatabaseInitializer, Override, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor (+15 more)

### Community 35 - "Menu"
Cohesion: 0.11
Nodes (11): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Menu (+3 more)

### Community 36 - "Branch"
Cohesion: 0.16
Nodes (6): jakarta.persistence.Entity, jakarta.persistence.PrePersist, jakarta.persistence.PreUpdate, jakarta.persistence.Table, Branch, BranchRepository

### Community 37 - "FoodServiceImpl"
Cohesion: 0.16
Nodes (8): com.cloudinary.Cloudinary, org.springframework.cache.annotation.Cacheable, org.springframework.cache.annotation.CacheEvict, org.springframework.web.multipart.MultipartFile, CloudinaryService, FoodMapper, FoodServiceImpl, Override

### Community 39 - "AuthController.java"
Cohesion: 0.10
Nodes (19): io.swagger.v3.oas.annotations.parameters.RequestBody, lombok.Setter, AuthResponse, AllArgsConstructor, Builder, Data, NoArgsConstructor, AllArgsConstructor (+11 more)

### Community 40 - "BranchServiceImpl.java"
Cohesion: 0.22
Nodes (4): org.springframework.web.bind.annotation.ResponseStatus, DuplicateResourceException, RoleNotFoundException, UserNotFoundException

### Community 41 - "OrderController.java"
Cohesion: 0.29
Nodes (7): org.springframework.web.bind.annotation.CrossOrigin, org.springframework.web.bind.annotation.GetMapping, org.springframework.web.bind.annotation.RequestMapping, org.springframework.web.bind.annotation.RestController, HomeController, DashboardNotificationController, OrderController

### Community 42 - "CustomUserDetailsService.java"
Cohesion: 0.13
Nodes (9): jakarta.transaction.Transactional, org.springframework.core.io.Resource, org.springframework.security.authentication.DisabledException, org.springframework.security.authentication.LockedException, PaymentService, CustomUserDetailsService, Override, UserDisabledException (+1 more)

### Community 43 - "🤝 Contributing to Restroly"
Cohesion: 0.11
Nodes (18): 1️⃣ Fork the Repository, 2️⃣ Clone Your Fork, 3️⃣ Create a Feature Branch, 4️⃣ Make Your Changes, 5️⃣ Run the Application & Tests, 6️⃣ Commit Your Changes, 7️⃣ Push to Your Fork, 8️⃣ Open a Pull Request (+10 more)

### Community 44 - "AdminSkeleton.jsx"
Cohesion: 0.11
Nodes (11): AdminSkeleton(), LiveOrders(), QuickActions(), RevenueChart(), StatsSection(), actionConfig, formatAmount(), formatTime() (+3 more)

### Community 45 - "SubscriptionPlan"
Cohesion: 0.14
Nodes (11): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate, Setter (+3 more)

### Community 46 - "ApiResponse"
Cohesion: 0.27
Nodes (7): org.springframework.web.bind.annotation.PostMapping, AuthController, ApiResponse, AllArgsConstructor, Builder, Data, NoArgsConstructor

### Community 47 - "Food"
Cohesion: 0.10
Nodes (15): org.hibernate.annotations.SQLDelete, org.hibernate.annotations.SQLRestriction, CategoryDTO, Food, AllArgsConstructor, Builder, Entity, EqualsAndHashCode (+7 more)

### Community 48 - "org.springframework.web.servlet.mvc.method.annotation.SseEmitter"
Cohesion: 0.24
Nodes (5): org.springframework.web.servlet.mvc.method.annotation.SseEmitter, AbstractSseNotificationService, Override, SseEmitter, SseGenericNotificationService

### Community 49 - "routes/index.jsx"
Cohesion: 0.17
Nodes (9): AdminLayout(), CustomerLayout(), PublicLayout(), Landing(), NotFound(), PrivacyPolicy(), RefundPolicy(), AdminRoute() (+1 more)

### Community 50 - "MenuResponseDTO"
Cohesion: 0.18
Nodes (7): PostMapping, PutMapping, MenuRequestDTO, MenuResponseDTO, PatchMapping, SiteConfigDTO, UpdateSiteConfigRequest

### Community 51 - "🤝 Contributing to RestroHub"
Cohesion: 0.12
Nodes (15): Backend (Java), Before Creating a New Issue, 🎨 Code Style Guidelines, 💬 Commit Messages, 🤝 Contributing to RestroHub, Creating Issues, Frontend (React/JavaScript), 🚀 Getting Started (+7 more)

### Community 52 - "SubscriptionServiceImpl"
Cohesion: 0.19
Nodes (5): PutMapping, SubscriptionPlanDto, SubscriptionPlanRequest, Override, SubscriptionServiceImpl

### Community 53 - "OrderStatus"
Cohesion: 0.14
Nodes (10): OrderStatus, BILLED, CANCELLED, COMPLETED, CONFIRMED, PENDING, PREPARING, READY (+2 more)

### Community 54 - "org.springframework.http.ResponseEntity"
Cohesion: 0.16
Nodes (10): org.springframework.http.ResponseEntity, GetMapping, DeleteMapping, GetMapping, PatchMapping, PostMapping, PutMapping, RequestMapping (+2 more)

### Community 55 - "Tables.jsx"
Cohesion: 0.19
Nodes (7): TableCard(), TableFormModal(), normalizeTable(), TableQRModal(), TablesGrid(), TablesHeader(), TablesStatusLegend()

### Community 56 - "DashboardStatDTO"
Cohesion: 0.17
Nodes (11): DashboardController, CrossOrigin, GetMapping, RequestMapping, RestController, DashboardStatDTO, AllArgsConstructor, Builder (+3 more)

### Community 57 - "auth.js"
Cohesion: 0.26
Nodes (12): Sidebar(), emptyFeatureForm, emptyPlanForm, pickData(), SubscriptionManagement(), ADMIN_ACCESS_ROLES, FULL_ADMIN_ROLES, getDefaultAdminPath() (+4 more)

### Community 58 - "PlanFeatureMapping"
Cohesion: 0.09
Nodes (17): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, PlanFeatureMapping (+9 more)

### Community 59 - "org.springframework.data.jpa.repository.JpaRepository"
Cohesion: 0.17
Nodes (9): org.springframework.data.jpa.repository.JpaRepository, org.springframework.data.jpa.repository.Modifying, org.springframework.data.jpa.repository.Query, org.springframework.stereotype.Repository, CategoryRepository, ServiceRequestRepository, RestaurantSubscriptionRepository, SubscriptionFeatureRepository (+1 more)

### Community 60 - "🍽️ Restroly - Digital Menu & Restaurant Management Platform"
Cohesion: 0.14
Nodes (14): 🎯 About, 🙏 Acknowledgments, Backend Issues, Frontend Issues, General Issues, 📄 License, 📋 Prerequisites, 📁 Project Structure (+6 more)

### Community 61 - "RestaurantSubscription"
Cohesion: 0.14
Nodes (10): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate, Setter (+2 more)

### Community 62 - "SectionType"
Cohesion: 0.13
Nodes (14): GetMapping, RequestMapping, RestController, PublicSiteController, SectionType, ABOUT, CONTACT, FOOTER (+6 more)

### Community 63 - "package.json"
Cohesion: 0.15
Nodes (11): dynamic-theming, responsive, restaurant, vite, author, description, keywords, license (+3 more)

### Community 64 - "Orders.jsx"
Cohesion: 0.31
Nodes (4): OrderFilters(), OrdersHeader(), StatusLegend(), initialOrderState

### Community 65 - "SiteConfigServiceImpl"
Cohesion: 0.26
Nodes (3): Override, SuppressWarnings, SiteConfigServiceImpl

### Community 66 - "WhatsappServiceImpl"
Cohesion: 0.24
Nodes (6): org.springframework.beans.factory.annotation.Autowired, org.springframework.boot.web.client.RestTemplateBuilder, org.springframework.web.client.RestTemplate, WhatsappOrderNotificationServiceImpl, WhatsappServiceImpl, WhatsappService

### Community 67 - "Backend Setup"
Cohesion: 0.17
Nodes (12): 1. Database configuration, 1. Install Dependencies, 2. Environment configuration - Google OAuth, 2. Google OAuth Setup (Required for Login), 3. Backend configuration (optional), 3. Run Development Server, 4. Build and run backend, Backend Setup (+4 more)

### Community 68 - "UPILinks.jsx"
Cohesion: 0.24
Nodes (5): UPICard(), UPIFormModal(), UPIGrid(), UPIHeader(), UPITestModal()

### Community 69 - "Tables"
Cohesion: 0.12
Nodes (10): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, PreUpdate, Setter (+2 more)

### Community 70 - "Code of Conduct"
Cohesion: 0.18
Nodes (10): 📖 Attribution, Code of Conduct, 💻 Contribution Guidelines, 🤝 Expected Behavior, ⚖️ Maintainer Responsibilities, ❤️ Our Goal, 🌟 Our Promise, 📣 Reporting Issues (+2 more)

### Community 71 - "OrderStatus"
Cohesion: 0.18
Nodes (10): Deprecated, OrderStatus, BILLED, CANCELLED, COMPLETED, CONFIRMED, PENDING, PREPARING (+2 more)

### Community 72 - "Branches.jsx"
Cohesion: 0.25
Nodes (5): BranchCard(), TODO: Get this from auth context or restaurant state, BranchesGrid, BranchFormModal(), BranchHeader()

### Community 73 - "Theme"
Cohesion: 0.18
Nodes (10): AllArgsConstructor, Builder, Data, Entity, EqualsAndHashCode, Getter, NoArgsConstructor, Setter (+2 more)

### Community 74 - "org.springframework.stereotype.Component"
Cohesion: 0.43
Nodes (4): org.springframework.stereotype.Component, SectionMapper, SiteConfigMapper, ThemeMapper

### Community 75 - "Backend Deployment"
Cohesion: 0.20
Nodes (10): Backend Deployment, 🚀 Deployment (Not for Local), Docker Deployment, Frontend Deployment, Option 0: Embedded Tomcat, Option 0: Local (Recommended), Option 1: Docker to Cloud (AWS, GCP, Azure), Option 1: Vercel (+2 more)

### Community 76 - "SiteConfig"
Cohesion: 0.11
Nodes (17): com.fasterxml.jackson.databind.ObjectMapper, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+9 more)

### Community 77 - "RestaurantApplication"
Cohesion: 0.39
Nodes (7): org.springframework.boot.autoconfigure.domain.EntityScan, org.springframework.boot.autoconfigure.SpringBootApplication, org.springframework.boot.web.servlet.support.SpringBootServletInitializer, org.springframework.context.annotation.ComponentScan, org.springframework.data.jpa.repository.config.EnableJpaRepositories, org.springframework.scheduling.annotation.EnableAsync, RestaurantApplication

### Community 78 - "ForgotPassword.jsx"
Cohesion: 0.25
Nodes (4): ForgotPassword(), forgotPasswordSchema, getApiMessage(), resetPasswordSchema

### Community 81 - "io.swagger.v3.oas.annotations.media.Schema"
Cohesion: 0.28
Nodes (6): io.swagger.v3.oas.annotations.media.Schema, PostMapping, PutMapping, TableRequestDTO, TableResponseDTO, TableService

### Community 82 - "📋 Development Workflow"
Cohesion: 0.25
Nodes (8): 1. Create a Feature Branch, 2. Make Your Changes, 3. Test Your Changes Locally, 4. Commit Your Changes, 5. Push to Your Fork, 6. Sync Before Creating PR, 7. Create a Pull Request, 📋 Development Workflow

### Community 83 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, deploy, dev, lint, predeploy, preview, tw:init

### Community 84 - "BranchService"
Cohesion: 0.20
Nodes (4): DeleteMapping, PatchMapping, ResponseStatus, BranchService

### Community 85 - "Key API Endpoints"
Cohesion: 0.29
Nodes (7): 📚 API Documentation, Categories, Food Items, Key API Endpoints, Menu Management, Orders, Running Swagger UI

### Community 86 - "MenusGrid.jsx"
Cohesion: 0.31
Nodes (7): cardGradients, CategoryMenuSection(), categoryStyleSets, getCardGradient(), getCategoryStyle(), MenuCard(), MenuDetailModal()

### Community 87 - "UserRoleManagement.jsx"
Cohesion: 0.33
Nodes (4): INITIAL_ASSIGNMENTS, MOCK_RESTAURANTS, MOCK_ROLES, MOCK_USERS

### Community 88 - "CategoryController"
Cohesion: 0.20
Nodes (6): CategoryController, DeleteMapping, PostMapping, RequestMapping, ResponseEntity, RestController

### Community 89 - "ThemeDTO"
Cohesion: 0.33
Nodes (5): AllArgsConstructor, Builder, Data, NoArgsConstructor, ThemeDTO

### Community 90 - "📝 Pull Requests"
Cohesion: 0.40
Nodes (5): Before Submitting a PR, Important PR Guidelines, PR Description Template, PR Requirements, 📝 Pull Requests

### Community 92 - ".getActiveCategories"
Cohesion: 0.27
Nodes (6): GetMapping, AllArgsConstructor, Builder, Data, NoArgsConstructor, PagedResponse

### Community 93 - "✨ Features"
Cohesion: 0.40
Nodes (5): 🚀 Advanced Features (In Development), 📱 Core Features, ✅ Feature Checklist, ✨ Features, 🗺️ Roadmap

### Community 94 - "App.jsx"
Cohesion: 0.50
Nodes (3): App(), root, AppRoutes()

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

## Knowledge Gaps
- **270 isolated node(s):** `browserGlobals`, `name`, `version`, `description`, `type` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Branch` connect `Branch` to `lombok.Builder`, `org.junit.jupiter.api.Test`, `ApiErrorResponse`, `Order`, `Category`, `OrderItemResponse`, `CreateOrderRequest`, `OrderBuilder`, `lombok.extern.slf4j.Slf4j`, `Address`, `org.springframework.transaction.annotation.Transactional`, `org.springframework.data.domain.Pageable`, `Restaurant`, `Menu`, `MenuMapper`, `AuthController.java`, `BranchServiceImpl.java`, `Food`, `MenuResponseDTO`, `org.springframework.data.jpa.repository.JpaRepository`, `Tables`, `io.swagger.v3.oas.annotations.media.Schema`, `BranchMapper`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `Profile.jsx`, `ThemeSelector.jsx`, `Menus.jsx`, `AdminSkeleton.jsx`, `routes/index.jsx`, `Tables.jsx`, `auth.js`, `package.json`, `Orders.jsx`, `UPILinks.jsx`, `Branches.jsx`, `ForgotPassword.jsx`, `Login.jsx`, `Register.jsx`, `MenusGrid.jsx`, `UserRoleManagement.jsx`, `App.jsx`, `ContactSection.jsx`, `useWebSocketNotifications.js`, `RestaurantMenu.jsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `Restaurant` connect `Restaurant` to `BranchMapper`, `AuthServiceImpl.java`, `Menu`, `Branch`, `RestaurantResponseDTO`, `BranchServiceImpl.java`, `User`, `ServiceRequestResponseDTO`, `org.springframework.data.jpa.repository.JpaRepository`, `RoleResponse`, `RestaurantSubscription`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `browserGlobals`, `name`, `version` to the rest of the system?**
  _270 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lombok.Builder` be split into smaller, more focused modules?**
  _Cohesion score 0.14343434343434344 - nodes in this community are weakly interconnected._
- **Should `org.junit.jupiter.api.Test` be split into smaller, more focused modules?**
  _Cohesion score 0.05253077975376197 - nodes in this community are weakly interconnected._
- **Should `AuthServiceImpl.java` be split into smaller, more focused modules?**
  _Cohesion score 0.11553030303030302 - nodes in this community are weakly interconnected._
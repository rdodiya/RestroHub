# 🤝 Contributing to RestroHub

We welcome contributions! Please follow these simple guidelines.

**Quick Links**
- [Getting Started](#-getting-started)
- [Commit Messages](#-commit-messages)
- [Pull Requests](#-pull-requests)
- [Code Style](#-code-style)
- [Need Help?](#-need-help)

---

## 🚀 Getting Started

### Prerequisites

Before you start contributing, ensure you have:

1. **Fork the Repository**
   - Click the "Fork" button on [GitHub](https://github.com/rdodiya/RestroHub)

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/RestroHub.git
   cd RestroHub
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/rdodiya/RestroHub.git
   ```

4. **Install Dependencies**
   
   **For Backend:**
   ```bash
   cd RestroHub
   ./gradlew build
   ```
   
   **For Frontend:**
   ```bash
   cd RestroHub-FrontEnd
   npm install
   ```

5. **Set Up Local Environment**
   - Follow the setup instructions in [ReadMe.md](ReadMe.md#-quick-start)
   - Ensure both backend and frontend run locally without errors

---

## 📋 Development Workflow

### 1. Create a Feature Branch

Always create a new branch from gssoc_develop for your work:

```bash
# Update gssoc_develop branch
git checkout gssoc_develop
git pull upstream gssoc_develop

# Create feature branch
git checkout -b feature/your-feature-name gssoc_develop

# Or for bug fixes
git checkout -b fix/bug-description gssoc_develop

# Or for documentation
git checkout -b docs/description gssoc_develop
```

### 2. Make Your Changes

- Write clean, readable code
- Add comments for complex logic
- Keep changes focused and atomic
- Don't mix multiple features in one branch

### 3. Test Your Changes Locally

**Backend:**
```bash
cd RestroHub

# Build project
./gradlew clean build

# Run tests
./gradlew test

# Run application (requires PostgreSQL; see README)
./gradlew bootRun
```

**Frontend:**
```bash
cd RestroHub-FrontEnd

# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Lint (no unit test script in package.json yet)
npm run lint
```

### 4. Commit Your Changes

Follow our commit message conventions (see below)

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Open the PR against the **`gssoc_develop`** branch on the upstream repository (not `main`, unless maintainers ask otherwise). See [Pull Requests](#-pull-requests) for the description template.

---

---

## 💬 Commit Messages

Use conventional commits format: `type(scope): description`

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```
feat(menu): add category filter
fix(api): resolve food item endpoint
docs(readme): update setup instructions
```

---

## 📝 Pull Requests

**Before Submitting:**
- [ ] Code works locally
- [ ] Clear commit messages
- [ ] No unnecessary changes

**PR Description (Simple):**
```markdown
## What changed?
Brief summary of changes.

## Type
- [x] New feature / [ ] Bug fix / [ ] Documentation

## Testing
Tested locally - working as expected

## Additional notes
Anything else reviewers should know.
```

### PR Requirements

- **Title** must follow commit conventions
- **Description** must be clear and detailed
- **Manual verification**: run backend and frontend locally when your change affects behavior (automated tests are not fully wired yet; `./gradlew test` is currently disabled in `build.gradle`)
- **No breaking changes** without discussion (or marked as `BREAKING CHANGE`)
- **Code reviewed** by yourself first (self-review)

---

## 🎨 Code Style Guidelines

### Backend (Java)

**Naming Conventions:**
- Classes: `PascalCase` (e.g., `MenuController`, `FoodService`)
- Methods: `camelCase` (e.g., `getFoodById`, `createMenu`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_ITEMS_PER_PAGE`)
- Packages: `lowercase.hierarchical` (e.g., `com.restroly.service`)

**Code Format:**
```java
// Use 4 spaces for indentation
public class MenuController {
    
    private final MenuService menuService;
    
    // Constructor injection preferred
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }
    
    // Meaningful names
    @GetMapping("/{id}")
    public ResponseEntity<MenuDTO> getMenuById(@PathVariable Long id) {
        Menu menu = menuService.findById(id);
        return ResponseEntity.ok(new MenuDTO(menu));
    }
    
    // Add comments for complex logic
    @PostMapping
    public ResponseEntity<MenuDTO> createMenu(@RequestBody CreateMenuRequest request) {
        // Validate input before processing
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Menu name cannot be empty");
        }
        
        Menu menu = menuService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new MenuDTO(menu));
    }
}
```

**Best Practices:**
- Use Spring dependency injection
- Leverage annotations properly
- Return DTOs instead of entities
- Use meaningful variable names
- Keep methods focused and small
- Add JavaDoc for public APIs
- Use enums for fixed values
- Avoid null checks; use Optional

### Frontend (React/JavaScript)

**Naming Conventions:**
- Components: `PascalCase` (e.g., `MenuCard`, `FoodItem`)
- Files: `PascalCase` for components (e.g., `MenuCard.jsx`)
- Hooks: `camelCase` prefixed with `use` (e.g., `useMenu`, `useFetch`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_ITEMS`)
- Functions: `camelCase` (e.g., `handleClick`, `formatPrice`)

**Code Format:**
```jsx
// Use 2 spaces for indentation
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuCard = ({ menuId, onSelect }) => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/menus/${menuId}`);
        setMenu(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="menu-card">
      <h2>{menu.name}</h2>
      <p>{menu.description}</p>
      <button onClick={() => onSelect(menu)}>
        View Menu
      </button>
    </div>
  );
};

export default MenuCard;
```

**Best Practices:**
- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use descriptive variable names
- Add propTypes or TypeScript for validation
- Use CSS classes from Tailwind
- Handle loading and error states
- Comment complex logic

---

## ❓ Need Help?



### Getting Stuck?

1. **Read the Documentation**
   - Check [ReadMe.md](ReadMe.md)
   - Review existing code patterns
   - Check past PR discussions

2. **Ask for Help**
   - Comment on the issue you're working on
   - Create a draft PR and ask questions

3. **Contact Maintainers**
   - GitHub Issues for technical questions
   - Email: rdodiya2601@gmail.com
   - LinkedIn: [@rdodiya](https://www.linkedin.com/in/rdodiya/)


---

### Useful Resources

- 📚 [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- ⚛️ [React Documentation](https://react.dev)
- 🎨 [Tailwind CSS Documentation](https://tailwindcss.com)
- 🔧 [Git Documentation](https://git-scm.com/doc)
- 📋 [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎉 Thank You!

Thank you for contributing to RestroHub! Your efforts help make this project better for everyone.

**Happy coding!** 🚀




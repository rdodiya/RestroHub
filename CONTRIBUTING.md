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

##  Creating Issues

### Before Creating a New Issue

**Always check existing issues first** to avoid duplicates:
1. Search the [Issues page](https://github.com/rdodiya/RestroHub/issues) using relevant keywords
2. Check both open and closed issues
3. If a similar issue exists, comment on it instead of creating a new one

### Issue Requirements

**Every issue must include:**

- **Clear Title**: Describe the feature/bug concisely
- **Detailed Description**: Provide enough context for others to understand the issue
  - What is the problem/feature request?
  - Why is it needed?
  - Expected vs. actual behavior (for bugs)
  - Steps to reproduce (for bugs)
- **Scope**: Clearly mention which part can be changed:
  - `[FRONTEND ONLY]` - React/Tailwind changes only
  - `[BACKEND ONLY]` - Java/Spring Boot changes only
  - `[FULL STACK]` - Both frontend and backend changes
- **Expected Outcome**: What should be the result after implementation?

### Issue Assignment

- **Maximum 2 people per issue** - One primary contributor and one reviewer
- **No duplicate assignments** - Each issue is assigned only once
- Maintainers will assign issues; contributors should wait for assignment
- Comment on an issue to express interest; assignment will follow

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
- **UI Changes**: You can refactor/improve code, but don't change the entire UI unnecessarily
  - Only make UI changes that are discussed and approved in the issue
  - Avoid cosmetic changes that don't add value
- **Follow Issue Scope**: Only implement what's specified in the assigned issue
  - Don't add extra features or unrelated changes
  - Discuss any scope expansion with maintainers first
- **Code Refactoring**: 
  - You can optimize and refactor code
  - But avoid large formatting changes that hide actual code logic
  - Keep refactoring minimal and focused

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

### 6. Sync Before Creating PR

**IMPORTANT:** Before creating your Pull Request, always sync with the latest changes from `gssoc_develop`:

```bash
# Update gssoc_develop branch
git checkout gssoc_develop
git pull upstream gssoc_develop

# Rebase your feature branch on latest gssoc_develop
git checkout feature/your-feature-name
git rebase gssoc_develop

# If there are conflicts, resolve them locally, then:
git push origin feature/your-feature-name --force
```

### 7. Create a Pull Request

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

### Before Submitting a PR

**Checklist:**
- [ ] Code works locally and is tested
- [ ] Latest pull from `gssoc_develop` branch (see Step 6 above)
- [ ] Clear, conventional commit messages
- [ ] Only required code changes (no extra features or local setup files)
- [ ] **DO NOT format entire existing code** - Only format changed lines
  - Formatting makes it hard to identify actual code changes
  - Reviewers need to see what was modified clearly
- [ ] Code follows only what's discussed in the assigned issue
- [ ] No unnecessary refactoring or cleanup outside the issue scope

### PR Requirements

- **Title** must follow commit conventions
- **Description** must include:
  - Link to the issue: `Closes #ISSUE_NUMBER` or `Fixes #ISSUE_NUMBER`
  - **Changes Made**: Detailed list of what was implemented
  - **Testing**: Test cases performed and results
  - **UI Changes** (if applicable): Screenshots/images showing the changes
  - **Functionality Changes** (if applicable): Video demonstration of the feature
  - **Additional Notes**: Any important information for reviewers
- **Manual verification**: Run backend and frontend locally when your change affects behavior
- **No breaking changes** without discussion (or marked as `BREAKING CHANGE`)
- **Self-review** your code before requesting reviewers

### PR Description Template

```markdown
## Issue Link
Closes #ISSUE_NUMBER

## Changes Made
- Brief description of change 1
- Brief description of change 2
- Brief description of change 3

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Code refactor (for discussed optimization)

## Testing Performed

### Backend Testing (if applicable)
- [ ] Unit tests passed
- [ ] API endpoints tested locally with Postman/curl
- [ ] Database migrations verified
- **Test Cases**:
  - Test case 1: Description and result
  - Test case 2: Description and result

### Frontend Testing (if applicable)
- [ ] Component renders correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- **Test Cases**:
  - Test case 1: Description and result
  - Test case 2: Description and result

## UI/UX Changes (if applicable)
### Screenshots/Images
- **Before**: [Add screenshot if modifying existing UI]
- **After**: [Add screenshot of new/modified UI]

## Functionality Demo (if applicable)
- **Video Link**: [Provide link to video showing the feature in action]
  - Or describe the steps to test the functionality

## Additional Notes
- Any edge cases handled
- Known limitations
- Future improvements (if applicable)
```

### Important PR Guidelines

1. **Code Changes Only**: Don't include local setup, environment files, or configuration files
2. **Minimal Formatting**: Only format the lines you changed, not the entire file
3. **Issue Adherence**: Implement ONLY what's in the assigned issue
   - No extra features
   - No additional improvements
   - No scope creep
4. **One Issue = One PR**: Don't combine multiple issues in a single PR
5. **Automated Tests** are not fully wired yet; rely on manual testing

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




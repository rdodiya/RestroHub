
# 🤝 Contributing to Restroly

Thank you for taking the time to contribute to **Restroly**!  
Contributions are welcome and appreciated — whether they are bug fixes, new features, documentation improvements, or suggestions.

---

## 📌 Getting Started

### Prerequisites

Before contributing, make sure you have:

- Java 21
- Gradle
- PostgreSQL
- Git
- An IDE with Lombok & MapStruct annotation processing enabled

---

## 🧭 Contribution Workflow

### 1️⃣ Fork the Repository

Click the **Fork** button on GitHub to create your own copy of the repository.

---

### 2️⃣ Clone Your Fork

```bash
git clone https://github.com/<your-username>/Restroly.git
cd Restroly
````

---

### 3️⃣ Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**

* `feature/add-order-api`
* `fix/swagger-base-path`
* `docs/update-readme`

---

### 4️⃣ Make Your Changes

While working on your changes:

* Follow the existing project structure
* Keep controllers thin (no business logic)
* Use DTOs for request/response
* Use MapStruct for entity mapping
* Add validation annotations where required
* Write clean, readable, and maintainable code

---

### 5️⃣ Run the Application & Tests

Ensure everything works before committing:

```bash
./gradlew clean build
./gradlew test
```

The application should start without errors.

---

### 6️⃣ Commit Your Changes

Write meaningful commit messages:

```bash
git commit -m "Add food update endpoint with validation"
```

---

### 7️⃣ Push to Your Fork

```bash
git push origin feature/your-feature-name
```

---

### 8️⃣ Open a Pull Request

* Go to the original **Restroly** repository
* Click **New Pull Request**
* Select your branch
* Provide a clear description of:

    * What was changed
    * Why it was needed
    * Any related issues

---

## 📐 Code Guidelines

* Follow Java naming conventions
* Prefer constructor injection
* Avoid field injection
* Use `@Transactional` where necessary
* Handle exceptions via global exception handlers
* Log important actions responsibly (avoid sensitive data)

---

## 🧪 Testing Guidelines

* Add unit tests for new functionality
* Do not break existing tests
* Ensure all tests pass before submitting a PR

---

## 🐞 Reporting Bugs

If you find a bug:

1. Search existing issues to avoid duplicates
2. Open a new issue including:

    * Clear description
    * Steps to reproduce
    * Expected vs actual behavior
    * Logs or screenshots (if available)

---

## 💡 Feature Requests

Feature requests are welcome!
When submitting one, please include:

* Problem statement
* Proposed solution
* Any alternative approaches considered

---

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the **MIT License**.

---

## 🙌 Thank You

Your time and effort help improve **Restroly** for everyone.
Happy coding! 🚀


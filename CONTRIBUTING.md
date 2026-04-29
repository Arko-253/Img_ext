# Contributing to Picfin

Thanks for your interest in contributing to Picfin! We welcome all contributions, from bug reports to code improvements.

## 🤝 Types of Contributions

We appreciate:
- **Bug Reports** - Found a problem?
- **Feature Requests** - Have an idea?
- **Code Improvements** - Submit pull requests
- **Documentation** - Help improve our guides
- **Tests** - Add test coverage

---

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing [GitHub Issues](https://github.com/yourusername/picfin/issues)
2. Try latest version
3. Gather system info:
   ```bash
   python --version
   node --version
   git --version
   ```

### Creating an Issue

Include:
- **Title:** Clear, concise description
- **Environment:** Python/Node/OS version
- **Steps to Reproduce:** Exact steps to trigger bug
- **Expected vs Actual:** What should happen vs what actually happens
- **Screenshots/Logs:** Error messages or console logs
- **Additional Context:** Any other relevant info

**Template:**
```
# Bug: [Short Title]

## Environment
- Python: 3.x.x
- Node: 16.x.x
- OS: Windows/macOS/Linux

## Reproduce
1. Step one
2. Step two
3. Step three

## Expected
[What should happen]

## Actual
[What actually happens]

## Error Log
[Paste error message here]
```

---

## ✨ Suggesting Features

### Before Suggesting

1. Check existing [Issues](https://github.com/yourusername/picfin/issues) for similar requests
2. Ensure feature aligns with project scope

### Creating a Feature Request

Include:
- **Title:** Clear description
- **Problem:** What problem does this solve?
- **Solution:** How should it work?
- **Alternatives:** Other approaches considered
- **Example Use Case:** Specific scenario

**Template:**
```
# Feature: [Short Title]

## Problem
[Describe the problem]

## Solution
[How should the feature work?]

## Example
[Show how it would be used]

## Alternatives
[Other approaches you considered]
```

---

## 🔧 Contributing Code

### Setup Development Environment

1. Fork repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/picfin.git
   cd face
   ```

3. Create feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Follow [SETUP.md](./SETUP.md) for full installation

### Development Workflow

1. **Before coding:**
   ```bash
   git pull origin main
   ```

2. **Make changes** to files
3. **Test locally:**
   ```bash
   # Terminal 1: AI Engine
   cd ai && source .venv/bin/activate
   
   # Terminal 2: Server
   cd server && npm start
   
   # Terminal 3: UI
   cd ui && npm run dev
   ```

4. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add face search feature"
   ```
   
   **Format:** `type: description`
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `refactor:` - Code reorganization
   - `test:` - Add tests
   - `style:` - Format/linting

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request** on GitHub

### Code Style Guidelines

#### Python (AI Engine)
```python
# Use type hints
def search_faces(query_path: str, index: Any) -> List[Tuple[str, float]]:
    """Docstring describing function."""
    pass

# Use descriptive names
face_embeddings = []  # Good
faces = []           # Unclear

# Format with Black
black ai/ai_engine.py

# Check types with mypy
mypy ai/
```

#### JavaScript (Server & UI)
```javascript
// Use const/let, not var
const port = 5000;

// Use descriptive names
const maxUploadSize = 100 * 1024 * 1024;

// Add comments for complex logic
// Extract faces from image using MTCNN
const faces = extractFaces(imagePath);

// Use async/await
async function handleSearch(queryFile, datasetFile) {
  const results = await processSearch(queryFile, datasetFile);
  return results;
}

// Format with Prettier
prettier --write ui/src/
```

#### Vue (UI Components)
```vue
<template>
  <!-- Use meaningful class names -->
  <div class="search-container">
    <input v-model="queryFile" />
  </div>
</template>

<script setup>
// Use composition API
import { ref } from 'vue';

const queryFile = ref(null);

// Document props and emits
defineProps({
  message: String
});

defineEmits(['update', 'cancel']);
</script>

<style scoped>
/* Use semantic naming */
.search-container {
  padding: 1rem;
}
</style>
```

---

## ✅ Pull Request Process

### Before Submitting

1. **Rebase on latest main:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests locally**
3. **Update documentation** if needed
4. **Add test coverage** for new code
5. **Verify no breaking changes**

### PR Template

```markdown
# Description
Brief explanation of changes

## Type
- [ ] Bug fix (fixes #issue)
- [ ] New feature (closes #issue)
- [ ] Breaking change
- [ ] Documentation update

## Changes
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] Tests added
- [ ] No breaking changes

## Checklist
- [ ] Code follows style guide
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console errors
```

### Review Process

1. **Automatic Checks:**
   - Code formatting
   - Linting
   - Type checking

2. **Human Review:**
   - Code quality
   - Architecture
   - Performance

3. **Feedback:**
   - Request changes or approve
   - CI/CD pipeline runs

4. **Merge:**
   - Rebase and merge to main
   - Delete feature branch

---

## 📝 Documentation Contributions

### Update Existing Docs
1. Navigate to `.md` file
2. Make changes
3. Ensure clarity and accuracy
4. Submit PR

### Add New Documentation
1. Create `.md` file in appropriate folder
2. Follow existing style
3. Include examples
4. Add to table of contents

### Good Documentation
- Clear headings
- Code examples
- Explanations of "why"
- Links to related docs

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# Coverage report
npm run test:coverage

# Python tests
pytest ai/tests/

# Type checking
mypy ai/
```

### Write Tests

**Python (pytest):**
```python
def test_extract_faces():
    """Test face extraction from image."""
    faces = extract_faces("test_image.jpg")
    assert len(faces) > 0
```

**JavaScript (Jest):**
```javascript
test('should upload file successfully', async () => {
  const result = await uploadFile(testFile);
  expect(result.success).toBe(true);
});
```

---

## 🎯 Project Conventions

### Folder Structure
- `/ai` - Python machine learning code
- `/server` - Node.js backend
- `/ui` - Vue.js frontend
- Root level: Configuration, docs, setup

### File Naming
- Python: `snake_case.py`
- JavaScript: `camelCase.js` for files, `PascalCase.vue` for components
- Tests: `filename.test.js` or `test_filename.py`

### Commit History
- Keep commits atomic and meaningful
- Rebase before merging (no merge commits)
- Reference issues: `fixes #123`

---

## 🚀 Review Criteria

Your PR will be evaluated on:

1. **Code Quality** - Clean, readable, well-documented
2. **Testing** - Adequate test coverage
3. **Performance** - No significant slowdowns
4. **Security** - No vulnerabilities introduced
5. **Compatibility** - Works across supported versions
6. **Documentation** - Clear documentation added

---

## 🏆 Recognition

Contributors will be:
- Added to [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Mentioned in release notes
- Credited in commit history

---

## ❓ Questions?

- Check [README](./README.md)
- Read [Documentation](./ai/README.md)
- Open an issue for discussion
- Email: support@picfin.dev

---

## 📜 Code of Conduct

Be respectful, inclusive, and professional:
- Treat everyone with respect
- Welcome diverse perspectives
- Focus on code quality, not the person
- Report harassment to support@picfin.dev

---

## 📝 License

By contributing, you agree that your code will be licensed under the same license as this project (MIT).

---

**Thank you for contributing to Picfin! 🎉**

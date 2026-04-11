# Contribution Guidelines

Welcome to the University-Academic-Management-System project! This document outlines the guidelines for contributing to this project.

## 📋 Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Development Setup](#development-setup)
3. [Coding Standards](#coding-standards)
4. [Testing Requirements](#testing-requirements)
5. [Documentation Standards](#documentation-standards)
6. [Submission Process](#submission-process)

---

## Code of Conduct

### Team Expectations
- **Respect**: Treat all team members with professionalism and respect
- **Communication**: Discuss changes and decisions in good faith
- **Quality**: Strive for high-quality, maintainable code
- **Collaboration**: Help teammates succeed; code review feedback is constructive
- **Deadline**: Respect project timelines and milestones

### Forbidden Practices
- ❌ Committing secrets (API keys, passwords, tokens)
- ❌ Committing node_modules, vendor, or build artifacts
- ❌ Committing .env files with real credentials
- ❌ Direct commits to main or dev branches
- ❌ Rewriting public history (force-push to shared branches)

---

## Development Setup

### Prerequisites
- Git configured with your name and email
- Node.js 18+ (for frontend development)
- PHP 8.2+ and Composer (for backend development)
- MySQL 8.0+ (for database)

### Backend Setup
```bash
cd server
composer install
cp .env.example .env
# Configure .env with your local database credentials
php artisan migrate
php artisan seed
php artisan serve
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Database Setup
```bash
mysql -u root -p
CREATE DATABASE university_management;
# Use Laravel migrations to set up tables
```

---

## Coding Standards

### PHP/Laravel Backend
- **Code Style**: PSR-12 coding standards
- **Naming**: camelCase for methods/variables, PascalCase for classes
- **Indentation**: 4 spaces (not tabs)
- **Comments**: PHPDoc for classes and public methods
- **Error Handling**: Always handle exceptions gracefully

Example:
```php
<?php

namespace App\Models;

/**
 * User Model
 * Represents a system user (admin, teacher, student)
 */
class User extends Model
{
    protected $fillable = ['name', 'email', 'role'];

    /**
     * Get the student profile associated with this user
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function student()
    {
        return $this->hasOne(Student::class);
    }
}
```

### React/JavaScript Frontend
- **Code Style**: Use ESLint configuration provided
- **Naming**: camelCase for functions/variables, PascalCase for components
- **Indentation**: 2 spaces
- **Functional Components**: Use React hooks (useState, useEffect, etc.)
- **JSDoc**: Document complex functions

Example:
```jsx
/**
 * StudentDashboard Component
 * Displays student's courses, grades, and schedule
 */
function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/student/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Component JSX */}
    </div>
  );
}
```

### Git Commit Messages
- **First line**: 50 characters or less, imperative mood
- **Body**: Explain WHAT and WHY, not HOW
- **Format**: `component: description`

Example:
```
model/student: Add enrollment status tracking

Student records now include individual enrollment
status for each course offering. This enables better
tracking of active, dropped, and completed courses.

Related to: #45
```

---

## Testing Requirements

### Backend Testing (PHPUnit)
- All new models must have at least one test
- All API endpoints must have feature tests
- Aim for >80% code coverage
- Run tests before pushing: `php artisan test`

### Frontend Testing (Vitest/React Testing Library)
- Test user workflows, not implementation details
- Use react-testing-library for component tests
- Aim for critical path coverage
- Run tests before pushing: `npm run test`

### Manual Testing Checklist
- [ ] Feature works as intended in browser
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile
- [ ] Form validation works correctly
- [ ] Error messages are user-friendly

---

## Documentation Standards

### Code Documentation
- **NoDocs = No Approval**: Undocumented code will not be merged
- All public methods must have PHPDoc/JSDoc comments
- Complex logic needs inline comments
- README files are required for new folders/modules

### API Documentation
- All endpoints must document: method, path, params, response
- Include example requests and responses
- Document error cases

Example:
```
POST /api/auth/login
---
Request:
{
  "email": "student@university.edu",
  "password": "securepassword"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "role": "student" }
}

Error (401):
{
  "message": "Invalid credentials"
}
```

---

## Submission Process

### Step 1: Create Feature Branch
```bash
git checkout dev
git pull origin dev
git checkout -b feature/tm{N}-purpose
```

### Step 2: Make Changes
- Keep commits atomic and logical
- Commit frequently with clear messages
- Push to origin as you work

### Step 3: Create Pull Request
```bash
git push origin feature/tm{N}-purpose
```
Then on GitHub:
1. Click "New Pull Request"
2. Set base: `dev`, compare: `feature/tm{N}-purpose`
3. Fill in title and description
4. Request review from Team Lead (Mahdi)

### Step 4: Address Review Feedback
- Team Lead will suggest changes
- Make updates on your feature branch
- Push updates (they auto-update the PR)
- Mark conversations as resolved when addressed

### Step 5: Merge
- Team Lead will merge when all checks pass
- Feature branch is deleted from GitHub
- You sync locally: `git checkout dev && git pull origin dev`

---

## Common Issues & Solutions

### Issue: "Your branch is behind origin/dev"
**Solution**:
```bash
git fetch origin
git rebase origin/dev
# If conflicts, resolve them, then:
git rebase --continue
git push origin feature/tm{N}-purpose --force-with-lease
```

### Issue: "Nothing to commit but changes staged"
**Solution**: Stage the actual changes:
```bash
git status  # See what's changed
git add .   # Or specify files: git add path/to/file
git commit -m "..."
```

### Issue: "Accidentally committed to main"
**Solution** (if not pushed):
```bash
git reset --soft HEAD~1  # Undo last commit, keep changes
git checkout -b feature/tm{N}-purpose
git commit -m "..."
git push origin feature/tm{N}-purpose
```

---

## Questions?

- Ask in team chat/email
- Review existing code for patterns
- Check project documentation
- Consult Team Lead (Mahdi)

---

**Last Updated**: April 2026  
**Maintained by**: Mahdi Azfar Talukder (Team Lead)

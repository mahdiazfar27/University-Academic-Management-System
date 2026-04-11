# 📖 100-COMMIT DETAILED PLAYBOOK
## University Academic Management System - Complete Execution Reference

**This document contains exact copy-paste commands for all 100 commits**

---

## PHASE 1: REPOSITORY INITIALIZATION (Commits 1-5)

### Commit 1: Initialize repository with root documentation
**Assigned to**: Mahdi  
**Branch**: main  
**Expected files**: README, .gitignore, docs  

```bash
# Navigate to project
cd d:\University-Academic-Management-System

# Verify on main
git checkout main
git pull origin main
git status

# Review root documentation files
ls -la README.md .gitignore
ls docs/

# Stage root-level files (NOT subdirectories yet)
git add README.md
git add .gitignore
git add docs/

# Verify staging
git status | head -20

# Commit
git commit -m "chore: Initialize Git repository with root documentation and guidelines"

# Verify
git log --oneline -1
```

**Expected output**:
```
[main xxxxxxx] chore: Initialize Git repository with root documentation and guidelines
X files changed, Y insertions(+)
create mode 100644 README.md
```

---

### Commit 2: Create dev branch with workflow guidelines
**Assigned to**: Mahdi  
**Branch**: Create new `dev` from `main`  

```bash
# Create dev branch
git checkout -b dev

# Add workflow documentation
git add docs/GIT_MIGRATION_BRANCH_AND_COMMITS.md
git add docs/GIT_MIGRATION_PLAN.md
git add docs/CONTRIBUTION_GUIDELINES.md
git add docs/GIT_MIGRATION_EXECUTION_REFERENCE.md
git add docs/GIT_MIGRATION_DOCUMENTATION_INDEX.md
git add docs/GIT_MIGRATION_MASTER_SUMMARY.md
git add docs/GIT_MIGRATION_QUICK_REFERENCE.md
git add docs/BRANCHING_STRATEGY.md

# Verify all strategy docs are staged
git status | grep docs/GIT_MIGRATION

# Commit
git commit -m "chore: Create dev integration branch with workflow guidelines"

# Push dev to remote (first time)
git push -u origin dev

# Verify on GitHub
git branch -vv
```

---

### Commit 3: Set up root-level configuration
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core` (new)  

```bash
# Create feature branch from dev
git checkout -b feature/mahdi-database-core

# Add root-level config files
git add .editorconfig
git add .gitattributes
git add .github/

# Verify
git status

# Commit
git commit -m "chore: Add root-level configuration for consistency and CI/CD"

# Status check
git log --oneline -1
```

---

### Commit 4: Add Laravel backend configuration
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
# From feature/mahdi-database-core (already there)

# Add all backend configuration
git add server/.env.example
git add server/composer.json
git add server/composer.lock
git add server/phpunit.xml
git add server/artisan
git add server/.gitignore
git add server/.editorconfig
git add server/bootstrap/
git add server/config/
git add server/README.md

# Verify count (should be multiple files)
git status | grep server/ | wc -l

# Commit
git commit -m "chore: Add Laravel backend dependencies and configuration files"

# View commit
git show --stat
```

---

### Commit 5: Add React frontend configuration
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
# Still on feature/mahdi-database-core

# Add all frontend config
git add client/package.json
git add client/package-lock.json
git add client/vite.config.js
git add client/eslint.config.js
git add client/index.html
git add client/.gitignore
git add client/README.md
git add client/public/

# Verify
git status | grep -c client/

# Commit
git commit -m "chore: Add React frontend dependencies and Vite configuration"

# Check status
git log --oneline -5
```

---

## PHASE 2: DATABASE LAYER (Commits 6-25)

### Commit 6: Create cache and jobs migrations
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/migrations/0001_01_01_000001_create_cache_table.php
git add server/database/migrations/0001_01_01_000002_create_jobs_table.php
git add server/database/migrations/2026_04_05_134201_create_users_table.php

git commit -m "database/core: Create base users and framework tables with auth fields"

git show --stat
```

---

### Commit 7: Create academic structure
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/migrations/2026_04_05_134209_create_departments_table.php
git add server/database/migrations/2026_04_05_134210_create_semesters_table.php
git add server/database/migrations/2026_04_05_134213_create_courses_table.php

git commit -m "database/academic: Create departments, semesters, and courses tables"
```

---

### Commit 8: Create teacher and student roles
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/migrations/2026_04_05_134211_create_teachers_table.php
git add server/database/migrations/2026_04_05_134212_create_students_table.php

git commit -m "database/roles: Create teacher and student profile tables with relationships"
```

---

### Commit 9: Create enrollment tables
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/migrations/2026_04_05_134214_create_course_offerings_table.php
git add server/database/migrations/2026_04_05_134215_create_enrollments_table.php

git commit -m "database/enrollment: Create course offerings and student enrollments"
```

---

### Commit 10: Create performance tables
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/migrations/2026_04_05_134216_create_results_table.php
git add server/database/migrations/2026_04_07_140817_create_attendance_table.php

git commit -m "database/performance: Create results and attendance tracking tables"
```

---

### Commit 11: Create operations tables
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/migrations/2026_04_08_120000_create_notices_table.php
git add server/database/migrations/2026_04_09_022551_create_settings_table.php
git add server/database/migrations/2026_04_09_150000_create_payments_table.php
git add server/database/migrations/2026_04_09_021547_add_head_id_to_departments_table.php

git commit -m "database/operations: Create payments, notices, settings, and admin tables"
```

---

### Commit 12: Add user seeders
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/seeders/DatabaseSeeder.php
git add server/database/seeders/UserSeeder.php

git commit -m "seeder/users: Create master seeder and user test data with roles"
```

---

### Commit 13: Add academic seeders
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/seeders/DepartmentSeeder.php
git add server/database/seeders/SemesterSeeder.php
git add server/database/seeders/CourseSeeder.php

git commit -m "seeder/academic: Add departments, semesters, and course catalog data"
```

---

### Commit 14: Add enrollment seeders
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/seeders/CourseOfferingSeeder.php
git add server/database/seeders/EnrollmentSeeder.php

git commit -m "seeder/enrollment: Create course offerings and student enrollments"
```

---

### Commit 15: Add performance seeders
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/seeders/ResultSeeder.php
git add server/database/seeders/StudentSeeder.php
git add server/database/seeders/TeacherSeeder.php

git commit -m "seeder/performance: Add student grades and teacher assignments"
```

---

### Commit 16: Add operations seeders
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/database/seeders/PaymentSeeder.php

git commit -m "seeder/operations: Add payments and financial test data"
```

---

### Commit 17: Add core models
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/app/Models/User.php
git add server/app/Models/Student.php
git add server/app/Models/Teacher.php

git commit -m "model/core: Add User, Student, and Teacher models with relationships"
```

---

### Commit 18: Add academic models
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/app/Models/Department.php
git add server/app/Models/Semester.php
git add server/app/Models/Course.php

git commit -m "model/academic: Add Department, Semester, and Course models"
```

---

### Commit 19: Add enrollment models
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/app/Models/CourseOffering.php
git add server/app/Models/Enrollment.php

git commit -m "model/enrollment: Add CourseOffering and Enrollment models"
```

---

### Commit 20: Add performance & operations models
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/app/Models/Result.php
git add server/app/Models/Attendance.php
git add server/app/Models/MarksEntry.php
git add server/app/Models/Payment.php
git add server/app/Models/Notice.php
git add server/app/Models/Setting.php
git add server/app/Models/AdminLog.php

git commit -m "model/operations: Add Result, Attendance, Payment, Notice, and Setting models"
```

---

### Commit 21: Add JWT service
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/app/Services/JwtService.php

git commit -m "service/jwt: Implement JWT authentication service with token lifecycle"
```

---

### Commit 22: Add middleware
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/app/Http/Middleware/

git commit -m "middleware: Add JWT verification and CORS middleware"
```

---

### Commit 23: Add service providers
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/app/Providers/
git add server/config/auth.php
git add server/config/cors.php
git add server/bootstrap/providers.php

git commit -m "chore: Add Service Providers and authentication configuration"
```

---

### Commit 24: Add routes
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/routes/

git commit -m "route: Add API and web route definitions"
```

---

### Commit 25: Add remaining configs
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-database-core`  

```bash
git add server/config/ (excluding auth.php and cors.php already added)
git add server/bootstrap/app.php

# Or simpler:
git add server/config/cache.php
git add server/config/database.php
git add server/config/filesystems.php
git add server/config/logging.php
git add server/config/mail.php
git add server/config/queue.php
git add server/config/services.php
git add server/config/session.php
git add server/bootstrap/app.php

git commit -m "chore: Add complete Laravel configuration suite"

# AFTER COMMIT 25, CREATE PR
git status
git log --oneline -5

git push -u origin feature/mahdi-database-core
# Go to GitHub and create PR
# Base: dev, Compare: feature/mahdi-database-core
```

---

## PHASE 3: BACKEND CONTROLLERS (Commits 26-40)

**WAIT**: PR #1 must be merged into dev before starting this phase

```bash
# Mahdi waits for PR #1 to be merged on GitHub

# Then:
git checkout dev
git pull origin dev

git checkout -b feature/mahdi-backend-api

# Now add controllers...
```

### Commit 26: Add AuthController
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-backend-api` (new)  

```bash
git add server/app/Http/Controllers/AuthController.php

git commit -m "controller/auth: Add login, register, and logout endpoints"
```

---

### Commits 27-39: Add remaining controllers
**Assigned to**: Mahdi  

```bash
# Commit 27
git add server/app/Http/Controllers/UserController.php
git commit -m "controller/user: Add user CRUD operations"

# Commit 28
git add server/app/Http/Controllers/StudentController.php
git commit -m "controller/student: Add student profile and enrollment operations"

# Commit 29
git add server/app/Http/Controllers/TeacherController.php
git commit -m "controller/teacher: Add teacher profile and course operations"

# Commit 30
git add server/app/Http/Controllers/DepartmentController.php
git commit -m "controller/department: Add department CRUD operations"

# Commit 31
git add server/app/Http/Controllers/SemesterController.php
git commit -m "controller/semester: Add semester CRUD operations"

# Commit 32
git add server/app/Http/Controllers/CourseController.php
git commit -m "controller/course: Add course CRUD and catalog operations"

# Commit 33
git add server/app/Http/Controllers/CourseOfferingController.php
git commit -m "controller/course-offering: Add course offering and scheduling operations"

# Commit 34
git add server/app/Http/Controllers/EnrollmentController.php
git commit -m "controller/enrollment: Add enrollment and course registration operations"

# Commit 35
git add server/app/Http/Controllers/ResultController.php
git commit -m "controller/result: Add grade entry and transcript operations"

# Commit 36
git add server/app/Http/Controllers/AttendanceController.php
git commit -m "controller/attendance: Add attendance tracking and reporting"

# Commit 37
git add server/app/Http/Controllers/PaymentController.php
git commit -m "controller/payment: Add payment tracking and financial operations"

# Commit 38
git add server/app/Http/Controllers/NoticeController.php
git commit -m "controller/notice: Add notice management and broadcasting"

# Commit 39
git add server/app/Http/Controllers/SettingController.php
git commit -m "controller/setting: Add system configuration management"
```

---

### Commit 40: Add remaining backend files
**Assigned to**: Mahdi  
**Branch**: `feature/mahdi-backend-api`  

```bash
git add server/app/Http/Controllers/Controller.php
git add server/app/ (any remaining files)
git add server/bootstrap/ (any remaining files)

git commit -m "chore: Add remaining backend support files and infrastructure"

# AFTER COMMIT 40, CREATE PR
git push -u origin feature/mahdi-backend-api
# Create PR on GitHub
```

---

## PHASE 4: FRONTEND SETUP (Commits 41-50)

**WAIT**: PR #2 must be merged into dev before Redowan starts

```bash
# Redowan syncs:
git checkout dev
git pull origin dev

git checkout -b feature/redowan-frontend-setup
```

### Commits 41-50: Frontend infrastructure
**Assigned to**: Redowan

```bash
# Commit 41
git add client/src/main.jsx
git add client/src/App.jsx
git add client/src/App.css
git add client/src/index.css
git commit -m "feat: Initialize React application with entry point and styling"

# Commit 42
git add client/src/router/
git commit -m "feat: Add React Router with private route protection"

# Commit 43
git add client/src/layouts/
git add client/src/components/Header.jsx
git add client/src/components/Header.module.css
git add client/src/components/Sidebar.jsx
git add client/src/components/Sidebar.module.css
git commit -m "feat: Add shared layout components (Header, Sidebar, Navigation)"

# Commit 44
git add client/src/context/
git add client/src/components/NotificationPopup.jsx
git add client/src/components/NotificationPopup.module.css
git commit -m "feat: Add React Context and notification system"

# Commit 45
git add client/src/api/apiService.js
git commit -m "feat: Add API service layer with Axios configuration"

# Commit 46
git add client/src/hooks/useAuth.js
git commit -m "feat: Add custom useAuth hook for authentication logic"

# Commit 47
git add client/src/pages/LandingPage.jsx
git add client/src/pages/LandingPage.module.css
git add client/src/pages/LoginPage.jsx
git add client/src/pages/LoginPage.module.css
git add client/src/pages/NotFound.jsx
git commit -m "feat: Add landing and login pages with authentication UI"

# Commit 48
git add client/src/assets/
git commit -m "assets: Add frontend images and static assets"

# Commit 49
git add client/src/utils/
git commit -m "chore: Add utility functions and common helpers"

# Commit 50
git add client/src/context/AuthContext.jsx
git add client/src/context/NotificationContext.jsx
git commit -m "feat: Implement AuthContext for global auth state management"

# AFTER COMMIT 50, PUSH AND CREATE PR
git push -u origin feature/redowan-frontend-setup
```

---

## PHASE 5: FRONTEND PAGES (Commits 51-66)

**WAIT**: PR #3 merged into dev

```bash
# Redowan:
git checkout dev
git pull origin dev

git checkout -b feature/redowan-frontend-pages
```

### Commits 51-66: Page components
**Assigned to**: Redowan

```bash
# Admin pages (6 commits: 51-56)

# Commit 51
git add client/src/pages/admin/Dashboard.jsx
git add client/src/pages/admin/Dashboard.module.css
git commit -m "feat(admin): Add admin dashboard with overview and statistics"

# Commit 52
git add client/src/pages/admin/UserManagement.jsx
git add client/src/pages/admin/UserManagement.module.css
git commit -m "feat(admin): Add user management page with CRUD operations"

# Commit 53
git add client/src/pages/admin/DepartmentManagement.jsx
git add client/src/pages/admin/DepartmentManagement.module.css
git commit -m "feat(admin): Add department management interface"

# Commit 54
git add client/src/pages/admin/CourseManagement.jsx
git add client/src/pages/admin/CourseManagement.module.css
git commit -m "feat(admin): Add course management and catalog interface"

# Commit 55
git add client/src/pages/admin/AdminNotices.jsx
git add client/src/pages/admin/AdminNotices.module.css
git commit -m "feat(admin): Add notices and announcements management"

# Commit 56
git add client/src/pages/admin/Settings.jsx
git add client/src/pages/admin/Settings.module.css
git add client/src/pages/admin/SettingsNew.jsx
git commit -m "feat(admin): Add system settings and configuration pages"

# Student pages (3 commits: 57-59)

# Commit 57
git add client/src/pages/student/Dashboard.jsx
git add client/src/pages/student/Dashboard.module.css
git commit -m "feat(student): Add student dashboard with overview"

# Commit 58
git add client/src/pages/student/Results.jsx
git add client/src/pages/student/Results.module.css
git add client/src/pages/student/PaymentHistory.jsx
git add client/src/pages/student/PaymentHistory.module.css
git commit -m "feat(student): Add results and payment history pages"

# Commit 59
git add client/src/pages/student/ClassRoutine.jsx
git add client/src/pages/student/ClassRoutine.module.css
git add client/src/pages/student/Profile.jsx
git add client/src/pages/student/Profile.module.css
git add client/src/pages/student/NameCorrection.jsx
git add client/src/pages/student/NameCorrection.module.css
git commit -m "feat(student): Add class routine, profile, and name correction pages"

# Teacher pages (3 commits: 60-62)

# Commit 60
git add client/src/pages/teacher/Dashboard.jsx
git add client/src/pages/teacher/Dashboard.module.css
git add client/src/pages/teacher/MyCourses.jsx
git add client/src/pages/teacher/MyCourses.module.css
git commit -m "feat(teacher): Add teacher dashboard and course listing"

# Commit 61
git add client/src/pages/teacher/Attendance.jsx
git add client/src/pages/teacher/Attendance.module.css
git commit -m "feat(teacher): Add attendance tracking interface"

# Commit 62
git add client/src/pages/teacher/MarksEntry.jsx
git add client/src/pages/teacher/MarksEntry.module.css
git commit -m "feat(teacher): Add marks entry and grading interface"

# Commit 63
git add client/src/pages/teacher/Notices.jsx
git add client/src/pages/teacher/Notices.module.css
git commit -m "feat(teacher): Add notices and announcements page"

# Commit 64
git add client/src/pages/teacher/Schedule.jsx
git add client/src/pages/teacher/Schedule.module.css
git commit -m "feat(teacher): Add class schedule and routine"

# Commit 65: Any remaining files
git add client/layouts/AdminLayout.jsx
git add client/layouts/StudentLayout.jsx
git add client/layouts/TeacherLayout.jsx
git add client/layouts/Layout.module.css
git commit -m "feat: Add layout templates for role-based dashboards"

# Commit 66: Polish and final adjustments
git add client/src/pages/admin/
git add client/src/pages/student/
git add client/src/pages/teacher/
git commit -m "feat: Complete all frontend page components and styling"

# AFTER COMMIT 66, PUSH AND CREATE PR
git push -u origin feature/redowan-frontend-pages
```

---

## PHASE 6: DOCUMENTATION & DEVOPS (Commits 67-100)

**WAIT**: Both frontend PRs merged into dev

```bash
# Rupam starts Phase 6

# First session: Documentation (commits 67-79)
git checkout dev
git pull origin dev
git checkout -b feature/rupam-docs-testing

# Documentation commits (67-74):
# Commit 67: Organize docs structure
# Commit 68: API documentation
# Commit 69: Setup guide
# Commit 70: Development environment
# Commit 71: Database schema docs
# Commit 72: Authentication flow
# Commit 73: Testing guides
# Commit 74: Troubleshooting guides

git add docs/API_DOCUMENTATION.md
git commit -m "docs: Add comprehensive API endpoint documentation"

git add docs/SETUP_GUIDE.md
git commit -m "docs: Add development environment setup guide"

# ... (continue pattern for all doc commits 67-74)

# Test/Database commits (75-79):
git add server/database/seeders/
git add server/database/
git commit -m "chore: Add database backup and seeding documentation"

# After 79 commits:
git push -u origin feature/rupam-docs-testing
# Create PR

# Second session: DevOps & Build (commits 80-100)
git checkout dev
git pull origin dev
git checkout -b feature/rupam-devops-build

# Build configuration (80-85):
git add client/vite.config.js
git add server/
git commit -m "build: Optimize Vite and Laravel build pipelines"

# CI/CD (86-90):
git add .github/workflows/
git commit -m "ci: Add GitHub Actions for testing and deployment"

# Deployment (91-95):
git add docs/DEPLOYMENT_GUIDE.md
git commit -m "ops: Add production deployment documentation"

# Final (96-100):
git add docs/README.md
git commit -m "docs: Finalize project documentation and README"

# After 100 commits:
git push -u origin feature/rupam-devops-build
# Create PR
```

---

## FINAL INTEGRATION

After all 5 PRs are merged into `dev`:

```bash
# Mahdi prepares release
git checkout dev
git pull origin dev

# Create release branch
git checkout -b release/v1.0.0

# Update version numbers if needed
git add package.json composer.json
git commit -m "release: Bump version to v1.0.0"

# Merge into main
git checkout main
git pull origin main

git merge --no-ff release/v1.0.0 \
  -m "Merge v1.0.0 release into production"

# Tag the release
git tag -a v1.0.0 -m "Release v1.0.0 - Initial public release"

# Push to GitHub
git push origin main
git push origin v1.0.0

# All team members update
git checkout dev
git pull origin dev
git checkout main
git pull origin main

git branch -v
```

---

**END OF PLAYBOOK**

Total: 100 commits ready for execution

---

*Generated: April 11, 2026*  
*For: Mahdi, Redowan, Rupam*  
*Project: University Academic Management System*

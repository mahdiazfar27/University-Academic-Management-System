# SECTION B — Branch Strategy & Workflow Rules

## 🌳 GitHub Branch Architecture

```
main
 └─ (only receives merges from dev - never direct commits)
    
dev (primary integration branch)
 ├─ feature/tm1-database-auth          (Team Member 1)
 ├─ feature/tm1-database-academic      (Team Member 1)
 ├─ feature/tm1-backend-core           (Team Member 1)
 ├─ feature/tm2-backend-academic       (Team Member 2)
 ├─ feature/tm2-backend-operations     (Team Member 2)
 ├─ feature/tm2-backend-admin          (Team Member 2)
 ├─ feature/tm3-frontend-setup         (Team Member 3)
 ├─ feature/tm3-frontend-student       (Team Member 3)
 ├─ feature/tm3-frontend-teacher       (Team Member 3)
 ├─ feature/tm3-frontend-admin         (Team Member 3)
 └─ feature/tm3-frontend-integration   (Team Member 3)
```

---

## 📋 Branch Naming Convention

**Format**: `feature/tm{N}-{component}-{purpose}`

Where:
- `tm{N}` = Team Member number (1, 2, or 3)
- `{component}` = Logical system component
- `{purpose}` = What this branch accomplishes

**Examples**:
- ✅ `feature/tm1-database-auth`
- ✅ `feature/tm2-backend-academic`
- ✅ `feature/tm3-frontend-student`

---

## ⚙️ Workflow Rules (STRICT)

### Rule 1: No Direct Commits to main
❌ DO NOT: `git push origin main`  
❌ DO NOT: `git commit -m "..." && git push origin main`  
✅ DO: Create a feature branch and PR into dev

### Rule 2: No Direct Commits to dev
❌ DO NOT: `git push origin dev`  
❌ DO NOT: `git commit -m "..." && git push origin dev` (without PR)  
✅ DO: Push to feature branch, create PR, have Team Member 1 review & merge

### Rule 3: Each Team Member Owns Their Branch
- TM1: All commits to `feature/tm1-*` branches
- TM2: All commits to `feature/tm2-*` branches
- TM3: All commits to `feature/tm3-*` branches
- Only Team Lead can merge into dev

### Rule 4: PR Review Checklist
Before approving any PR into dev:
- ✅ All commits are logically grouped
- ✅ Commit messages are clear and descriptive
- ✅ Code builds/runs without errors
- ✅ No sensitive files (.env, node_modules, vendor) included
- ✅ Documentation is updated if needed

### Rule 5: Branch Protection (Recommended GitHub Settings)
```
dev branch:
  - Require pull request reviews: ✅ (at least 1 approval)
  - Require status checks: ✅ (if CI/CD configured)
  - Dismiss stale review: ✅
  - Require branches up to date: ✅

main branch:
  - Require pull request reviews: ✅ (at least 2 approvals)
  - Require status checks: ✅
  - Dismiss stale review: ✅
  - Require branches up to date: ✅
  - Include administrators: ❌ (allow TM1 to override if needed)
```

---

## 📍 Git Setup Before First Commit

### **Step 1: Initialize Local Repository**
```bash
cd "Universe Academic Management System"
git init
git config user.name "Your Name"
git config user.email "your.email@company.com"
```

### **Step 2: Create Root .gitignore**
Git should automatically respect the subdir .gitignore files (/server/.gitignore and /client/.gitignore), but ensure root level has catch-all patterns for safety.

### **Step 3: Create and Push Initial Branches**
```bash
# Create main branch (empty initially, or with README)
git checkout -b main

# Create dev branch from main
git checkout -b dev

# Push both to GitHub (after remote is setup)
git remote add origin https://github.com/YourOrg/iums.git
git push -u origin main
git push -u origin dev
```

### **Step 4: Each Team Member Creates Their Feature Branches**
```bash
# Team Member 1
git checkout dev
git pull origin dev
git checkout -b feature/tm1-database-auth

# Team Member 2
git checkout dev
git pull origin dev
git checkout -b feature/tm2-backend-academic

# Team Member 3
git checkout dev
git pull origin dev
git checkout -b feature/tm3-frontend-setup
```

---

## 🔄 PR & Merge Workflow

### **Creating a Pull Request**
1. All commits on feature branch are complete
2. Feature branch is pushed to GitHub
3. On GitHub, create PR: `feature/* → dev`
4. Add PR title and description
5. Request review from Team Member 1 (the lead)

### **Team Lead Review & Merge**
1. Team Member 1 reviews all commits in PR
2. Optionally, adds review comments
3. If approved: Click "Squash and merge" OR "Create a merge commit" (depends on strategy)
4. Complete the merge
5. Delete the feature branch on GitHub

### **Post-Merge for Team Members**
```bash
# Return to dev and pull latest
git checkout dev
git pull origin dev

# Delete old feature branch locally
git branch -d feature/tm{N}-...

# Create next feature branch
git checkout -b feature/tm{N}-next-component
```

---

## 🎯 Commit Message Format

### **Template**
```
<component>: <concise description>

<optional detailed explanation>

Related to: <issue/ticket if applicable>
```

### **Examples**
```
✅ GOOD:
database/auth: Create users table with JWT support
auth: Implement login endpoint with token generation
models: Add Student and Teacher relationship models

❌ BAD:
fix bug
updated
stuff
```

### **Component Prefixes to Use**
```
database/     - Database migrations and schema
seeder/       - Database seeders and test data
model/        - Eloquent models
controller/   - API controllers
service/      - Business logic services
route/        - API route definitions
migration/    - Database migrations
auth/         - Authentication related
frontend/     - React frontend changes
component/    - React components
page/         - React page components
hook/         - React custom hooks
context/      - React context
router/       - React router configuration
styling/      - CSS modules and styling
config/       - Configuration files
docs/         - Documentation
chore/        - Maintenance and setup tasks
```

---

# SECTION C — Detailed Commit Plan (Commits 1-115)

## Phase 1: Project Setup & Initial Configuration (Commits 1-4)

### **Commit #1: Repository initialization and root documentation**
- **Assigned to**: Team Member 1
- **Branch**: main → dev
- **Purpose**: Set up Git repository, establish baseline documentation
- **Files/Folders**:
  - `.gitignore` (root level - comprehensive)
  - `README.md` (root - main project overview)
  - `.github/` (create folder for workflows - optional)
- **Commands**:
```bash
cd "d:\University Academic Management System"
git init
git config user.name "Team Member 1"
git config user.email "tm1@company.com"
git add .
git commit -m "chore: Initialize Git repository and add root .gitignore"
git branch -M main
git remote add origin https://github.com/YourOrg/iums.git
git push -u origin main
```
- **Commit Message**:
```
chore: Initial Git repository setup with documentation

- Create comprehensive .gitignore for root and subprojects
- Add main README.md with project overview
- Establish branch strategy documentation
- Set up repo structure for GitHub migration
```
- **Push Immediately**: YES (to origin/main)
- **PR Required**: NO (this is the base commit)

---

### **Commit #2: Create dev branch and branching strategy**
- **Assigned to**: Team Member 1
- **Branch**: main → dev (new)
- **Purpose**: Create development branch, document workflow
- **Files/Folders**:
  - `docs/BRANCHING_STRATEGY.md`
  - `docs/CONTRIBUTION_GUIDELINES.md`
- **Commands**:
```bash
git checkout -b dev
git add docs/
git commit -m "docs: Document branching strategy and contribution guidelines"
git push -u origin dev
```
- **Commit Message**:
```
docs: Add branching strategy and contribution guidelines

- Document feature branch naming convention
- Establish PR review process
- Define commit message standards
- Set team workflow expectations
```
- **Push Immediately**: YES (to origin/dev)
- **PR Required**: NO (base branch setup)

---

### **Commit #3: Add Laravel backend configuration and dependencies**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth
- **Purpose**: Commit backend foundation files and dependency manifests
- **Files/Folders**:
  - `server/composer.json`
  - `server/composer.lock` (if exists)
  - `server/.env.example`
  - `server/.gitignore` (verify)
  - `server/artisan`
  - `server/phpunit.xml`
- **Commands**:
```bash
git checkout -b feature/tm1-database-auth
cd server
# Assuming composer.lock exists, add it:
git add composer.json composer.lock .env.example .gitignore artisan phpunit.xml
git commit -m "chore: Add Laravel backend dependencies and configuration"
cd ..
```
- **Commit Message**:
```
chore: Add Laravel 12 backend dependencies and base configuration

- Include composer.json with Laravel framework and dev tools
- Add composer.lock for reproducible dependency installation
- Create .env.example template for environment configuration
- Add phpunit.xml for testing configuration
- Preserve server/.gitignore for sensitive file exclusion
```
- **Push Immediately**: NO (wait for PR + more commits)
- **PR Required**: NO (will include in first batch)

---

### **Commit #4: Add React frontend configuration and dependencies**
- **Assigned to**: Team Member 3
- **Branch**: feature/tm3-frontend-setup
- **Purpose**: Commit frontend foundation files and dependency manifests
- **Files/Folders**:
  - `client/package.json`
  - `client/package-lock.json` (if exists)
  - `client/vite.config.js`
  - `client/eslint.config.js`
  - `client/index.html`
  - `client/.gitignore` (verify)
- **Commands**:
```bash
git checkout -b feature/tm3-frontend-setup
cd client
git add package.json package-lock.json vite.config.js eslint.config.js index.html .gitignore
git commit -m "chore: Add React 19 frontend dependencies and build configuration"
cd ..
```
- **Commit Message**:
```
chore: Add React 19 frontend dependencies and Vite configuration

- Include package.json with React, React Router, Axios
- Add package-lock.json for dependency reproducibility
- Configure Vite as build tool with React support
- Set up ESLint for code quality
- Include main HTML entry point
- Preserve client/.gitignore for node_modules exclusion
```
- **Push Immediately**: NO (wait for PR + more commits)
- **PR Required**: NO (will include in first batch)

---

## Phase 2: Database Layer (Commits 5-18)

### **Commit #5: database/auth — Create users and authentication tables**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Foundation authentication schema
- **Files**:
  - `server/database/migrations/2026_04_05_134201_create_users_table.php`
  - `server/database/migrations/*jobs_table*.php` (Laravel framework)
  - `server/database/migrations/*cache_table*.php` (Laravel framework)
- **Commands**:
```bash
# Still on feature/tm1-database-auth
cd server
git add database/migrations/
git commit -m "database/auth: Create users and framework tables"
cd ..
```
- **Commit Message**:
```
database/auth: Create users authentication table and framework migrations

- Create users table with role field (admin, teacher, student)
- Add password hashing and timestamps
- Define JWT token fields for authentication
- Include Laravel cache and jobs tables for framework
- Enable extensible role-based access control (RBAC)
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #6: database/academic — Create departments, semesters, courses**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Academic structure schema
- **Files**:
  - `server/database/migrations/2026_04_05_134209_create_departments_table.php`
  - `server/database/migrations/2026_04_05_134210_create_semesters_table.php`
  - `server/database/migrations/2026_04_05_134213_create_courses_table.php`
- **Commands**:
```bash
cd server
git add database/migrations/2026_04_05_134209* database/migrations/2026_04_05_134210* database/migrations/2026_04_05_134213*
git commit -m "database/academic: Create departments, semesters, and courses tables"
cd ..
```
- **Commit Message**:
```
database/academic: Create academic structure tables

- Create departments table for organizational units
- Create semesters table for academic periods (Spring, Fall, etc.)
- Create courses table for course catalog with credits and codes
- Add proper foreign keys and timestamps
- Enable course-to-department relationships
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #7: database/users — Create students and teachers linked to users**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: User profile schema
- **Files**:
  - `server/database/migrations/2026_04_05_134211_create_teachers_table.php`
  - `server/database/migrations/2026_04_05_134212_create_students_table.php`
- **Commands**:
```bash
cd server
git add database/migrations/2026_04_05_134211* database/migrations/2026_04_05_134212*
git commit -m "database/users: Create student and teacher profile tables"
cd ..
```
- **Commit Message**:
```
database/users: Create student and teacher extended profile tables

- Create teachers table with department head flag
- Create students table with enrollment status
- Link both to users table via foreign key (polymorphic-ready)
- Add professional meta fields (titles, contact info)
- Support admin-student and admin-teacher relationships
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #8: database/enrollment — Create course offerings and enrollments**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Enrollment management schema
- **Files**:
  - `server/database/migrations/2026_04_05_134214_create_course_offerings_table.php`
  - `server/database/migrations/2026_04_05_134215_create_enrollments_table.php`
- **Commands**:
```bash
cd server
git add database/migrations/2026_04_05_134214* database/migrations/2026_04_05_134215*
git commit -m "database/enrollment: Create course offerings and student enrollments"
cd ..
```
- **Commit Message**:
```
database/enrollment: Create course offerings and enrollment tables

- Create course_offerings table (courses assigned to teachers in semesters)
- Create enrollments table (students enrolled in course offerings)
- Define composite relationships (Course × Teacher × Semester)
- Add enrollment status (active, dropped, completed)
- Enable many-to-many student-course relationships
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #9: database/academics — Create results and marks entry tables**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Academic performance schema
- **Files**:
  - `server/database/migrations/2026_04_05_134216_create_results_table.php`
- **Commands**:
```bash
cd server
git add database/migrations/2026_04_05_134216*
git commit -m "database/academics: Create results and marks entry tables"
cd ..
```
- **Commit Message**:
```
database/academics: Create grades and performance tracking tables

- Create results table for storing student grades per enrollment
- Store marks, grade letters (A, B, C, etc.)
- Calculate GPA components
- Track academic standing
- Enable historical grade tracking
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #10: database/operations — Create attendance and payment tables**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Operations tracking schema
- **Files**:
  - `server/database/migrations/2026_04_07_140817_create_attendance_table.php`
  - `server/database/migrations/2026_04_09_150000_create_payments_table.php`
- **Commands**:
```bash
cd server
git add database/migrations/2026_04_07_140817* database/migrations/2026_04_09_150000*
git commit -m "database/operations: Create attendance and payment tracking tables"
cd ..
```
- **Commit Message**:
```
database/operations: Create attendance and financial tables

- Create attendance table for class attendance records
- Track attendance date, status (present, absent, excused)
- Create payments table for tuition and fee tracking
- Record transaction history and payment status
- Support multiple payment types and deadlines
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #11: database/admin — Create notices, settings, and audit tables**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Admin tools schema
- **Files**:
  - `server/database/migrations/2026_04_08_120000_create_notices_table.php`
  - `server/database/migrations/2026_04_09_022551_create_settings_table.php`
  - `server/database/migrations/2026_04_09_021547_add_head_id_to_departments_table.php`
- **Commands**:
```bash
cd server
git add database/migrations/2026_04_08_120000* database/migrations/2026_04_09_022551* database/migrations/2026_04_09_021547*
git commit -m "database/admin: Create notices, settings, and system tables"
cd ..
```
- **Commit Message**:
```
database/admin: Create administrative and system management tables

- Create notices table for system announcements
- Create settings table for system configuration
- Add department head relationships
- Support admin logs for audit trails
- Enable system-wide configuration management
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #12: seeder/core — Create DatabaseSeeder master and user seeders**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Test data initialization
- **Files**:
  - `server/database/seeders/DatabaseSeeder.php`
  - `server/database/seeders/UserSeeder.php`
- **Commands**:
```bash
cd server
git add database/seeders/DatabaseSeeder.php database/seeders/UserSeeder.php
git commit -m "seeder/core: Create master seeder and user test data generator"
cd ..
```
- **Commit Message**:
```
seeder/core: Create master DatabaseSeeder and UserSeeder

- Implement master seeder that orchestrates all seeding
- Create UserSeeder for 341 test users:
  * 6 admin accounts with admin@123 password
  * 55 teacher accounts with teacher@123 password
  * 280 student accounts with student@123 password
- Use Faker for realistic name and email generation
- Ensure all users are initially active
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #13: seeder/academic — Create institutional data seeders**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Academic structure test data
- **Files**:
  - `server/database/seeders/DepartmentSeeder.php`
  - `server/database/seeders/SemesterSeeder.php`
  - `server/database/seeders/CourseSeeder.php`
- **Commands**:
```bash
cd server
git add database/seeders/DepartmentSeeder.php database/seeders/SemesterSeeder.php database/seeders/CourseSeeder.php
git commit -m "seeder/academic: Create departments, semesters, and courses data"
cd ..
```
- **Commit Message**:
```
seeder/academic: Seed institutional departments and course catalog

- Create department records (CS, Engineering, Business, etc.)
- Seed semesters (Spring 2026, Fall 2026, etc.)
- Generate course catalog with realistic codes and credits
- Assign department heads
- Create realistic course structure for testing
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #14: seeder/enrollment — Create course offerings and enrollments**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Enrollment relationships test data
- **Files**:
  - `server/database/seeders/CourseOfferingSeeder.php`
  - `server/database/seeders/EnrollmentSeeder.php`
- **Commands**:
```bash
cd server
git add database/seeders/CourseOfferingSeeder.php database/seeders/EnrollmentSeeder.php
git commit -m "seeder/enrollment: Create course offerings and student enrollments"
cd ..
```
- **Commit Message**:
```
seeder/enrollment: Link courses to teachers and students to courses

- Create course offerings (assign courses to teachers per semester)
- Enroll students in available course offerings
- Create realistic enrollment patterns
- Ensure data consistency with FK constraints
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #15: seeder/performance — Create grades and attendance records**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Academic performance test data
- **Files**:
  - `server/database/seeders/ResultSeeder.php`
  - Additional attendance seeding logic (if separate)
- **Commands**:
```bash
cd server
git add database/seeders/ResultSeeder.php
git commit -m "seeder/performance: Generate student grades and results"
cd ..
```
- **Commit Message**:
```
seeder/performance: Seed student grades and academic results

- Generate realistic grade distributions (A-F)
- Calculate GPA for each student
- Create grade history for all enrollments
- Support academic standing calculations
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #16: seeder/financial — Create payment records**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Financial test data
- **Files**:
  - `server/database/seeders/PaymentSeeder.php`
- **Commands**:
```bash
cd server
git add database/seeders/PaymentSeeder.php
git commit -m "seeder/financial: Generate payment and tuition records"
cd ..
```
- **Commit Message**:
```
seeder/financial: Create student payment history

- Generate tuition and fee charges
- Create payment records (some pending, some completed)
- Add various payment methods and dates
- Support financial dashboard testing
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #17: database — Add schema.sql reference documentation**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth (continuing)
- **Purpose**: Database documentation
- **Files**:
  - `database/schema.sql`
- **Commands**:
```bash
git add database/schema.sql
git commit -m "docs/database: Add schema.sql for reference documentation"
```
- **Commit Message**:
```
docs/database: Include schema.sql as reference documentation

- Provide SQL schema for quick reference
- Document table relationships and constraints
- Enable offline database structure viewing
- Note: Migrations in server/database/migrations/ are source of truth
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #18: Push feature/tm1-database-auth to GitHub and create PR**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-database-auth
- **Purpose**: Complete database layer, create first PR
- **Commands**:
```bash
# Ensure on feature/tm1-database-auth
git status

# Push all database commits to GitHub
git push -u origin feature/tm1-database-auth

# On GitHub: Create PR from feature/tm1-database-auth → dev
# Title: "feat: Complete database schema and test data"
# Description:
#   ## Changes
#   - 16 database migrations covering all system domains
#   - 7 database seeders with 341 test users
#   - All core tables and relationships
#   
#   ## Ready for
#   - Backend model generation
#   - API endpoint development
```
- **Push Immediately**: YES (to origin/feature/tm1-database-auth)
- **PR Required**: YES - Open PR into dev

---

## Phase 3: Backend Models & Services (Commits 19-28)

**Note**: While waiting for PR approval, Team Lead (TM1) can begin model commits on this branch

### **Commit #19: model/auth — Create User model with auth methods**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: Authentication model
- **Files**:
  - `server/app/Models/User.php`
- **Commands**:
```bash
# After database PR is approved and merged to dev:
git checkout dev
git pull origin dev
git checkout -b feature/tm1-backend-core

cd server
git add app/Models/User.php
git commit -m "model/auth: Create User model with authentication relationships"
cd ..
```
- **Commit Message**:
```
model/auth: Implement User model with role-based relationships

- Create User model with authentication fields
- Define relationships to Student and Teacher profiles
- Implement accessors for role-based properties
- Add timestamps and soft deletes support
- Enable polymorphic role detection
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #20: model/academic — Create Department, Semester, Course models**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: Academic models
- **Files**:
  - `server/app/Models/Department.php`
  - `server/app/Models/Semester.php`
  - `server/app/Models/Course.php`
- **Commands**:
```bash
cd server
git add app/Models/Department.php app/Models/Semester.php app/Models/Course.php
git commit -m "model/academic: Create Department, Semester, and Course models"
cd ..
```
- **Commit Message**:
```
model/academic: Create foundational academic structure models

- Department: Organizational units with head relationships
- Semester: Academic time periods with status management
- Course: Catalog courses with details and credits
- Define all cross-entity relationships
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #21: model/users — Create Student and Teacher models**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: User profile models
- **Files**:
  - `server/app/Models/Student.php`
  - `server/app/Models/Teacher.php`
- **Commands**:
```bash
cd server
git add app/Models/Student.php app/Models/Teacher.php
git commit -m "model/users: Create Student and Teacher profile models"
cd ..
```
- **Commit Message**:
```
model/users: Create Student and Teacher profile models

- Student: Linked to User, includes enrollment status
- Teacher: Linked to User, includes department assignment
- Define relationships to courses and enrollments
- Support extended profile data
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #22: model/enrollment — Create CourseOffering and Enrollment models**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: Enrollment management models
- **Files**:
  - `server/app/Models/CourseOffering.php`
  - `server/app/Models/Enrollment.php`
- **Commands**:
```bash
cd server
git add app/Models/CourseOffering.php app/Models/Enrollment.php
git commit -m "model/enrollment: Create CourseOffering and Enrollment models"
cd ..
```
- **Commit Message**:
```
model/enrollment: Create course offering and enrollment models

- CourseOffering: Courses assigned to teachers in semesters
- Enrollment: Studen enrollment in course offerings
- Define cascading relationships
- Support enrollment status tracking and history
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #23: model/academics — Create Result, Attendance, and Marks models**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: Performance tracking models
- **Files**:
  - `server/app/Models/Result.php`
  - `server/app/Models/Attendance.php`
  - `server/app/Models/MarksEntry.php`
- **Commands**:
```bash
cd server
git add app/Models/Result.php app/Models/Attendance.php app/Models/MarksEntry.php
git commit -m "model/academics: Create Result, Attendance, and Marks models"
cd ..
```
- **Commit Message**:
```
model/academics: Create academic performance tracking models

- Result: Student grades per enrollment with GPA
- Attendance: Class attendance records per student per course
- MarksEntry: Intermediate marks entry by teachers
- Support grading scales and academic standing
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #24: model/operations — Create Payment, Notice, Setting models**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: Operational models
- **Files**:
  - `server/app/Models/Payment.php`
  - `server/app/Models/Notice.php`
  - `server/app/Models/Setting.php`
  - `server/app/Models/AdminLog.php`
- **Commands**:
```bash
cd server
git add app/Models/Payment.php app/Models/Notice.php app/Models/Setting.php app/Models/AdminLog.php
git commit -m "model/operations: Create Payment, Notice, Setting, and AdminLog models"
cd ..
```
- **Commit Message**:
```
model/operations: Create administrative and system models

- Payment: Student payment records and tuition tracking
- Notice: System notifications and announcements
- Setting: System configuration key-value pairs
- AdminLog: Audit trail for administrative actions
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #25: service/jwt — Implement JWT authentication service**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: Authentication service
- **Files**:
  - `server/app/Services/JwtService.php`
- **Commands**:
```bash
cd server
git add app/Services/JwtService.php
git commit -m "service/jwt: Implement JWT token generation and validation"
cd ..
```
- **Commit Message**:
```
service/jwt: Create JWT authentication service

- Implement token generation on login
- Support token validation for protected routes
- Add token refresh logic
- Handle token expiration and blacklisting
- Enable multi-role token claims
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #26: config — Create and configure authentication and CORS**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: Configuration setup
- **Files**:
  - `server/config/auth.php`
  - `server/config/cors.php`
  - `server/config/app.php`
- **Commands**:
```bash
cd server
git add config/auth.php config/cors.php config/app.php
git commit -m "config: Set up authentication, CORS, and application settings"
cd ..
```
- **Commit Message**:
```
config: Configure authentication, CORS, and application

- Enable JWT authentication driver
- Configure CORS for localhost:5174 (React frontend)
- Set application locale and timezone
- Define environment-specific settings
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #27: middleware — Create JWT auth and container middleware**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: Middleware setup
- **Files**:
  - `server/app/Http/Middleware/` (all JWT/auth middleware files)
- **Commands**:
```bash
cd server
git add app/Http/Middleware/
git commit -m "middleware: Create JWT authentication and container middleware"
cd ..
```
- **Commit Message**:
```
middleware: Implement JWT and authentication middleware layer

- Create JWT verification middleware
- Implement role-based authorization middleware
- Add CORS handling middleware
- Support middleware grouping for route protection
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #28: Push feature/tm1-backend-core and create PR**
- **Assigned to**: Team Member 1
- **Branch**: feature/tm1-backend-core
- **Purpose**: Complete backend core, create PR
- **Commands**:
```bash
git push -u origin feature/tm1-backend-core

# On GitHub: Create PR from feature/tm1-backend-core → dev
```
- **Push Immediately**: YES
- **PR Required**: YES

---

## Phase 4: Backend API Controllers & Routes (Commits 29-85)

**Note**: Team Member 2 begins controller development once models are merged

### **Commit #29: controller/auth — Implement authentication endpoints**
- **Assigned to**: Team Member 2
- **Branch**: feature/tm2-backend-academic
- **Purpose**: Authentication controller
- **Files**:
  - `server/app/Http/Controllers/AuthController.php`
- **Commands**:
```bash
# After TM1's backend-core PR is merged
git checkout dev
git pull origin dev
git checkout -b feature/tm2-backend-academic

cd server
git add app/Http/Controllers/AuthController.php
git commit -m "controller/auth: Implement login, register, logout endpoints"
cd ..
```
- **Commit Message**:
```
controller/auth: Create authentication endpoints

- POST /auth/login - Authenticate user and return JWT
- POST /auth/register - Create new user account
- POST /auth/logout - Invalidate JWT token
- Include password validation and error handling
- Support multi-role authentication (admin, teacher, student)
```
- **Push Immediately**: NO
- **PR Required**: NO

---

### **Commit #30-31: controller/user — Implement user management (2 commits)**

**Commit #30: Basic user operations**
- **Files**: `server/app/Http/Controllers/UserController.php` (index, show, store)
- **Commit Message**: User listing, retrieval, and creation

**Commit #31: User update and deletion**
- **Files**: (continuation of UserController - update, destroy methods)
- **Commit Message**: User updates and deletion operations

[Due to length, these are abbreviated. Each follows the same structure as Commit #29]

---

### **Commit #32-35: controller/academic — Academic management (4 commits)**

**Commit #32**: DepartmentController (CRUD)
**Commit #33**: SemesterController (CRUD)
**Commit #34**: CourseController (CRUD + listing)
**Commit #35**: CourseOfferingController (assignments, schedules)

---

### **Commit #36-39: controller/enrollment — Enrollment system (4 commits)**

**Commit #36**: EnrollmentController (student self-enrollment)
**Commit #37**: EnrollmentController (availability checks)
**Commit #38**: EnrollmentController (admin enrollment management)
**Commit #39**: EnrollmentController (enrollment history and status)

---

### **Commit #40-42: controller/academics-grades — Grade management (3 commits)**

**Commit #40**: ResultController (view grades, GPA calculation)
**Commit #41**: ResultController (admin grade entry)
**Commit #42**: ResultController (grade reporting and transcripts)

---

### **Comm...

#### [TRUNCATED FOR SPACE - See next section for complete commit details]

---

## Phase 5: Frontend Application (Commits continued...)

Due to document length constraints, I'll provide the continued commit structure:

### **Frontend Commits Structure** (TM3 - Team Member 3):

- **Commits 86-89**: Frontend setup (Vite, React Router, main layout)
- **Commits 90-95**: Authentication pages and context
- **Commits 96-115**: Student pages (6 pages)  
- **Commits 116-127**: Teacher pages (6 pages)
- **Commits 128-139**: Admin pages (6 pages)
- **Commits 140-145**: Components and hooks
- **Commits 146-150**: API integration and styling
- **Commits 151-155**: Documentation and final QA

---

## 📌 IMPORTANT NOTES FOR CONTINUATION

This document continues in a separate file: `GIT_MIGRATION_COMMIT_DETAILED.md`

Each commit should:
1. Build successfully
2. Not break existing functionality
3. Be logically cohesive
4. Include related files only
5. Have a clear, descriptive message

---

# Important PRStart Strategy

After each batch of 15-20 commits:
1. Push feature branch to GitHub
2. Create PR with comprehensive description
3. Team Member 1 reviews and merges
4. All 3 team members sync: `git checkout dev && git pull origin dev`
5. Next team member creates new feature branch from dev
6. Process repeats

---

**END OF SECTION B & C EXCERPT**

**Full detailed commit list will be in companion document**

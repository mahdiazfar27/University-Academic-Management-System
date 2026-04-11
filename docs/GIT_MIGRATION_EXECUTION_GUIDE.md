# 🚀 GIT MIGRATION EXECUTION GUIDE
## University Academic Management System - Ready-to-Execute Workflow

**Project**: University Academic Management System  
**Repository**: https://github.com/mahdiazfar27/University-Academic-Management-System  
**Team**: Mahdi (Lead), Redowan, Rupam  
**Status**: Ready to execute  
**Last Updated**: April 11, 2026

---

## 📋 TABLE OF CONTENTS

1. [Pre-Execution Setup](#pre-execution-setup)
2. [Team Member Configuration](#team-member-configuration)
3. [Phase Execution Timeline](#phase-execution-timeline)
4. [Command Reference](#command-reference)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 PRE-EXECUTION SETUP

### **Step 1: Collect Team Credentials**

Before starting, gather:

```
MAHDI (Team Lead):
  - GitHub username:
  - Email:
  - Local machine path: C:\Dev\ or D:\Dev\ ?

REDOWAN (Team Member 2):
  - GitHub username:
  - Email:
  - Local machine path:

RUPAM (Team Member 3):
  - GitHub username:
  - Email:
  - Local machine path:

GITHUB REPOSITORY:
  - Repository URL:
  - Is it private or public?
  - Are all 3 team members added as collaborators?
```

### **Step 2: Verify Repository State**

**Mahdi executes**:

```bash
cd d:\University-Academic-Management-System

# Verify current state
git status
git branch -a
git remote -v

# Expected output:
#   On branch: dev
#   Remote origin: https://github.com/mahdiazfar27/University-Academic-Management-System
#   Branches: main, dev, feature/tm1-database-auth
```

### **Step 3: Configure Git for All Team Members**

**Each team member on their machine**:

```bash
# MAHDI
git config --global user.name "Mahdi"
git config --global user.email "mahdi@example.com"

# REDOWAN
git config --global user.name "Redowan"
git config --global user.email "redowan@example.com"

# RUPAM
git config --global user.name "Rupam"
git config --global user.email "rupam@example.com"

# Verify
git config --global user.name
git config --global user.email
```

### **Step 4: Clone Repository (if needed)**

If team members don't have a local copy:

```bash
# All team members
git clone https://github.com/mahdiazfar27/University-Academic-Management-System.git
cd University-Academic-Management-System

# Checkout dev
git checkout dev
git pull origin dev
```

### **Step 5: Install Dependencies (Optional)**

If running locally for testing:

```bash
# Backend
cd server
composer install

# Frontend
cd ../client
npm install
```

---

## 👥 TEAM MEMBER CONFIGURATION

### **Mahdi's Setup (Team Lead)**

**Responsibility**:
- Database layer (migrations, seeders)
- Backend models and controllers
- API endpoints
- PR reviews and merges
- Release management

**Branches to manage**:
- `feature/mahdi-database-core` (commits 1-25)
- `feature/mahdi-backend-api` (commits 26-40)

**Configuration**:

```bash
git config --local user.name "Mahdi"
git config --local user.email "mahdi@email.com"

# Add SSH key (recommended for frequent pushes)
# Instructions: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

---

### **Redowan's Setup (Frontend Developer)**

**Responsibility**:
- React frontend infrastructure
- All page components (admin, student, teacher)
- Routing and state management
- API integration

**Branches to manage**:
- `feature/redowan-frontend-setup` (commits 41-50)
- `feature/redowan-frontend-pages` (commits 51-66)

**Configuration**:

```bash
git config --local user.name "Redowan"
git config --local user.email "redowan@email.com"
```

---

### **Rupam's Setup (DevOps & Documentation)**

**Responsibility**:
- Documentation organization
- Build and deployment configuration
- CI/CD setup
- Testing guides
- GitHub Actions workflows

**Branches to manage**:
- `feature/rupam-docs-testing` (commits 67-79)
- `feature/rupam-devops-build` (commits 80-100)

**Configuration**:

```bash
git config --local user.name "Rupam"
git config --local user.email "rupam@email.com"
```

---

## 📅 PHASE EXECUTION TIMELINE

### **PHASE 1: Mahdi - Database Layer (Commits 1-25)**

**Duration**: ~1-2 days  
**Branch**: `feature/mahdi-database-core`

**Execution Steps**:

```bash
# Step 1: Create feature branch
git checkout dev
git pull origin dev
git checkout -b feature/mahdi-database-core

# Step 2: Add all database-related files and commit
# (Follow individual commit commands in Section D)

# After all 25 commits are made:
git push -u origin feature/mahdi-database-core

# Step 3: Create PR on GitHub
# - URL: https://github.com/mahdiazfar27/REPO/pulls
# - Base: dev
# - Compare: feature/mahdi-database-core
# - Title: "feat: Add complete database schema and models"
# - Description: See commit summary

# Step 4: Self-review and merge (as lead)
# - Click "Merge pull request"
# - Delete feature branch after merge
```

**Commits in this phase**:

```
1.  chore: Initialize Git repository with root documentation
2.  chore: Create dev integration branch with workflow guidelines
3.  chore: Add root-level configuration for consistency
4.  chore: Add Laravel backend dependencies and configuration
5.  chore: Add React frontend dependencies and Vite configuration
6.  database/core: Create base users and framework tables
7.  database/academic: Create departments, semesters, and courses
8.  database/roles: Create teacher and student profile tables
9.  database/enrollment: Create course offerings and enrollments
10. database/performance: Create results and attendance tracking
11. database/operations: Create payments, notices, settings, admin
12. seeder/users: Create master seeder and user test data
13. seeder/academic: Add departments, semesters, course data
14. seeder/enrollment: Create course offerings and enrollments
15. seeder/performance: Add grades and teacher assignments
16. seeder/operations: Add payments and financial tests
17. model/core: Add User, Student, Teacher models
18. model/academic: Add Department, Semester, Course models
19. model/enrollment: Add CourseOffering, Enrollment models
20. model/operations: Add Result, Attendance, Payment, Notice models
21. service/jwt: Implement JWT authentication service
22. middleware: Add JWT verification and CORS middleware
23. chore: Add Service Providers and auth configuration
24. route: Add API and web route definitions
25. chore: Add complete Laravel configuration suite
```

---

### **PHASE 2: Mahdi - Backend API Controllers (Commits 26-40)**

**Duration**: ~2-3 days  
**Branch**: `feature/mahdi-backend-api`

**Wait for**: Phase 1 PR merged into dev

```bash
# Step 1: Sync with dev
git checkout dev
git pull origin dev

# Step 2: Create new feature branch
git checkout -b feature/mahdi-backend-api

# Step 3: Add controller files (commits 26-40)
# (Follow individual commit commands)

# After all 15 controller commits:
git push -u origin feature/mahdi-backend-api

# Create and merge PR
```

**Controllers added**:
```
AuthController, UserController, StudentController, TeacherController,
DepartmentController, SemesterController, CourseController,
CourseOfferingController, EnrollmentController, ResultController,
AttendanceController, PaymentController, NoticeController,
SettingController, [Support files]
```

---

### **PHASE 3: Redowan - Frontend Setup (Commits 41-50)**

**Duration**: ~2 days  
**Branch**: `feature/redowan-frontend-setup`

**Wait for**: Phase 2 PR merged into dev

```bash
# Step 1: Sync with dev
git checkout dev
git pull origin dev

# Step 2: Create feature branch
git checkout -b feature/redowan-frontend-setup

# Step 3: Add frontend infrastructure files
# - Entry points (main.jsx, App.jsx)
# - Router setup
# - Layouts and components
# - Context and hooks
# - API service layer

# After all infrastructure commits:
git push -u origin feature/redowan-frontend-setup

# Create and merge PR
```

---

### **PHASE 4: Redowan - Frontend Pages (Commits 51-66)**

**Duration**: ~3-4 days  
**Branch**: `feature/redowan-frontend-pages`

**Can start after**: Phase 3 PR merged

```bash
# Step 1: Sync and create branch
git checkout dev
git pull origin dev
git checkout -b feature/redowan-frontend-pages

# Step 2: Add all page components
# - Admin pages (6-7 pages)
# - Student pages (6 pages)
# - Teacher pages (6 pages)

# After all page commits:
git push -u origin feature/redowan-frontend-pages

# Create and merge PR
```

---

### **PHASE 5: Rupam - Docs & DevOps (Commits 67-100)**

**Duration**: ~3-4 days  
**Branch**: `feature/rupam-docs-testing` + `feature/rupam-devops-build`

**Can start**: Parallel with front-end development

**Commits breakdown**:

```
67-74:   Documentation organization (8 commits)
75-79:   Test data and database scripts (5 commits)
80-85:   Build configuration (6 commits)
86-90:   CI/CD and GitHub Actions (5 commits)
91-95:   Deployment and production (5 commits)
96-100:  Final documentation and QA (5 commits)
```

```bash
# Step 1: Create first branch
git checkout dev
git pull origin dev
git checkout -b feature/rupam-docs-testing

# Add documentation commits 67-79
# Push and merge to dev

# Step 2: Create second branch
git checkout dev
git pull origin dev
git checkout -b feature/rupam-devops-build

# Add build/DevOps commits 80-100
# Push and merge to dev
```

---

## 🔗 COMMAND REFERENCE

### **Git Workflow Commands**

**Creating a feature branch**:
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-name-purpose
```

**Viewing changes**:
```bash
git status                    # What files changed
git diff                      # Detailed changes
git diff --staged             # Staged changes only
git log --oneline -10         # Recent commits
```

**Staging and committing**:
```bash
# Stage specific files
git add path/to/file1 path/to/file2

# Stage a directory
git add server/app/Http/Controllers/

# Stage everything in current directory
git add .

# Commit
git commit -m "feat: Descriptive message"

# Amend last commit (only if not pushed)
git commit --amend --no-edit
```

**Pushing**:
```bash
# First time pushing a branch
git push -u origin feature/name

# Subsequent pushes
git push

# Force push (DANGEROUS - use --force-with-lease)
git push --force-with-lease
```

**Syncing with dev**:
```bash
# Fetch latest updates
git fetch origin

# Rebase on dev
git rebase origin/dev

# Or merge (creates merge commit)
git merge origin/dev
```

**Viewing history**:
```bash
# Your commits on this branch vs dev
git log origin/dev..HEAD --oneline

# All commits on the repository
git log --oneline --all

# Graph visualization
git log --oneline --graph --all
```

---

### **Commit Message Template**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `chore`: Maintenance tasks
- `test`: Testing

**Examples**:
```bash
git commit -m "feat(auth): Add JWT login endpoint"
git commit -m "fix(enrollment): Resolve duplicate enrollment bug"
git commit -m "docs: Update API documentation"
git commit -m "chore: Add database migrations"
```

---

## 🐛 TROUBLESHOOTING

### **Issue: "Permission denied" when trying to push**

**Solution**:
```bash
# Set up SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to ssh-agent (on Windows in PowerShell):
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent

# Add the key
ssh-add $env:USERPROFILE\.ssh\id_ed25519

# Test connection
ssh -T git@github.com
```

---

### **Issue: "Conflict" when pulling or merging**

**Solution**:
```bash
# View conflicts
git status

# Open conflicted files and manually resolve
# Look for: <<<<< HEAD, =====, >>>>>

# After fixing, stage resolved files
git add path/to/resolved-file

# Continue rebase
git rebase --continue

# Or abort and try again
git rebase --abort
```

---

### **Issue: "Branch is behind origin"**

**Solution**:
```bash
# Fetch latest
git fetch origin

# Rebase your commits on top
git rebase origin/dev

# If it fails, abort and try merge instead
git rebase --abort
git merge origin/dev

# Push (may need --force-with-lease if rebased)
git push origin feature/branch
```

---

### **Issue: Accidentally committed to `dev` instead of feature branch**

**Solution**:
```bash
# Create the feature branch (moves your commits)
git branch feature/correct-name

# Reset dev to where it should be
git reset --hard origin/dev

# Switch to feature branch
git checkout feature/correct-name

# Verify commits are there
git log --oneline -5

# Push feature branch
git push -u origin feature/correct-name
```

---

### **Issue: Need to undo a commit before pushing**

**Solution**:
```bash
# View recent commits
git log --oneline

# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Or undo last commit, keep changes unstaged
git reset HEAD~1

# Or undo last commit and discard changes (DANGEROUS)
git reset --hard HEAD~1
```

---

### **Issue: ".env or secrets accidentally committed"**

**Solution**:
```bash
# DO NOT PUSH YET

# Remove file from Git (but keep locally)
git rm --cached .env

# Add to .gitignore
echo ".env" >> .gitignore

# Commit the fix
git commit -m "chore: Remove .env from tracking"

# Now safe to push
git push

# If already pushed, contact Mahdi to force push
```

---

## 📞 SUPPORT & ESCALATION

### **Questions or Issues?**

1. **Git-related**: Check GitHub Help (https://docs.github.com/)
2. **Merge conflicts**: Ask Mahdi for help
3. **Repository access**: Contact repository owner
4. **Feature questions**: Discuss with team

### **Mahdi (Team Lead) Responsibilities**

- Review all PRs before merging
- Resolve complex merge conflicts
- Manage releases to main
- Handle GitHub settings and permissions

---

## ✅ FINAL CHECKLIST BEFORE EXECUTION

- [ ] All 3 team members have GitHub accounts
- [ ] All 3 added as collaborators to the repository
- [ ] Each team member has cloned the repository locally
- [ ] Git is configured with correct user names and emails
- [ ] SSH keys are set up (or HTTPS credentials ready)
- [ ] All team members are on `dev` branch locally
- [ ] `.env` files are in `.gitignore` (verified)
- [ ] `node_modules/` and `vendor/` are in `.gitignore` (verified)
- [ ] Branch protection rules are enabled on GitHub (recommended)
- [ ] Everyone has read this guide and understands the workflow

---

**Status**: Ready to start execution!

**Next Step**: Mahdi begins Phase 1 (Database Layer) by creating `feature/mahdi-database-core` branch and executing commits 1-25.

# Git Branching Strategy & Workflow Rules

## Overview
This document establishes the branching strategy and workflow rules for the University-Academic-Management-System project. All team members must adhere to these guidelines.

## 🌳 GitHub Branch Architecture

```
main
 └─ (only receives merges from dev - never direct commits)
    
dev (primary integration branch)
 ├─ feature/tm1-database-auth          (Mahdi - Team Lead)
 ├─ feature/tm1-backend-core           (Mahdi - Team Lead)
 ├─ feature/tm2-backend-academic       (Redowan - Backend)
 ├─ feature/tm2-backend-operations     (Redowan - Backend)
 ├─ feature/tm3-frontend-setup         (Rupam - Frontend)
 ├─ feature/tm3-frontend-pages         (Rupam - Frontend)
 └─ feature/tm3-frontend-integration   (Rupam - Frontend)
```

## 📋 Branch Naming Convention

**Format**: `feature/tm{N}-{purpose}`

Where:
- `tm{N}` = Team Member number (1, 2, or 3)
  - TM1 = Mahdi (Team Lead)
  - TM2 = Redowan (Backend Developer)
  - TM3 = Rupam (Frontend Developer)
- `{purpose}` = What this branch accomplishes

**Examples**:
- ✅ `feature/tm1-database-auth`
- ✅ `feature/tm2-backend-academic`
- ✅ `feature/tm3-frontend-setup`

## ⚙️ Workflow Rules (STRICT)

### Rule 1: No Direct Commits to main
❌ DO NOT: `git push origin main`  
✅ DO: Create a feature branch and PR into dev

### Rule 2: No Direct Commits to dev
❌ DO NOT: `git push origin dev` without creating a PR  
✅ DO: Push to feature branch, create PR, have Team Lead review & merge

### Rule 3: Each Team Member Owns Their Branches
- **Team Member 1 (Mahdi)**: All commits to `feature/tm1-*` branches
- **Team Member 2 (Redowan)**: All commits to `feature/tm2-*` branches
- **Team Member 3 (Rupam)**: All commits to `feature/tm3-*` branches
- Only Mahdi (Team Lead) can merge into dev

### Rule 4: PR Review Checklist
Before approving any PR into dev:
- ✅ All commits are logically grouped
- ✅ Commit messages are clear and descriptive
- ✅ Code builds/runs without errors
- ✅ No sensitive files (.env, node_modules, vendor) included
- ✅ Documentation is updated if needed

### Rule 5: Branch Protection (GitHub Settings)
```
dev branch:
  - Require pull request reviews (at least 1 approval)
  - Require status checks to pass
  - Dismiss stale reviews
  - Require branches up to date

main branch:
  - Require pull request reviews (at least 2 approvals)
  - Require status checks to pass
  - Dismiss stale reviews
  - Require branches up to date
```

## 🔄 PR & Merge Workflow

### Creating a Pull Request
1. All commits on feature branch are complete
2. Feature branch is pushed to GitHub
3. On GitHub, create PR: `feature/* → dev`
4. Add PR title and description
5. Request review from Team Member 1 (Mahdi - the lead)

### Team Lead Review & Merge
1. Mahdi reviews all commits in PR
2. Optionally adds review comments
3. If approved: Merge into dev ("Squash and merge" or "Create a merge commit")
4. Delete the feature branch on GitHub

### Post-Merge Workflow
```bash
# Return to dev and pull latest
git checkout dev
git pull origin dev

# Delete old feature branch locally
git branch -d feature/tm{N}-...

# Create next feature branch
git checkout -b feature/tm{N}-next-purpose
```

## 🎯 Commit Message Format

### Template
```
<component>: <concise description>

<optional detailed explanation>

Related to: <issue/ticket if applicable>
```

### Examples
```
✅ GOOD:
database/auth: Create users table with JWT support
model/user: Add Student and Teacher relationship models
controller/auth: Implement login endpoint with token generation

❌ BAD:
fix bug
updated
stuff
```

### Component Prefixes
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

## 📌 Initial Setup Commands

### Team Lead (Mahdi) - First Time Setup
```bash
cd /path/to/repo
git init
git config user.name "Mahdi Azfar Talukder"
git config user.email "mahdi.azfar.talukder@gmail.com"
git remote add origin https://github.com/mahdiazfar27/University-Academic-Management-System.git

# Create branches
git checkout -b main
git checkout -b dev
git push -u origin main
git push -u origin dev
```

### Other Team Members - First Time Setup
```bash
# Clone the repository
git clone https://github.com/mahdiazfar27/University-Academic-Management-System.git
cd University-Academic-Management-System

# Configure git locally
git config user.name "Your Name"
git config user.email "your_email@example.com"

# Create your feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/tm{N}-purpose
```

## 🔓 Commonly Used Commands

### Creating a Feature Branch
```bash
git checkout dev
git pull origin dev
git checkout -b feature/tm{N}-purpose
```

### Committing Changes
```bash
git add <files>
git commit -m "component: Description of changes"
git push -u origin feature/tm{N}-purpose  # First push
git push origin feature/tm{N}-purpose      # Subsequent pushes
```

### Updating Your Feature Branch with Latest dev
```bash
git fetch origin
git rebase origin/dev
# Or merge if you prefer:
# git merge origin/dev
```

### Cleaning Up Local Branches
```bash
# Delete local branch
git branch -d feature/tm{N}-purpose

# List branches
git branch -a
```

---

**Last Updated**: April 2026  
**Team Lead**: Mahdi Azfar Talukder (mahdiazfar27)

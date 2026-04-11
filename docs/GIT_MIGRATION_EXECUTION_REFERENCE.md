# SECTION D — Quick Reference & Execution Commands

## 🚀 Quick Start Checklist

### **Pre-Migration Setup (One-Time)**

```bash
# 1. Navigate to project
cd "d:\University Academic Management System"

# 2. Initialize Git
git init
git config user.name "Your Name"
git config user.email "your.email@company.com"

# 3. Add remote (after creating repo on GitHub)
git remote add origin https://github.com/YourOrg/iums.git

# 4. Verify .gitignore files exist
ls -la server/.gitignore client/.gitignore

# 5. Create initial branches
git add .
git checkout -b main
git commit -m "chore: Initial commit with project structure"
git push -u origin main
git checkout -b dev
git push -u origin dev
```

---

## 👤 Team Member Workflow

### **Team Member 1 (Lead) - Database & Backend Core**

```bash
# After initial setup
git checkout dev
git pull origin dev
git checkout -b feature/tm1-database-auth

# Make 16 database commits (seeds 1-16)
# Make 11 model commits (seeds 17-27)
# Then push and create PR

git push -u origin feature/tm1-database-auth
# On GitHub → Create PR to dev

# After merge, start next branch
git checkout dev
git pull origin dev
git checkout -b feature/tm1-backend-additional
# Continue with additional work...
```

---

### **Team Member 2 (Backend Developer) - Controllers & Routes**

```bash
# Wait for TM1's feature branches to merge into dev
git checkout dev
git pull origin dev

# Create feature branch for controllers
git checkout -b feature/tm2-backend-academic

# Implement controllers (Commits 29-65)
# Group by domain: Auth, User, Academic, Enrollment, Grades, etc.

git push -u origin feature/tm2-backend-academic
# On GitHub → Create PR to dev

# After merge, continue in same branch or create new
git checkout dev
git pull origin dev
git checkout -b feature/tm2-backend-operations
# More controller work...
```

---

### **Team Member 3 (Frontend Developer) - React App**

```bash
# Wait for backend to be stable (at least TM1 merged)
git checkout dev
git pull origin dev

# Create feature branch for frontend setup
git checkout -b feature/tm3-frontend-setup

# Implement Vite config and basic structure
git commit -m "..." 
git push -u origin feature/tm3-frontend-setup

# After approval, continue with pages
git checkout dev
git pull origin dev
git checkout -b feature/tm3-frontend-student
# Implement student pages...

# Pattern continues for teacher and admin pages
```

---

## 📝 Complete Commit Reference (110+ Commits)

### **PHASE 1: Setup (Commits 1-4)**
1. ✅ Repository initialization and documentation
2. ✅ Create dev branch and branching strategy docs
3. ✅ Add Laravel backend configuration
4. ✅ Add React frontend configuration

---

### **PHASE 2: Database Layer (Commits 5-17)**
5. ✅ Create users and auth tables
6. ✅ Create departments, semesters, courses tables
7. ✅ Create student and teacher profile tables
8. ✅ Create course offerings and enrollments tables
9. ✅ Create results and marks tables
10. ✅ Create attendance and payment tables
11. ✅ Create notices, settings, admin tables
12. ✅ Create DatabaseSeeder and UserSeeder (341 users)
13. ✅ Create department, semester, course seeders
14. ✅ Create course offering and enrollment seeders
15. ✅ Create result and performance seeders
16. ✅ Create payment seeder
17. ✅ Add schema.sql reference

**Branch**: feature/tm1-database-auth → PR #1 → MERGE

---

### **PHASE 3: Models & Services (Commits 18-27)**
18. ✅ User model with auth relationships
19. ✅ Department, Semester, Course models
20. ✅ Student and Teacher profile models
21. ✅ CourseOffering and Enrollment models
22. ✅ Result, Attendance, MarksEntry models
23. ✅ Payment, Notice, Setting, AdminLog models
24. ✅ JwtService for authentication
25. ✅ Authentication and CORS configuration
26. ✅ JWT and container middleware
27. ✅ Base Controller class

**Branch**: feature/tm1-backend-core → PR #2 → MERGE

---

### **PHASE 4: Backend Controllers (Commits 28-65)**

#### Authentication (3 commits)
28. ✅ AuthController: login, register, logout
29. ✅ AuthController: password reset, token refresh
30. ✅ AuthController: multi-role authentication

#### User Management (4 commits)
31. ✅ UserController: CRUD operations
32. ✅ UserController: role management
33. ✅ UserController: bulk operations
34. ✅ UserController: user search and filters

#### Academic Management (6 commits)
35. ✅ DepartmentController: CRUD
36. ✅ DepartmentController: department heads, hierarchy
37. ✅ SemesterController: CRUD
38. ✅ CourseController: CRUD and catalog
39. ✅ CourseOfferingController: assignments
40. ✅ CourseOfferingController: scheduling

#### Enrollment Management (6 commits)
41. ✅ EnrollmentController: self-enrollment
42. ✅ EnrollmentController: availability checks
43. ✅ EnrollmentController: admin enrollment
44. ✅ EnrollmentController: enrollment history
45. ✅ EnrollmentController: drop/add courses
46. ✅ EnrollmentController: enrollment reports

#### Academic Performance (5 commits)
47. ✅ ResultController: view grades
48. ✅ ResultController: GPA calculation
49. ✅ ResultController: admin grade entry
50. ✅ ResultController: grade transcripts
51. ✅ ResultController: grade distribution reports

#### Attendance Tracking (5 commits)
52. ✅ AttendanceController: view attendance
53. ✅ AttendanceController: record attendance
54. ✅ AttendanceController: attendance sheets
55. ✅ AttendanceController: attendance reports
56. ✅ AttendanceController: student attendance summary

#### Payment & Fees (4 commits)
57. ✅ PaymentController: view payments
58. ✅ PaymentController: record payment
59. ✅ PaymentController: payment history
60. ✅ PaymentController: fee calculation

#### Administrative Functions (4 commits)
61. ✅ NoticeController: create/manage notices
62. ✅ SettingController: system settings
63. ✅ TeacherController: teacher profiles
64. ✅ StudentController: student profiles

**Branch**: feature/tm2-backend-academic → PR #3 → MERGE

---

### **PHASE 5: API Routes & Integration (Commits 66-72)**
65. ✅ API routes for auth endpoints (/api/v1/auth/*)
66. ✅ API routes for user endpoints (/api/v1/users/*)
67. ✅ API routes for academic endpoints (/api/v1/departments, courses, etc.)
68. ✅ API routes for enrollment (/api/v1/enrollments/*)
69. ✅ API routes for results and grades (/api/v1/results/*)
70. ✅ API routes for attendance (/api/v1/attendance/*)
71. ✅ API routes for payments (/api/v1/payments/*)
72. ✅ API routes for admin functions

**Branch**: feature/tm2-backend-operations → PR #4 → MERGE

---

### **PHASE 6: Frontend Setup (Commits 73-76)**
73. ✅ Vite configuration and entry point
74. ✅ React Router setup with layout structure
75. ✅ AuthContext and NotificationContext
76. ✅ Main App component and CSS

**Branch**: feature/tm3-frontend-setup → PR #5 → MERGE

---

### **PHASE 7: Frontend Authentication (Commits 77-81)**
77. ✅ LoginPage with form and validation
78. ✅ LoginPage styling (CSS module)
79. ✅ LandingPage and navigation
80. ✅ PrivateRoute wrapper for protected pages
81. ✅ useAuth hook and session management

**Branch**: feature/tm3-frontend-student (first batch) → PR #6 → MERGE

---

### **PHASE 8: Student Portal (Commits 82-103)**

#### Student Dashboard & Core Pages (4 commits)
82. ✅ StudentLayout with sidebar and header
83. ✅ Dashboard page with overview cards
84. ✅ Dashboard styling
85. ✅ Profile page and profile updates

#### Student Academic Views (6 commits)
86. ✅ ClassRoutine page - course schedule
87. ✅ ClassRoutine styling
88. ✅ Results page - grades and GPA
89. ✅ Results styling
90. ✅ Results calculation helpers
91. ✅ Transcript view component

#### Student Finance & Admin (4 commits)
92. ✅ PaymentHistory page - tuition tracking
93. ✅ PaymentHistory styling
94. ✅ NameCorrection page - profile updates
95. ✅ NameCorrection styling

#### Student Components (2 commits)
96. ✅ EnrollmentCard and CourseCard components
97. ✅ StudentLayout sidebar navigation

**Branches**: 
- feature/tm3-frontend-student (commits 82-97) → PR #7 → MERGE

---

### **PHASE 9: Teacher Portal (Commits 104-120)**

#### Teacher Dashboard & Core (4 commits)
98. ✅ TeacherLayout with sidebar and header
99. ✅ Dashboard page - overview and stats
100. ✅ Dashboard styling
101. ✅ MyCourses page - assigned courses

#### Teacher Academic Operations (6 commits)
102. ✅ MyCourses styling
103. ✅ MarksEntry page - grade management
104. ✅ MarksEntry styling and form validation
105. ✅ Attendance page - mark attendance
106. ✅ Attendance styling
107. ✅ Schedule page - view class timetable

#### Teacher Communication (4 commits)
108. ✅ Schedule styling
109. ✅ Notices page - course announcements
110. ✅ Notices styling and creation form
111. ✅ TeacherLayout navigation sidebar

**Branch**: feature/tm3-frontend-teacher (commits 98-111) → PR #8 → MERGE

---

### **PHASE 10: Admin Portal (Commits 112-127)**

#### Admin Dashboard & Core (3 commits)
112. ✅ AdminLayout with menu and header
113. ✅ Dashboard page - system stats
114. ✅ Dashboard styling

#### Admin Management (6 commits)
115. ✅ UserManagement page - user CRUD
116. ✅ UserManagement styling and forms
117. ✅ DepartmentManagement page
118. ✅ DepartmentManagement styling
119. ✅ CourseManagement page
120. ✅ CourseManagement styling

#### Admin Settings & Notices (4 commits)
121. ✅ Settings page - system configuration
122. ✅ Settings styling
123. ✅ AdminNotices page - announcements
124. ✅ AdminNotices styling

**Branch**: feature/tm3-frontend-admin (commits 112-127) → PR #9 → MERGE

---

### **PHASE 11: Shared Components & Utilities (Commits 128-135)**

#### UI Components (4 commits)
128. ✅ Header component - navbar
129. ✅ Sidebar component - navigation
130. ✅ NotificationPopup component
131. ✅ Shared button, card, input, modal components

#### Hooks & Context (3 commits)
132. ✅ useForm - form state and validation
133. ✅ usePagination - pagination logic
134. ✅ useError - error handling hook

#### Utilities & API (2 commits)
135. ✅ apiService - Axios instance and interceptors
136. ✅ formatters, validators, constants

**Branch**: feature/tm3-frontend-integration (commits 128-136) → PR #10 → MERGE

---

### **PHASE 12: Styling & CSS Modules (Commits 137-142)**
137. ✅ Global CSS - colors, typography, utilities
138. ✅ Theme variables and design system
139. ✅ Responsive layout CSS modules
140. ✅ Component-specific styling consolidation
141. ✅ Dark mode support (if applicable)
142. ✅ Animation and transition definitions

---

### **PHASE 13: Documentation & Final (Commits 143-150)**
143. ✅ API Documentation - endpoint reference
144. ✅ Frontend Documentation - component usage
145. ✅ Database Documentation - schema guide
146. ✅ Development Guide - setup and running
147. ✅ Testing Documentation - test scenarios
148. ✅ CHANGELOG - project history
149. ✅ Deployment Guide - production setup
150. ✅ Final PR with all documentation

---

## 🎬 Execution Timeline

### **Week 1**
- Day 1: Repository setup, create main/dev branches (Commits 1-4)
- Day 2-3: TM1 creates database schema and seeders (Commits 5-17)
- Day 4-5: TM1 creates models and services (Commits 18-27), first PR

### **Week 2**
- Day 1-2: TM2 starts controllers while TM1 code reviews (Commits 28-40)
- Day 3-4: TM2 continues controllers and routes, TM3 begins frontend (Commits 41-76)
- Day 5: TM1 does final backend integration (Commits 65-72), approves TM2 PR

### **Week 3**
- Day 1-2: TM3 creates student portal (Commits 77-103)
- Day 3-4: TM3 creates teacher and admin portals (Commits 104-127)
- Day 5: TM3 creates shared components (Commits 128-142)

### **Week 4**
- Day 1-2: Final styling, documentation, and QA (Commits 143-150)
- Day 3: Final PR review and merge to dev
- Day 4: Prepare final main merge (future step)
- Day 5: Project handoff and celebration 🎉

---

## 🔐 GitHub Protection Rules (Recommended)

Create these branch protection rules in repository settings:

### **Dev Branch**
```
Rule Name: Protect dev branch
  Pattern: dev
  ✓ Require a pull request before merging
  ✓ Require approvals: 1 (Team Member 1)
  ✓ Require status checks to pass: ✓ (if CI configured)
  ✓ Require branches to be up to date before merging
  ✓ Restrict who can push to matching branches: ✓
  Allowed to push: Team Member 1 only
```

### **Main Branch** (for future)
```
Rule Name: Protect main branch
  Pattern: main
  ✓ Require a pull request before merging
  ✓ Require approvals: 2 (Team Members 1 & Project Owner)
  ✓ Require status checks to pass
  ✓ Require code review dismissal upon push
  ✓ Require branches to be up to date before merging
  ✓ Restrict who can push to matching branches: ✓
  Allowed to push: Team Member 1 only
  ✓ Include administrators: ✗ (allow override)
```

---

## 📋 Verification Checklist Before Each PR

**All team members should verify before pushing:**

```
Pre-Push Checklist:
  ☐ No .env file included (composer install and vendors)
  ☐ No node_modules/ directory included
  ☐ No /vendor/ directory included
  ☐ No IDE files (.vscode, .idea) added
  ☐ No log files (*.log) included
  ☐ commit messages are clear and follow convention
  ☐ Code builds/runs without errors
  ☐ Related files are grouped logically
  ☐ No breaking changes to existing functionality
  ☐ Documentation updated if needed
  ☐ Branch is up to date with dev

Run before pushing:
  # Verify no unwanted files
  git status
  
  # Check diff for sensitive files
  git diff --name-only HEAD origin/dev | grep -E "\\.env|\\.git|node_modules|vendor"
  
  # View what will be committed
  git log --oneline dev..HEAD
```

---

## 🛠️ Troubleshooting & Common Issues

### **Issue: "fatal: not a valid object name"**
- **Cause**: Trying to create branch from non-existent branch
- **Fix**: 
```bash
git checkout main
git pull origin main
git checkout -b feature/tm1-something
```

### **Issue: "rejected - update local refs are not allowed"**
- **Cause**: Trying to push to protected branch directly
- **Fix**: Create feature branch and PR instead

### **Issue: "Your branch diverges from 'origin/dev'"**
- **Cause**: Feature branch is behind dev
- **Fix**:
```bash
git fetch origin
git rebase origin/dev
git push --force-with-lease origin feature/tm1-something
```

### **Issue: ".env file included in commit"**
- **Cause**: .env not in .gitignore
- **Fix**:
```bash
git rm --cached server/.env
git commit -m "chore: Remove .env from tracking"
```

---

## 🚢 Final Deployment (After all merges to dev)

```bash
# When ready to release (optional - future phase)
git checkout main
git pull origin main
git merge dev -m "Release: Merge development into main"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

---

## ✅ Completion Checklist 

After all 150 commits and merges:

```
Final Verification:
  ☑ All commits are in dev branch
  ☑ Main branch contains only tag/merge commit
  ☑ All 3 team members have meaningful commits
  ☑ Feature branches are deleted
  ☑ Git history is clean and logical
  ☑ No sensitive files in any commit
  ☑ Documentation is complete
  ☑ README.md is comprehensive
  ☑ Backend can run: php artisan serve
  ☑ Frontend can run: npm run dev
  ☑ Database can migrate: php artisan migrate:fresh --seed
  ☑ Tests pass (if configured)
  ☑ Linting passes (if configured)
  ☑ Team is satisfied with git history
```

---

**END OF SECTION D**

This concludes the complete Git migration and commit plan. All sections are ready for execution!

# IUMS - University Academic Management System
## Complete Setup Guide (Phase 0 + Checkpoint 1 + JWT Integration)

---

## 📋 Prerequisites

- **PHP 8.2+** (with php-mysql extension)
- **Node.js 18+** (npm or yarn)
- **MySQL 8.0+** or MariaDB 10.5+
- **Composer 2.5+**
- **Git** (optional)

---

## 🗂️ Project Structure

```
University Academic Management System/
├── server/              ← Laravel REST API (Backend)
├── client/              ← React SPA (Frontend)
├── database/            ← SQL schemas and scripts
├── docs/                ← Documentation & ERDs
└── README.md
```

---

## 🚀 Step-by-Step Setup

### Step 1: Database Setup

#### Option A: Using MySQL CLI

```bash
# Open MySQL
mysql -u root -p

# Create database
CREATE DATABASE iums_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema (optional - Laravel migrations will create tables)
# SOURCE database/schema.sql;

# Exit
EXIT;
```

#### Option B: Using phpMyAdmin

1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Click "New Database"
3. Enter name: `iums_db`
4. Charset: `utf8mb4_unicode_ci`
5. Click "Create"

---

### Step 2: Backend (Laravel) Setup

```bash
# Navigate to server directory
cd "University Academic Management System/server"

# Install PHP dependencies (first time only)
composer install

# Copy environment file
copy .env.example .env

# OR on macOS/Linux
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Seed demo data
php artisan db:seed

# Start Laravel development server
php artisan serve
```

**Expected Output:**
```
Starting Laravel development server: http://127.0.0.1:8000
```

The backend will be running at: `http://localhost:8000`

---

### Step 3: Frontend (React) Setup

**In a new terminal window:**

```bash
# Navigate to client directory
cd "University Academic Management System/client"

# Install Node dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v8.0.3  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

The frontend will be running at: `http://localhost:5173`

---

## 🔐 Demo Credentials

After running the seeders, you can login with:

### Admin Account
- **Email:** `admin@iums.edu`
- **Password:** `admin@123`
- **Role:** Admin

### Teacher Accounts
- **Email:** `teacher1@iums.edu` | `teacher2@iums.edu` | `teacher3@iums.edu`
- **Password:** `teacher@123`
- **Role:** Teacher

### Student Accounts
- **Email:** `alex.smith@iums.edu` | `jordan.johnson@iums.edu` | `blake.williams@iums.edu` | etc.
- **Password:** `student@123`
- **Role:** Student

---

## 🌐 API Endpoints Reference

All API endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Authentication

- `POST /api/v1/auth/login`
  ```json
  {
    "email": "admin@iums.edu",
    "password": "admin@123",
    "role": "admin"
  }
  ```
  
- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Resources (CRUD)

- `GET /api/v1/users` - List all users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{id}` - Get specific user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

Similar endpoints available for:
- `/departments`
- `/courses`
- `/students`
- `/teachers`
- `/semesters`
- `/enrollments`
- `/results`

### Health Check

- `GET /api/v1/health` - API health status (no token required)

---

## 🔍 JWT Authentication Details

The system uses custom JWT implementation with HS256 algorithm:

- **JWT Secret:** Configured in `/server/.env` as `JWT_SECRET`
- **Token Expiration:** 3600 seconds (1 hour)
- **Token Storage:** LocalStorage (frontend)
- **Token Refresh:** Automatic on new login

---

## 🛠️ Available Commands

### Laravel Commands

```bash
# Create migrations
php artisan make:migration create_table_name

# Create models with migration
php artisan make:model ModelName -m

# Create controllers
php artisan make:controller ControllerName

# Run specific migration
php artisan migrate --path=database/migrations/file.php

# Rollback migrations
php artisan migrate:rollback

# Reset database
php artisan migrate:reset

# Fresh migration (reset + migrate)
php artisan migrate:fresh

# Seed specific seeder
php artisan db:seed --class=UserSeeder

# Tinker (interactive shell)
php artisan tinker
```

### React Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📁 File Structure

### Backend (`/server`)

```
app/
├── Http/
│   └── Controllers/
│       ├── AuthController.php
│       ├── UserController.php
│       └── ... (other controllers)
├── Models/
│   ├── User.php
│   ├── Department.php
│   └── ... (other models)
└── Services/
    └── JwtService.php

database/
├── migrations/
│   └── *_create_*.php
├── seeders/
│   ├── DatabaseSeeder.php
│   └── UserSeeder.php
└── schema.sql

routes/
├── api.php (API routes)
└── web.php (Web routes)

public/index.php (Entry point)
```

### Frontend (`/client`)

```
src/
├── api/
│   └── apiService.js (API client)
├── components/
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   └── ... (UI components)
├── context/
│   └── AuthContext.jsx (Auth state)
├── hooks/
│   └── useAuth.js (Auth hook)
├── pages/
│   ├── LoginPage.jsx
│   ├── admin/
│   ├── teacher/
│   ├── student/
│   └── ... (page components)
├── router/
│   ├── index.jsx (Router config)
│   └── PrivateRoute.jsx (Route protection)
├── layouts/
│   ├── AdminLayout.jsx
│   ├── TeacherLayout.jsx
│   └── StudentLayout.jsx
├── App.jsx (Main app component)
└── main.jsx (Entry point)
```

---

## 🔧 Configuration Files

### Backend Configuration

**`.env` (Server)**
```
APP_NAME=IUMS
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=iums_db
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN=3600
```

**`CORS` (if needed)**
- Currently set to accept all origins
- Update `config/cors.php` for production

### Frontend Configuration

**Environment variables** - Create `.env` in `/client`
```
VITE_API_URL=http://localhost:8000
```

---

## 🚨 Common Issues & Fixes

### Issue 1: "Connection refused" to MySQL
**Solution:**
```bash
# Check if MySQL is running
# Windows: Check Services panel or run MySQL server
# macOS/Linux: brew services start mysql
```

### Issue 2: "Port 8000 already in use"
**Solution:**
```bash
# Use different port
php artisan serve --port=8001
```

### Issue 3: "Port 5173 already in use"
**Solution:**
```bash
# Use different port
npm run dev -- --port 5174
```

### Issue 4: CORS errors
**Solution:**
- Ensure backend is running on `http://localhost:8000`
- Check frontend API URL in `apiService.js`
- Update CORS config if needed

### Issue 5: "Token expired" on every page
**Check:**
- JWT_SECRET is properly set in `.env`
- Token expiry time (default 1 hour)
- Server and client clocks are synchronized

---

## 📊 Database Schema Overview

### Core Tables

1. **users** - All system users (admin, teacher, student)
2. **departments** - Academic departments
3. **teachers** - Teacher profiles linked to users
4. **students** - Student profiles with GPA/CGPA
5. **courses** - Course catalog
6. **semesters** - Academic semesters
7. **course_offerings** - Course instances (semester + section)
8. **enrollments** - Student enrollments in courses
9. **results** - Student grades and marks

### Database Views (Reporting)

- `student_semester_gpa` - GPA for each semester
- `student_cgpa` - Cumulative GPA across all semesters
- `course_enrollment_summary` - Course capacity and enrollment stats

### Stored Procedures

- `sp_enroll_student()` - Enroll student with seat limit check
- `sp_drop_course()` - Drop course and update enrollment

---

## 🧪 Testing the Integration

1. **Login Page Test:**
   - Navigate to `http://localhost:5173`
   - Try login with admin credentials
   - Should redirect to `/admin` dashboard

2. **API Test (using curl):**
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@iums.edu",
       "password": "admin@123",
       "role": "admin"
     }'
   ```

3. **Protected Route Test:**
   ```bash
   curl -X GET http://localhost:8000/api/v1/auth/me \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

---

## 📔 Next Phases

### Checkpoint 2 Goals
- [ ] Implement course enrollment workflows
- [ ] Add seat limit enforcement
- [ ] Implement add/drop course logic
- [ ] Create department/course management for admin
- [ ] Add search and filtering

### Checkpoint 3 Goals
- [ ] Complete admin management pages
- [ ] Teacher course offering and marks entry
- [ ] Student course registration
- [ ] GPA/CGPA calculations
- [ ] Result generation and display

### Checkpoint 4+ Goals
- [ ] Payment processing
- [ ] Attendance tracking
- [ ] Advanced reporting
- [ ] Notification system
- [ ] File uploads (transcripts, documents)

---

## 📞 Support

For issues or questions:
1. Check the **Common Issues** section above
2. Review Laravel logs: `storage/logs/laravel.log`
3. Check browser console for frontend errors
4. Verify all services are running (MySQL, Laravel, React)

---

## 📝 Notes

- This is a development setup. For production, add:
  - HTTPS cert
  - Environment-specific configs
  - Input validation & sanitization
  - Rate limiting
  - Better security headers
  
- Default `JWT_SECRET` should be changed before deployment

- Always run migrations with fresh seed data for development

---

**Last Updated:** April 5, 2026  
**Version:** Phase 0 + Checkpoint 1 (JWT Integration)

# 🔐 Test Credentials Reference
**Source of truth**: `server/database/seeders/UserSeeder.php`  
**Last Verified**: April 7, 2026 ✅

---

## ⚠️ IMPORTANT: `role` Parameter Required

**When logging in via API, you MUST include the `role` field:**

```json
{
  "email": "robert.admin1@iums.edu",
  "password": "admin@123",
  "role": "admin"
}
```

**Valid roles**: `admin` | `teacher` | `student`

If you forget the role parameter, you'll get a **422 Validation Error**.

---

## 👑 Admin Accounts (6 total)

**Password for all admins**: `admin@123`  
**Status**: All ACTIVE ✅

| Email | Password | Role |
|-------|----------|------|
| `robert.admin1@iums.edu` | `admin@123` | `admin` |
| `julianna.admin2@iums.edu` | `admin@123` | `admin` |
| `sarah.admin3@iums.edu` | `admin@123` | `admin` |
| `james.admin4@iums.edu` | `admin@123` | `admin` |
| `patricia.admin5@iums.edu` | `admin@123` | `admin` |
| `michael.admin6@iums.edu` | `admin@123` | `admin` |

---

## 👨‍🏫 Teacher Accounts (55 total)

**Password for all teachers**: `teacher@123`  
**Status**: ~40 ACTIVE, ~15 INACTIVE (randomly assigned)

**⚠️ ACTIVE Teachers (guaranteed to work):**

| Email | Password | Role |
|-------|----------|------|
| `alexander.lewis@iums.edu` | `teacher@123` | `teacher` |
| `benjamin.walker@iums.edu` | `teacher@123` | `teacher` |
| `charles.young@iums.edu` | `teacher@123` | `teacher` |
| `david.hernandez@iums.edu` | `teacher@123` | `teacher` |
| `edward.moore@iums.edu` | `teacher@123` | `teacher` |
| `frederick.taylor@iums.edu` | `teacher@123` | `teacher` |
| `george.anderson@iums.edu` | `teacher@123` | `teacher` |
| `henry.thomas@iums.edu` | `teacher@123` | `teacher` |
| `jack.jackson@iums.edu` | `teacher@123` | `teacher` |

**Pattern**: `firstname.lastname@iums.edu` (55 teachers total)

---

## 🎓 Student Accounts (280 total)

**Password for all students**: `student@123`  
**Status**: Most ACTIVE ✅

**Sample Working Students:**

| Email | Password | Role |
|-------|----------|------|
| `asmith1@iums.edu` | `student@123` | `student` |
| `ajohnson2@iums.edu` | `student@123` | `student` |
| `awilliams3@iums.edu` | `student@123` | `student` |
| `abrown4@iums.edu` | `student@123` | `student` |
| `ajones5@iums.edu` | `student@123` | `student` |

**Pattern**: `{first_initial}{lastname}{number}@iums.edu` (280 students total)

---

## 📱 Quick Login Reference Card

```
✅ ADMIN (Always works):
  Email:    robert.admin1@iums.edu
  Password: admin@123
  Role:     admin

✅ TEACHER (Active):
  Email:    alexander.lewis@iums.edu
  Password: teacher@123
  Role:     teacher

✅ STUDENT (Active):
  Email:    asmith1@iums.edu
  Password: student@123
  Role:     student
```

---

## ❌ WRONG Credentials (Do NOT Use)

These will NOT work:
- ❌ `student1@iums.edu` (Old format - doesn't exist)
- ❌ `teacher1@iums.edu` (Old format - doesn't exist)
- ❌ `admin@iums.edu` (Old format - doesn't exist)
- ❌ Sending JSON without the `role` field (will get 422 error)

---

## 🔧 If Credentials Don't Work

### Problem 1: Database Has Old Credentials

**Symptoms**: Login fails with emails like `admin@iums.edu` or `student1@iums.edu`

**Solution**: Re-seed the database
```bash
cd server
php artisan migrate:fresh --seed
```

### Problem 2: "Missing `role` Field"

**Symptoms**: Get 422 Unprocessable Content error

**Solution**: Always include the `role` field in login request:
```json
{
  "email": "robert.admin1@iums.edu",
  "password": "admin@123",
  "role": "admin"
}
```

### Problem 3: "User Account is Inactive"

**Symptoms**: Get 403 Forbidden error during login

**Solution**: Try a different account (some are randomly assigned as inactive)

For teachers, use: `alexander.lewis@iums.edu` (guaranteed active)

---

## 📊 Database Status

**Total Users**: 341
- **Admins**: 6 (all active ✅)
- **Teachers**: 55 (40 active, 15 inactive)
- **Students**: 280 (mostly active ✅)

**Last Seeded**: April 7, 2026
**Backend**: Laravel 12 + PHP 8.1
**Database**: MySQL (iums_db)
**Frontend**: React (localhost:5174)
**API Server**: http://127.0.0.1:8000/api/v1
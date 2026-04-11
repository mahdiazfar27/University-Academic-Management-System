# Quick Start Guide - Testing Phase

**Date**: April 6, 2026  
**Status**: Ready to Test ✅  

---

## 🚀 Quick Start

### Open Application
1. **Frontend**: Open http://localhost:5175 in your browser
2. **Backend**: Already running on http://localhost:8000

### Login
- Use any seeded student account from the database
- Check Laravel logs for seed credentials
- Default format: `student{number}@university.edu` / `password`

---

## 🧪 Running Tests (45 minutes total)

### 5-Minute Quick Test
```
1. Login with valid credentials
2. Click through all page links
3. Toggle dark mode
4. Check mobile responsiveness
5. Look for any errors in console (F12)
```

### Full Test Suite
See **TESTING_PLAN.md** for 35+ comprehensive tests organized in 7 phases:

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 5 min | Authentication |
| Phase 2 | 5 min | Navigation |
| Phase 3 | 15 min | Core Features |
| Phase 4 | 10 min | Error Handling |
| Phase 5 | 5 min | Mobile/Responsive |
| Phase 6 | 5 min | Dark Mode |
| Phase 7 | 5 min | Performance |

---

## 📋 Test Checklist

### Critical Path Tests (Must Pass)
- [ ] Login page loads
- [ ] Can login with valid credentials
- [ ] Dashboard displays after login
- [ ] Can navigate to all pages
- [ ] No console errors
- [ ] Dark mode toggles
- [ ] Mobile view works
- [ ] Can logout

### Core Feature Tests
- [ ] View courses and enroll
- [ ] View grades and GPA
- [ ] View attendance records
- [ ] View schedule
- [ ] View/edit profile
- [ ] Change password
- [ ] View payments
- [ ] Toggle settings

---

## 🔍 Debugging

### Check Console Errors
```
Press F12 → Console tab
Look for red error messages
```

### Check Network Errors
```
Press F12 → Network tab
Look for failed API requests (red)
Check response status codes
```

### Check Backend Logs
```
See Laravel logs in: backend/storage/logs/laravel.log
```

### Restart Servers
```powershell
# Terminal 1 - Backend
cd backend
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📊 What to Test

### Pages (10 total)
1. **Login** - Authentication (/login)
2. **Dashboard** - Main page (/dashboard)
3. **Courses** - Enrollment (/courses)
4. **Grades** - GPA & Performance (/grades)
5. **Attendance** - Records (/attendance)
6. **Schedule** - Class times (/schedule)
7. **Payments** - Fees & History (/payments)
8. **Profile** - User info (/profile)
9. **Settings** - Preferences (/settings)
10. **404** - Not Found page

### Features
- ✅ Form validation
- ✅ API integration
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications
- ✅ Dark mode
- ✅ Mobile responsiveness
- ✅ Data persistence

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Blank page | Check console (F12), refresh page |
| API errors | Verify backend on port 8000 is running |
| Login fails | Check seeded credentials, verify DB |
| Styles missing | Clear browser cache, hard refresh (Ctrl+Shift+R) |
| Dark mode issues | Check localStorage (Dev Tools Storage) |
| Mobile layout broken | Check DevTools device emulation |
| Slow loading | Check network tab for slow requests |
| Components not found | Ensure imports in component files |

---

## 📈 Performance Targets

- **Page Load**: < 2 seconds
- **API Response**: < 500ms
- **Time to Interactive**: < 3 seconds
- **First Contentful Paint**: < 1 second

---

## ✅ Sign-Off Checklist

Before marking as "Passed":

```
PHASE 1: Authentication
[ ] Can login
[ ] Error handling works
[ ] Protected routes work
[ ] Logout works

PHASE 2: Navigation
[ ] All pages load
[ ] Navigation works
[ ] 404 page shows

PHASE 3: Features
[ ] Courses enrollment works
[ ] Grades display correctly
[ ] Attendance shows data
[ ] Schedule displays
[ ] Payments list complete
[ ] Profile update works
[ ] Settings save

PHASE 4: Errors
[ ] Error messages display
[ ] Forms validate
[ ] Invalid data rejected

PHASE 5: Design
[ ] Mobile view works
[ ] Tablet view works
[ ] Desktop view works

PHASE 6: Preferences
[ ] Dark mode works
[ ] Theme persists
[ ] All pages styled correctly

PHASE 7: Performance
[ ] Pages load quickly
[ ] No memory leaks
[ ] Console clean
[ ] API calls efficient
```

---

## 📞 Support

### If You Get Stuck

1. **Check the docs**:
   - TESTING_PLAN.md - Test cases
   - SETUP_VERIFICATION.md - Configuration
   - PAGES_DOCUMENTATION.md - Features
   - NAVIGATION_MAP.md - Architecture

2. **Check the logs**:
   - Browser console: F12 → Console
   - Network tab: F12 → Network
   - Laravel log: backend/storage/logs/laravel.log

3. **Restart**:
   - Kill both servers
   - Restart them fresh
   - Hard refresh browser (Ctrl+Shift+R)

---

## 🎯 Test Execution Log

| Test | Pass/Fail | Notes |
|------|-----------|-------|
| Phase 1: Auth | _____ | ______________ |
| Phase 2: Nav | _____ | ______________ |
| Phase 3: Features | _____ | ______________ |
| Phase 4: Errors | _____ | ______________ |
| Phase 5: Design | _____ | ______________ |
| Phase 6: Prefs | _____ | ______________ |
| Phase 7: Performance | _____ | ______________ |
| **OVERALL** | **___** | ______________ |

---

## 🚀 Next Steps

### ✅ If All Tests Pass
1. Create testing report
2. Document results
3. Prepare for deployment
4. Set production environment variables
5. Deploy to staging
6. Final UAT
7. Deploy to production

### ❌ If Tests Fail
1. Document issues found
2. Prioritize by severity
3. Fix critical issues
4. Re-test affected features
5. Continue with remaining tests

---

## 📝 Test Results Template

```
TESTING SESSION
Date: ___________
Tester: ___________
Environment: Local / Staging / Production

OVERALL RESULT: PASS / FAIL / CONDITIONAL

ISSUES FOUND:
1. ___________________________________
2. ___________________________________
3. ___________________________________

CRITICAL ISSUES: ___
MAJOR ISSUES: ___
MINOR ISSUES: ___

RECOMMENDATIONS:
1. ___________________________________
2. ___________________________________

SIGN-OFF:
Name: ____________  Date: ____________
```

---

## 💡 Pro Tips

- Use private/incognito window to test clear localStorage
- Test with slow network (DevTools → Network → Throttle)
- Test with different browser sizes (DevTools → Toggle Device)
- Keep browser console open while testing
- Document everything you find
- Test negative scenarios (invalid input, errors)
- Check both dark and light mode

---

## 🎉 You're Ready!

Everything is set up and ready to test. Open http://localhost:5175 and start testing!

**Good luck! 🚀**

---

For detailed test cases, see: **TESTING_PLAN.md**  
For configuration help, see: **SETUP_VERIFICATION.md**  
For feature docs, see: **PAGES_DOCUMENTATION.md**

---

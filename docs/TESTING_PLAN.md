# Complete Flow Testing Plan

**Status**: Testing Phase Started  
**Frontend**: Running on http://localhost:5175  
**Backend**: Running on http://localhost:8000  
**Date**: April 6, 2026

---

## Testing Overview

This document provides a comprehensive testing plan for the complete University Academic Management System. It covers all aspects of the application flow from login through all major features.

---

## Pre-Testing Checklist

### Environment Setup ✅
- [x] Frontend development server running (port 5175)
- [x] Backend API server running (port 8000)
- [x] Database seeded with 280+ students
- [x] All dependencies installed
- [x] No critical errors in logs

### Expected Test Users
Use seed data from the backend:
- **Student Login**: Any of the 280+ seeded students
- **Default Credentials**: (From seeder - typically test@student.edu / password)
- **Test Data**: Courses, grades, enrollments, payments pre-loaded

---

## Test Plan Structure

### Phase 1: Authentication & Setup (Duration: 5 minutes)
### Phase 2: Navigation & Page Loading (Duration: 5 minutes)
### Phase 3: Core Features Testing (Duration: 15 minutes)
### Phase 4: Edge Cases & Error Handling (Duration: 10 minutes)
### Phase 5: Responsive Design & Mobile (Duration: 5 minutes)
### Phase 6: Dark Mode & Preferences (Duration: 5 minutes)
### Phase 7: Performance & Stability (Duration: 5 minutes)

**Total Estimated Time**: ~45 minutes

---

## PHASE 1: Authentication & Setup

### Test 1.1 - Access Login Page
**Steps**:
1. Open http://localhost:5175 in browser
2. Should redirect to /login page

**Expected Results**:
- ✅ Login page loads without errors
- ✅ Page shows email/username input
- ✅ Page shows password input
- ✅ "Sign In" button visible
- ✅ "Register" link visible (if applicable)

**Pass/Fail**: _____

---

### Test 1.2 - Invalid Login Credentials
**Steps**:
1. Enter invalid email: `invalid@test.com`
2. Enter invalid password: `wrongpassword`
3. Click "Sign In"

**Expected Results**:
- ✅ Error toast notification appears
- ✅ Message indicates "Invalid credentials" or similar
- ✅ Page remains on login (no redirect)
- ✅ Input fields retain values

**Pass/Fail**: _____

---

### Test 1.3 - Successful Login
**Steps**:
1. Enter valid student email from seeder (check Laravel logs for seed data)
2. Enter correct password
3. Click "Sign In"

**Expected Results**:
- ✅ Login request sent to backend
- ✅ Success toast notification appears
- ✅ Redirects to /dashboard
- ✅ User data loads in dashboard
- ✅ Token stored in localStorage

**Pass/Fail**: _____

---

### Test 1.4 - Protected Route Access
**Steps**:
1. Logout (if logged in)
2. Try accessing http://localhost:5175/profile directly
3. Should redirect to login

**Expected Results**:
- ✅ Protected route redirects to /login
- ✅ Cannot access pages without authentication

**Pass/Fail**: _____

---

## PHASE 2: Navigation & Page Loading

### Test 2.1 - All Pages Load Successfully
**Steps**:
After logging in, navigate to each page:
1. Dashboard (/dashboard)
2. Courses (/courses)
3. Grades (/grades)
4. Attendance (/attendance)
5. Schedule (/schedule)
6. Payments (/payments)
7. Profile (/profile)
8. Settings (/settings)

**Expected Results For Each**:
- ✅ Page loads without errors
- ✅ No console errors
- ✅ Loading spinner appears then disappears
- ✅ Data displays correctly
- ✅ Page title/header accurate

**Pass/Fail**: _____

---

### Test 2.2 - Navigation Links Work
**Steps**:
1. Click navigation links between pages
2. Verify back/forward browser buttons work
3. Test direct URL navigation

**Expected Results**:
- ✅ All navigation works smoothly
- ✅ Page transitions are quick
- ✅ No duplicate API calls
- ✅ Browser history works correctly

**Pass/Fail**: _____

---

### Test 2.3 - 404 Page Displays
**Steps**:
1. Navigate to non-existent route: http://localhost:5175/nonexistent
2. Should show 404 page

**Expected Results**:
- ✅ 404 Not Found page displays
- ✅ Error message shown
- ✅ Home/Dashboard link available
- ✅ Styling is consistent

**Pass/Fail**: _____

---

## PHASE 3: Core Features Testing

### Test 3.1 - Dashboard
**Steps**:
1. Navigate to /dashboard
2. Observe all dashboard elements

**Expected Results**:
- ✅ Welcome message with student name
- ✅ Quick stats cards load (GPA, Courses, Attendance %)
- ✅ Recent grades section displays
- ✅ All data is formatted correctly
- ✅ Links to other pages visible

**Pass/Fail**: _____

---

### Test 3.2 - Courses Page
**Steps**:
1. Navigate to /courses
2. View available courses
3. Test pagination if available
4. Attempt to enroll in a course

**Expected Results**:
- ✅ Course list displays
- ✅ Course info shows (code, name, instructor, capacity)
- ✅ Pagination works (if more than 10 courses)
- ✅ Enroll button functional
- ✅ Success message after enrollment
- ✅ Current enrollments updated
- ✅ Enrollment status shows correctly

**Pass/Fail**: _____

---

### Test 3.3 - Grades Page
**Steps**:
1. Navigate to /grades
2. If multiple semesters, switch between tabs
3. View grades table
4. Observe GPA calculation

**Expected Results**:
- ✅ Semester tabs display
- ✅ Tab switching works
- ✅ Grades table shows all courses
- ✅ Letter grades displayed (A-F)
- ✅ GPA calculated and shown
- ✅ Statistics card shows totals
- ✅ No layout issues

**Pass/Fail**: _____

---

### Test 3.4 - Attendance Page
**Steps**:
1. Navigate to /attendance
2. Switch between course tabs if available
3. View attendance records

**Expected Results**:
- ✅ Course tabs display (if multiple enrollments)
- ✅ Summary cards show (Present, Absent, Late counts)
- ✅ Attendance percentage bar displays
- ✅ Attendance table shows dates and status
- ✅ Color coding matches (green/red/yellow)
- ✅ Percentage calculation is accurate

**Pass/Fail**: _____

---

### Test 3.5 - Schedule Page
**Steps**:
1. Navigate to /schedule
2. View today's classes
3. View weekly schedule
4. Switch semesters if available

**Expected Results**:
- ✅ Today's classes section shows
- ✅ Weekly grid displays all courses
- ✅ Course info shows (time, location, instructor)
- ✅ Semester selector works
- ✅ Layout is clean and organized
- ✅ Times are formatted correctly

**Pass/Fail**: _____

---

### Test 3.6 - Payments Page
**Steps**:
1. Navigate to /payments
2. View summary cards
3. View payment breakdown
4. View payment history
5. Test print button

**Expected Results**:
- ✅ Summary cards calculate correctly
- ✅ Total fees displayed
- ✅ Amount paid shown
- ✅ Outstanding balance correct
- ✅ Payment breakdown list complete
- ✅ Payment history table displays
- ✅ Print functionality works (opens print dialog)

**Pass/Fail**: _____

---

### Test 3.7 - Profile Page
**Steps**:
1. Navigate to /profile
2. View profile information
3. Click "Edit Profile"
4. Modify a field (e.g., phone number)
5. Upload a new profile photo (optional)
6. Click "Save Changes"
7. Verify changes saved

**Expected Results**:
- ✅ Profile displays user info accurately
- ✅ Edit mode toggles correctly
- ✅ Form fields editable
- ✅ Photo preview works
- ✅ Save request sent to backend
- ✅ Success toast shown
- ✅ Data persists on refresh

**Pass/Fail**: _____

---

### Test 3.8 - Password Change
**Steps**:
1. In Profile page, click "Change Password"
2. Enter current password
3. Enter new password (min 8 characters)
4. Confirm new password
5. Click "Update Password"

**Expected Results**:
- ✅ Password form appears
- ✅ Validates password strength
- ✅ Requires password confirmation
- ✅ Shows error if passwords don't match
- ✅ Shows error if password too short
- ✅ Success message on update
- ✅ Form clears after success

**Pass/Fail**: _____

---

### Test 3.9 - Settings Page
**Steps**:
1. Navigate to /settings
2. Toggle dark mode
3. Change language selection
4. Toggle notification preferences
5. Check privacy section
6. Check security section

**Expected Results**:
- ✅ Dark mode toggles on/off
- ✅ Theme persists on refresh
- ✅ Language dropdown selectable
- ✅ Notification toggles work
- ✅ Form saves preferences
- ✅ Links to privacy/security visible
- ✅ Account deletion warning shown

**Pass/Fail**: _____

---

## PHASE 4: Edge Cases & Error Handling

### Test 4.1 - Network Error Handling
**Steps**:
1. Open network tab in DevTools
2. Disable network (offline mode)
3. Try to load a page or submit a form
4. Re-enable network

**Expected Results**:
- ✅ Error toast appears for failed requests
- ✅ User-friendly error message shown
- ✅ Page doesn't break completely
- ✅ Retry/refresh option available
- ✅ Application recovers when network returns

**Pass/Fail**: _____

---

### Test 4.2 - API Error Handling
**Steps**:
1. Try accessing an invalid API endpoint (edit config temporarily)
2. Attempt operations that should fail

**Expected Results**:
- ✅ Error messages are user-friendly
- ✅ No technical jargon in error messages
- ✅ Suggestions for resolution shown
- ✅ No sensitive info leaked in errors

**Pass/Fail**: _____

---

### Test 4.3 - Form Validation
**Steps**:
1. Try submitting empty forms
2. Try invalid email format
3. Try short passwords
4. Try special characters

**Expected Results**:
- ✅ Client-side validation works
- ✅ Clear error messages shown
- ✅ Form doesn't submit with invalid data
- ✅ Error messages disappear when fixed

**Pass/Fail**: _____

---

### Test 4.4 - Logout Functionality
**Steps**:
1. Click logout (in settings or profile menu)
2. Try accessing protected route
3. Should redirect to login

**Expected Results**:
- ✅ User logs out successfully
- ✅ Token removed from localStorage
- ✅ Redirect to login page
- ✅ Cannot access protected pages after logout

**Pass/Fail**: _____

---

## PHASE 5: Responsive Design & Mobile

### Test 5.1 - Mobile View (360px width)
**Steps**:
1. Open DevTools
2. Set device emulation to iPhone SE (375x667)
3. Navigate through all pages
4. Test all interactions

**Expected Results**:
- ✅ All content visible without horizontal scroll
- ✅ Touch-friendly button sizes
- ✅ Text is readable
- ✅ Forms are easy to use
- ✅ No overlapping elements
- ✅ Navigation accessible

**Pass/Fail**: _____

---

### Test 5.2 - Tablet View (768px width)
**Steps**:
1. Set device to iPad (768x1024)
2. Test all pages
3. Verify layout transitions

**Expected Results**:
- ✅ Layout adapts properly
- ✅ Two-column layouts where appropriate
- ✅ All text readable
- ✅ Buttons appropriately sized

**Pass/Fail**: _____

---

### Test 5.3 - Desktop View (1200px+ width)
**Steps**:
1. View application on desktop
2. Test full width layouts
3. Verify multi-column layouts

**Expected Results**:
- ✅ Full width utilized effectively
- ✅ Multi-column layouts display
- ✅ No text lines too long (readability)
- ✅ Whitespace balanced

**Pass/Fail**: _____

---

## PHASE 6: Dark Mode & Preferences

### Test 6.1 - Dark Mode Toggle
**Steps**:
1. Go to /settings
2. Toggle "Dark Mode"
3. Observe page theme change
4. Refresh page
5. Check theme persists

**Expected Results**:
- ✅ Background colors change to dark
- ✅ Text color changes to light
- ✅ All pages support dark mode
- ✅ Theme preference saves
- ✅ Theme persists on page reload
- ✅ Contrast remains good

**Pass/Fail**: _____

---

### Test 6.2 - Dark Mode on All Pages
**Steps**:
1. Enable dark mode
2. Visit each page: Dashboard, Courses, Grades, Attendance, Schedule, Payments, Profile, Settings
3. Verify styling on each

**Expected Results**:
- ✅ Dark mode applied to all pages
- ✅ No white backgrounds visible
- ✅ Text is readable (good contrast)
- ✅ Images/charts visible
- ✅ Buttons styled correctly
- ✅ Icons visible

**Pass/Fail**: _____

---

## PHASE 7: Performance & Stability

### Test 7.1 - Page Load Times
**Steps**:
1. Open DevTools Network tab
2. Load each page
3. Note load times

**Expected Results**:
- ✅ Dashboard loads in < 2 seconds
- ✅ Other pages load in < 2 seconds
- ✅ API calls complete quickly
- ✅ No excessive amount of requests

**Pass/Fail**: _____

---

### Test 7.2 - No Memory Leaks
**Steps**:
1. Open DevTools Memory tab
2. Take heap snapshot before navigation
3. Navigate between pages 10 times
4. Take another heap snapshot
5. Compare memory usage

**Expected Results**:
- ✅ Memory grows minimally
- ✅ No significant leaks detected
- ✅ Application remains responsive
- ✅ No lag after multiple page transitions

**Pass/Fail**: _____

---

### Test 7.3 - Console Errors
**Steps**:
1. Open DevTools Console tab
2. Perform all test actions
3. Document any errors/warnings

**Expected Results**:
- ✅ No critical errors in console
- ✅ No unhandled promise rejections
- ✅ No import errors
- ✅ Warnings are minimal and acceptable

**Pass/Fail**: _____

---

### Test 7.4 - API Request/Response Validation
**Steps**:
1. Open DevTools Network tab
2. Perform page actions
3. Review API requests
4. Verify responses are correct

**Expected Results**:
- ✅ All API calls succeed (200 status)
- ✅ Response data is valid JSON
- ✅ Data structure matches expectations
- ✅ No 4xx or 5xx errors (except intentional)

**Pass/Fail**: _____

---

## PHASE 8: Browser Compatibility (Optional)

### Test 8.1 - Chrome
- [ ] Full functionality
- [ ] No console errors
- [ ] Responsive works

**Pass/Fail**: _____

---

### Test 8.2 - Firefox
- [ ] Full functionality
- [ ] No console errors
- [ ] Responsive works

**Pass/Fail**: _____

---

### Test 8.3 - Edge
- [ ] Full functionality
- [ ] No console errors
- [ ] Responsive works

**Pass/Fail**: _____

---

## Test Results Summary

### Overall Status
- **Total Tests**: 35+
- **Passed**: _____
- **Failed**: _____
- **Skipped**: _____
- **Pass Rate**: _____%

### Critical Issues Found
```
1. _____________________________________
2. _____________________________________
3. _____________________________________
```

### Minor Issues Found
```
1. _____________________________________
2. _____________________________________
3. _____________________________________
```

### Recommendations
```
1. _____________________________________
2. _____________________________________
3. _____________________________________
```

---

## Quick Test Checklist (5-Minute Version)

For quick verification, test these critical items:

### Authentication (1 min)
- [ ] Can login with valid credentials
- [ ] Shows error with invalid credentials
- [ ] Protected pages require login

### Navigation (1 min)
- [ ] All pages load without errors
- [ ] Navigation between pages works
- [ ] 404 page shows for invalid routes

### Features (2 min)
- [ ] Dashboard displays data
- [ ] Can enroll in course
- [ ] Can view grades
- [ ] Can change password

### Appearance (1 min)
- [ ] Dark mode toggle works
- [ ] Mobile responsive
- [ ] No console errors

---

## Debugging Tips

### If Tests Fail:
1. **Check Console**: Open DevTools Console (F12) for errors
2. **Check Network**: View Network tab for failed API calls
3. **Check Logs**: Check browser console and Laravel logs
4. **Verify Backend**: Ensure backend is running (port 8000)
5. **Verify Frontend**: Ensure frontend is running (port 5175)
6. **Check Database**: Verify seed data exists

### Common Issues:
- **CORS Error**: Check .env API_BASE_URL matches backend
- **404 on Page**: Verify route exists in AppRouter.jsx
- **Data Not Loading**: Check network requests in DevTools
- **Styling Issues**: Check CSS file is being imported
- **Mobile Issues**: Check responsive breakpoints in CSS

---

## Test Execution Notes

**Date Tested**: _____  
**Tester Name**: _____  
**Browser/Version**: _____  
**Device**: _____  
**Environment**: Dev/Local

**Notes**:
```
_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________
```

---

## Sign-Off

**Tested By**: _____________________  
**Date**: _____________________  
**Status**: ☐ Pass  ☐ Fail  ☐ Conditional Pass  

**Comments**:
```
_____________________________________________________________________

_____________________________________________________________________
```

---

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useContext } from 'react';

// Pages
import LoginPage from '../pages/LoginPage';
import LandingPage from '../pages/LandingPage';

// Admin Pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import DepartmentManagement from '../pages/admin/DepartmentManagement';
import CourseManagement from '../pages/admin/CourseManagement';
import AdminNotices from '../pages/admin/AdminNotices';
import AdminSettings from '../pages/admin/Settings';

// Teacher Pages
import TeacherLayout from '../layouts/TeacherLayout';
import TeacherDashboard from '../pages/teacher/Dashboard';
import MyCourses from '../pages/teacher/MyCourses';
import MarksEntry from '../pages/teacher/MarksEntry';
import Attendance from '../pages/teacher/Attendance';
import TeacherSchedule from '../pages/teacher/Schedule';
import Notices from '../pages/teacher/Notices';

// Student Pages
import StudentLayout from '../layouts/StudentLayout';
import StudentDashboard from '../pages/student/Dashboard';
import StudentProfile from '../pages/student/Profile';
import MyResults from '../pages/student/Results';
import MyClassRoutine from '../pages/student/ClassRoutine';
import PaymentHistory from '../pages/student/PaymentHistory';
import NameCorrection from '../pages/student/NameCorrection';

// Error page
import NotFound from '../pages/NotFound';

// Protected route wrapper
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  // Admin routes
  {
    path: '/admin',
    element: <PrivateRoute requiredRole="admin"><AdminLayout /></PrivateRoute>,
    children: [
      {
        path: '',
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'departments',
        element: <DepartmentManagement />,
      },
      {
        path: 'courses',
        element: <CourseManagement />,
      },
      {
        path: 'notices',
        element: <AdminNotices />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
    ],
  },
  // Teacher routes
  {
    path: '/teacher',
    element: <PrivateRoute requiredRole="teacher"><TeacherLayout /></PrivateRoute>,
    children: [
      {
        path: '',
        element: <TeacherDashboard />,
      },
      {
        path: 'courses',
        element: <MyCourses />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'marks',
        element: <MarksEntry />,
      },
      {
        path: 'routine',
        element: <TeacherSchedule />,
      },
      {
        path: 'notices',
        element: <Notices />,
      },
    ],
  },
  // Student routes
  {
    path: '/student',
    element: <PrivateRoute requiredRole="student"><StudentLayout /></PrivateRoute>,
    children: [
      {
        path: '',
        element: <StudentDashboard />,
      },
      {
        path: 'profile',
        element: <StudentProfile />,
      },
      {
        path: 'results',
        element: <MyResults />,
      },
      {
        path: 'class-routine',
        element: <MyClassRoutine />,
      },
      {
        path: 'payments',
        element: <PaymentHistory />,
      },
      {
        path: 'name-correction',
        element: <NameCorrection />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

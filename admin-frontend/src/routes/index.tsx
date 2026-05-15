import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import QuestionsPage from '../pages/Questions/QuestionsPage';
import UsersPage from '../pages/Users/UsersPage';
import TalentPoolPage from '../pages/TalentPool/TalentPoolPage';
import SystemDataPage from '../pages/System/SystemDataPage';
import ForumAdminPage from '../pages/Forum/ForumAdminPage';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    {children}
  </ProtectedRoute>
);

export const AdminRoutes = [
  { path: '/login', element: <LoginPage /> },
  {
    path: '/dashboard',
    element: <ProtectedAdmin><DashboardPage /></ProtectedAdmin>
  },
  {
    path: '/questions',
    element: <ProtectedAdmin><QuestionsPage /></ProtectedAdmin>
  },
  {
    path: '/users',
    element: <ProtectedAdmin><UsersPage /></ProtectedAdmin>
  },
  {
    path: '/talent-pool',
    element: <ProtectedAdmin><TalentPoolPage /></ProtectedAdmin>
  },
  {
    path: '/system-data',
    element: <ProtectedAdmin><SystemDataPage /></ProtectedAdmin>
  },
  {
    path: '/forum',
    element: <ProtectedAdmin><ForumAdminPage /></ProtectedAdmin>
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> }
];

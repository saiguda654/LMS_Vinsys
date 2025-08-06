import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  DocumentIcon,
  BellIcon,
  CogIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Batches', href: '/admin/batches', icon: UserGroupIcon },
  { name: 'Courses', href: '/admin/courses', icon: BookOpenIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Assessments', href: '/admin/assessments', icon: ClipboardDocumentListIcon },
  { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
  { name: 'Documents', href: '/admin/documents', icon: DocumentIcon },
  { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

const trainerNavItems = [
  { name: 'Dashboard', href: '/trainer', icon: HomeIcon },
  { name: 'My Batches', href: '/trainer/batches', icon: UserGroupIcon },
  { name: 'Assignments', href: '/trainer/assignments', icon: ClipboardDocumentListIcon },
  { name: 'Attendance', href: '/trainer/attendance', icon: CalendarDaysIcon },
  { name: 'Assessments', href: '/trainer/assessments', icon: AcademicCapIcon },
  { name: 'Documents', href: '/trainer/documents', icon: DocumentIcon },
  { name: 'Reports', href: '/trainer/reports', icon: ChartBarIcon },
];

const learnerNavItems = [
  { name: 'Dashboard', href: '/learner', icon: HomeIcon },
  { name: 'My Courses', href: '/learner/courses', icon: BookOpenIcon },
  { name: 'Assignments', href: '/learner/assignments', icon: ClipboardDocumentListIcon },
  { name: 'Assessments', href: '/learner/assessments', icon: AcademicCapIcon },
  { name: 'Progress', href: '/learner/progress', icon: ChartBarIcon },
  { name: 'Documents', href: '/learner/documents', icon: DocumentIcon },
  { name: 'Certificates', href: '/learner/certificates', icon: AcademicCapIcon },
];

export function Sidebar() {
  const { user, signOut } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminNavItems;
      case 'trainer':
        return trainerNavItems;
      case 'learner':
        return learnerNavItems;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <AcademicCapIcon className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">EduLMS</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <Avatar
            src={user?.avatar_url}
            name={user?.full_name}
            size="md"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="w-full text-left sidebar-item-inactive"
        >
          <svg
            className="mr-3 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
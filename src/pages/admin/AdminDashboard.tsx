import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { getBatches } from '../../lib/supabase';
import { Batch } from '../../types';
import { formatDate } from '../../lib/utils';

interface DashboardStats {
  totalBatches: number;
  activeBatches: number;
  totalLearners: number;
  completionRate: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBatches: 0,
    activeBatches: 0,
    totalLearners: 0,
    completionRate: 0,
  });
  const [recentBatches, setRecentBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: batches } = await getBatches();
      
      if (batches) {
        const activeBatches = batches.filter(batch => batch.status === 'active');
        const totalLearners = batches.reduce((sum, batch) => sum + batch.current_learners, 0);
        
        setStats({
          totalBatches: batches.length,
          activeBatches: activeBatches.length,
          totalLearners,
          completionRate: 85, // Mock data - would calculate from actual progress
        });
        
        setRecentBatches(batches.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Batches',
      value: stats.totalBatches,
      icon: UserGroupIcon,
      color: 'primary',
      change: '+12%',
    },
    {
      title: 'Active Batches',
      value: stats.activeBatches,
      icon: BookOpenIcon,
      color: 'success',
      change: '+8%',
    },
    {
      title: 'Total Learners',
      value: stats.totalLearners,
      icon: AcademicCapIcon,
      color: 'warning',
      change: '+23%',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: ChartBarIcon,
      color: 'error',
      change: '+5%',
    },
  ];

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="ml-2 text-sm font-medium text-success-600">{stat.change}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Batches */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Batches</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBatches.map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{batch.name}</p>
                      <p className="text-xs text-gray-500">
                        Started {formatDate(batch.start_date)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          batch.status === 'active'
                            ? 'success'
                            : batch.status === 'completed'
                            ? 'default'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {batch.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {batch.current_learners}/{batch.max_learners}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserGroupIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Create Batch</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpenIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Add Course</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">View Reports</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <CalendarDaysIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Attendance</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Course Completion</span>
                  <span className="text-sm text-gray-500">85%</span>
                </div>
                <ProgressBar value={85} color="success" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Attendance</span>
                  <span className="text-sm text-gray-500">92%</span>
                </div>
                <ProgressBar value={92} color="primary" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Assessment Pass Rate</span>
                  <span className="text-sm text-gray-500">78%</span>
                </div>
                <ProgressBar value={78} color="warning" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { getBatches, getAssignments } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Batch, Assignment } from '../../types';
import { formatDate } from '../../lib/utils';

export function TrainerDashboard() {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrainerData();
    }
  }, [user]);

  const loadTrainerData = async () => {
    try {
      // Load trainer's batches
      const { data: batchData } = await getBatches(user?.id, user?.role);
      if (batchData) {
        setBatches(batchData);
        
        // Load assignments for all batches
        const allAssignments: Assignment[] = [];
        for (const batch of batchData) {
          const { data: assignmentData } = await getAssignments(batch.id);
          if (assignmentData) {
            allAssignments.push(...assignmentData);
          }
        }
        setAssignments(allAssignments);
      }
    } catch (error) {
      console.error('Error loading trainer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeBatches = batches.filter(batch => batch.status === 'active');
  const totalLearners = batches.reduce((sum, batch) => sum + batch.current_learners, 0);
  const pendingAssignments = assignments.filter(assignment => 
    new Date(assignment.due_date) > new Date()
  );

  const statCards = [
    {
      title: 'My Batches',
      value: batches.length,
      icon: UserGroupIcon,
      color: 'primary',
    },
    {
      title: 'Active Batches',
      value: activeBatches.length,
      icon: AcademicCapIcon,
      color: 'success',
    },
    {
      title: 'Total Learners',
      value: totalLearners,
      icon: UserGroupIcon,
      color: 'warning',
    },
    {
      title: 'Pending Assignments',
      value: pendingAssignments.length,
      icon: ClipboardDocumentListIcon,
      color: 'error',
    },
  ];

  if (loading) {
    return (
      <Layout title="Trainer Dashboard">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Trainer Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card p-6">
          <div className="flex items-center">
            <Avatar
              src={user?.avatar_url}
              name={user?.full_name}
              size="lg"
            />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {user?.full_name}!
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your batches today.
              </p>
            </div>
          </div>
        </div>

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
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Batches */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">My Batches</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {batches.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No batches assigned yet.
                  </p>
                ) : (
                  batches.map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{batch.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(batch.start_date)} - {formatDate(batch.end_date)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {batch.current_learners} learners enrolled
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
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
                      </div>
                    </div>
                  ))
                )}
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
                  <CalendarDaysIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Mark Attendance</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Create Assignment</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <AcademicCapIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Create Assessment</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserGroupIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">View Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Assignments</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {assignments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No assignments created yet.
                </p>
              ) : (
                assignments.slice(0, 5).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-500">
                        Due: {formatDate(assignment.due_date)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          new Date(assignment.due_date) > new Date()
                            ? 'success'
                            : 'error'
                        }
                        size="sm"
                      >
                        {new Date(assignment.due_date) > new Date() ? 'Active' : 'Overdue'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {assignment.max_score} pts
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
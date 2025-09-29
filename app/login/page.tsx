"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth/AuthContext';
import { UserRole } from '../lib/auth/roleConfig';

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Marketer');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const roles: { role: UserRole; description: string; dashboards: string[] }[] = [
    {
      role: 'Founder',
      description: 'Full access to all platform features',
      dashboards: ['All Dashboards', 'User Management', 'System Settings']
    },
    {
      role: 'Marketer',
      description: 'Marketing campaign and performance analysis',
      dashboards: ['ROI Calculator', 'Insights', 'Campaign Performance']
    },
    {
      role: 'Analyst',
      description: 'Data analysis and customer insights',
      dashboards: ['ROI Calculator', 'Insights', 'Customer Segmentation']
    },
    {
      role: 'Admin',
      description: 'Administrative and financial operations',
      dashboards: ['Payments & Reports', 'User Management']
    }
  ];

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Mock login for demo purposes
      const mockUser = {
        id: `user-${Date.now()}`,
        email: `${selectedRole.toLowerCase()}@smartistics.com`,
        name: `${selectedRole} User`,
        role: selectedRole,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      localStorage.setItem('smartistics_user', JSON.stringify(mockUser));
      localStorage.setItem('smartistics_token', 'demo-token');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/dashboards/roi-calculator');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Smartistics Analytics
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select your role to access the dashboard demo
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose Your Role
            </label>
            <div className="space-y-3">
              {roles.map((roleInfo) => (
                <div
                  key={roleInfo.role}
                  className={`relative cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition-colors ${
                    selectedRole === roleInfo.role
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedRole(roleInfo.role)}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="role"
                        value={roleInfo.role}
                        checked={selectedRole === roleInfo.role}
                        onChange={() => setSelectedRole(roleInfo.role)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {roleInfo.role}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          roleInfo.role === 'Founder' ? 'bg-purple-100 text-purple-800' :
                          roleInfo.role === 'Marketer' ? 'bg-blue-100 text-blue-800' :
                          roleInfo.role === 'Analyst' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {roleInfo.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {roleInfo.description}
                      </p>
                      <div className="mt-2">
                        <div className="text-xs text-gray-400 mb-1">Available dashboards:</div>
                        <div className="flex flex-wrap gap-1">
                          {roleInfo.dashboards.map((dashboard, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {dashboard}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              `Sign in as ${selectedRole}`
            )}
          </button>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Demo Mode - No real authentication required
              </p>
              <div className="mt-2 text-xs text-gray-400">
                This is a demonstration of role-based access control.
                Each role has different dashboard permissions.
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500">
            Built with Next.js, TypeScript, and Tailwind CSS
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

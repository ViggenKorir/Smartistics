"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole =
  | "Admin"
  | "Manager"
  | "Analyst"
  | "Marketer"
  | "Employee"
  | "Founder";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

interface MockAuthContextType {
  user: MockUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  availableUsers: MockUser[];
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error("useMockAuth must be used within a MockAuthProvider");
  }
  return context;
};

// For compatibility with existing components that use useAuth
export const useAuth = useMockAuth;

interface MockAuthProviderProps {
  children: React.ReactNode;
  defaultUserId?: string;
}

export const MockAuthProvider: React.FC<MockAuthProviderProps> = ({
  children,
  defaultUserId = "demo-admin"
}) => {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [availableUsers, setAvailableUsers] = useState<MockUser[]>([]);

  // Initialize users from mock API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/users");
        const json = await res.json();
        const parsed: MockUser[] = (json || []).map((u: any) => ({
          ...u,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
          lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : new Date()
        }));
        setAvailableUsers(parsed);
        const defaultUser = parsed.find(user => user.id === defaultUserId) || parsed[0] || null;
        setCurrentUser(defaultUser);
      } catch (e) {
        console.error("Failed to load users from db.json", e);
        setAvailableUsers([]);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [defaultUserId]);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);

    // For mock API: find user by email (password ignored)
    const user = availableUsers.find(u => u.email === credentials.email);

    if (user) {
      setCurrentUser({
        ...user,
        lastLoginAt: new Date()
      });
    } else {
      throw new Error("Invalid credentials");
    }

    setLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser({
        ...user,
        lastLoginAt: new Date()
      });
    }
  };

  const switchRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role,
        lastLoginAt: new Date()
      });
    }
  };

  const contextValue: MockAuthContextType = {
    user: currentUser,
    loading,
    isAuthenticated: !!currentUser,
    login,
    logout,
    switchUser,
    switchRole,
    availableUsers
  };

  return (
    <MockAuthContext.Provider value={contextValue}>
      {children}
    </MockAuthContext.Provider>
  );
};

// User switcher component for demos
export const MockUserSwitcher: React.FC<{
  className?: string;
  showRole?: boolean;
}> = ({
  className = "",
  showRole = true
}) => {
  const { user, switchUser, switchRole, availableUsers } = useMockAuth();

  if (!user) return null;

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-yellow-800">Demo Mode</h4>
        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
          Mock Auth
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Switcher */}
        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-1">
            Switch User
          </label>
          <select
            value={user.id}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white text-sm"
          >
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher */}
        {showRole && (
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Current Role
            </label>
            <select
              value={user.role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white text-sm"
            >
              {["Admin", "Manager", "Analyst", "Marketer", "Employee", "Founder"].map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-yellow-600">
        Currently logged in as: <strong>{user.name}</strong> ({user.email})
      </div>
    </div>
  );
};

export default MockAuthProvider;

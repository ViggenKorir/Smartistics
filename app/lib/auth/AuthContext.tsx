"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UseAuthReturn } from "../types/dashboard";
import { UserRole, isValidRole } from "./roleConfig";

interface AuthContextType extends UseAuthReturn {
  // Context-specific methods can be added here if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("smartistics_user");
        const storedToken = localStorage.getItem("smartistics_token");

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          if (isValidRole(userData.role)) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Invalid role, clear storage
            localStorage.removeItem("smartistics_user");
            localStorage.removeItem("smartistics_token");
          }
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        // Clear potentially corrupted data
        localStorage.removeItem("smartistics_user");
        localStorage.removeItem("smartistics_token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Mock authentication - replace with actual API call
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const { user: userData, token } = await response.json();

      if (!isValidRole(userData.role)) {
        throw new Error("Invalid user role");
      }

      // Store in localStorage
      localStorage.setItem("smartistics_user", JSON.stringify(userData));
      localStorage.setItem("smartistics_token", token);

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    // Clear localStorage
    localStorage.removeItem("smartistics_user");
    localStorage.removeItem("smartistics_token");

    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Mock users for development - replace with actual user management
  const mockLogin = (role: UserRole): void => {
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email: `${role.toLowerCase()}@smartistics.com`,
      name: `${role} User`,
      role,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    localStorage.setItem("smartistics_user", JSON.stringify(mockUser));
    localStorage.setItem("smartistics_token", "mock-token");

    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
    error,
  };

  // Add mock login for development
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    (window as any).mockLogin = mockLogin;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

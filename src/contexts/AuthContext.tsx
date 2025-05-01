
import React, { createContext, useState, useContext, useEffect } from "react";

// Define user roles
export type UserRole = "admin" | "worker";

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userDatabase: { email: string, password: string, name: string, id: string, role: UserRole }[];
  updateUserDatabase: (newUsers: { email: string, password: string, name: string, id: string, role: UserRole }[]) => void;
}

// Local storage key for user database
const USER_DB_KEY = "stocksavvy_users";

// Default mock users
const DEFAULT_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@stocksavvy.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    name: "Worker User",
    email: "worker@stocksavvy.com",
    password: "worker123",
    role: "worker" as UserRole,
  },
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => Promise.resolve(false),
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  userDatabase: DEFAULT_USERS,
  updateUserDatabase: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDatabase, setUserDatabase] = useState(() => {
    try {
      const savedUsers = localStorage.getItem(USER_DB_KEY);
      return savedUsers ? JSON.parse(savedUsers) : DEFAULT_USERS;
    } catch (error) {
      console.error("Failed to load user database:", error);
      return DEFAULT_USERS;
    }
  });

  // Save user database to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(USER_DB_KEY, JSON.stringify(userDatabase));
  }, [userDatabase]);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Function to update user database
  const updateUserDatabase = (newUsers: typeof DEFAULT_USERS) => {
    setUserDatabase(newUsers);
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = userDatabase.find(
          (u) => u.email === email && u.password === password
        );
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500); // simulate API delay
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        userDatabase,
        updateUserDatabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${API_BASE_URL}/api/auth`;

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          // Token is invalid/expired
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        // We do not remove the token on network failure, just don't set user
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login User
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Failed to login" };
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login request error:", error);
      return { success: false, message: "Network error, please try again." };
    }
  };

  // Register User
  const register = async (name, email, password, role = "user") => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Failed to register" };
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Registration request error:", error);
      return { success: false, message: "Network error, please try again." };
    }
  };

  // Google Login
  const googleLogin = async (idToken) => {
    try {
      const res = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Failed to login with Google" };
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Google login request error:", error);
      return { success: false, message: "Network error, please try again." };
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

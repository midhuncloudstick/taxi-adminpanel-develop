import { useState, useEffect, createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, _setIsAuthenticated] = useState(false);

  // On initial load, read from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      _setIsAuthenticated(true);
    }
  }, []);

  // Custom setter that works like useState setter
  const setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    if (typeof value === "function") {
      _setIsAuthenticated((prev) => {
        const newValue = (value as (prev: boolean) => boolean)(prev);
        localStorage.setItem("isAuthenticated", newValue.toString());
        return newValue;
      });
    } else {
      localStorage.setItem("isAuthenticated", value.toString());
      _setIsAuthenticated(value);
    }
  };

  // Development toggle shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === "l") {
        setIsAuthenticated((prev) => !prev);
        console.log("Authentication toggled");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

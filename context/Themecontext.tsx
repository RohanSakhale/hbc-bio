"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
  Context,
} from "react";

// Define the shape of the context data for theme management
interface ThemeContextType {
  theme: string;
  toggle: () => void;
}

// Create the context with a default value and explicit typing
export const ThemeContext: Context<ThemeContextType> =
  createContext<ThemeContextType>({
    theme: "light", // Default value
    toggle: () => {}, // Placeholder function
  });

// Helper function to get theme from localStorage
const getFromLocalStorage = (): string => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem("theme");
    return value || "light";
  }
  return "light";
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

// Theme context provider with proper typing for props
export const ThemeContextProvider: FC<ThemeContextProviderProps> = ({
  children,
}) => {
  const [theme, setTheme] = useState<string>(getFromLocalStorage);

  const toggle = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

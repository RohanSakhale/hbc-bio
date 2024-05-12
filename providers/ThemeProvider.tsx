"use client";

import { useContext, useEffect, useState, FC, ReactNode } from "react";
import { ThemeContext } from "@/context/Themecontext"

interface ThemeProviderProps {
  children: ReactNode; // Using ReactNode for children prop typing
}

// Using Functional Component type from React with props definition
const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useContext(ThemeContext); // Consuming theme from ThemeContext
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Effect to ensure we only render the component once it's mounted to the DOM
    setMounted(true);
  }, []);

  if (!mounted) {
    // Loading indicator or fallback UI when not mounted yet
    return (
      <div className="flex h-[100vh] w-full items-center justify-center transition-opacity">
        Loading...
      </div>
    );
  }

  // Render children with dynamic theme class
  return <div className={theme}>{children}</div>;
};

export default ThemeProvider;

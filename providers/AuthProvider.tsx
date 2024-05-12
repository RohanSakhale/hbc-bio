"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  ReactNode,
} from "react";

// Define the shape of the Auth context data
interface AuthContextType {
  isAuthenticated: boolean;
  data: {
    loginTheme: {
      title: string;
      desc: string;
      loginLogo: string;
      idHeading: string;
      passwordHeading: string;
      signInButtonHeading: string;
      idPlaceholder: string;
    };
    banners: {
      topBanner: string;
      bottomBanner: string;
    };
    users: {
      userName: string;
      code: string;
    };
  };
}

// Initial data configuration
const data = {
  loginTheme: {
    title: "Sign in to your Account",
    desc: "Employee code provided by your Company",
    loginLogo: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg",
    idHeading: "Your Email",
    passwordHeading: "Password",
    signInButtonHeading: "Sign in",
    idPlaceholder: "Enter your employee code",
  },
  banners: {
    topBanner:
      "https://img.lovepik.com/background/20211022/large/lovepik-taobao-tmall-e-commerce-banner-background-image_500603827.jpg",
    bottomBanner:
      "https://cdn.pixabay.com/photo/2015/08/23/09/22/banner-902589_640.jpg",
  },
  users: {
    userName: "Omkar Waje",
    code: "3845",
  },
};

// Create the Auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  data,
});

// Export the useContext Hook for other components to use
const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
        router.push("/projects");
      }
      setLoading(false);
    };

    if (typeof window !== "undefined") {
      checkAuth();
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center transition-opacity">
        Checking authentication...
      </div>
    );
  }
  return (
    <AuthContext.Provider value={{ isAuthenticated, data }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };

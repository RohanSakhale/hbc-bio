"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
};

interface LoginProps {
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
}

const Login: React.FC<{ data: LoginProps }> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "kminchelle",
          password: "0lelplR",
          expiresInMins: 30, // optional, defaults to 60
        }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token);

        // Redirect to the home page or another route
        router.push("/projects");
      } else {
        // Handle errors or invalid login attempts
        console.error("Login failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            src={data.loginTheme.loginLogo}
            alt="logo"
            width={300}
            height={300}
            className="w-20 h-20 mr-2"
          />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="text-center pb-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {data.loginTheme.title}
              </h1>
              <p className="text-xs pt-2 leading-tight tracking-tight text-gray-900 dark:text-white">
                {data.loginTheme.desc}
              </p>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {data.loginTheme.idHeading}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={data.loginTheme.idPlaceholder}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {data.loginTheme.passwordHeading}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-xs text-gray-700 hover:underline dark:text-gray-100"
                >
                  *Contact your admin if credentials goes wrong
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {data.loginTheme.signInButtonHeading}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SyncLoader } from "react-spinners";


const Login = () => {
  const [projectHash, setProjectHash] = useState("9jnxxjnp");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("https://pixpro.app/api/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_hash: projectHash,
          code: code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("EmployeeHash", data.data.hash);
        router.push("/projects");
        router;
      } else {
        throw new Error(data.message || "Failed to login");
      }
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center px-0 py-3 mx-auto md:h-screen lg:py-0">
        <div className="w-full md:h-64 overflow-hidden drop-shadow-md">
          <Image
            src="https://www.spectrumspace.org.au/wp-content/uploads/2023/07/Music-Video-Project-Banner.png"
            width={2000}
            height={200}
            alt="top-banner"
          />
        </div>
        <div className="w-full bg-white mt-4 md:mt-10 rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="text-center pb-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your Account
              </h1>
              <p className="text-xs pt-2 leading-tight tracking-tight text-gray-900 dark:text-white">
                Employee code provided by your Company
              </p>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="Employee_code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter your employee code
                </label>
                <input
                  type="text"
                  name="Employee_code"
                  id="Employee_code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Eg. demo_456"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="flex flex-col justify-between">
                <p className="text-red-500 text-sm">
                  {error ? "Please enter you Employee code correctly" : ""}
                </p>
              </div>
              <button
                onClick={handleLogin}
                type="submit"
                disabled={loading}
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? (
                  <div>
                    <SyncLoader loading={loading} color="white" size={7} />
                  </div>
                ) : (
                  "Login to proceed"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

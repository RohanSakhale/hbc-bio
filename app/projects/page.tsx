"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

interface DoctorDetails {
  hash: string;
  name: string;
  mobile: string;
  email: string | null;
  code: string | null;
  approved_status: number; // Assuming status is represented as an integer (0 or 1)
  download: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

const Projects = () => {
  const { isAuthenticated, data } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);

  useEffect(() => {
    const employeeHash = localStorage.getItem("EmployeeHash");
    const fetchDoctors = async () => {
      if (!employeeHash) {
        router.push("/login"); // Redirect if no employee hash
        return;
      }
      try {
        const response = await fetch(
          `https://pixpro.app/api/employee/${employeeHash}/contact/list`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const result = await response.json();
        setDoctors(result.data); // Assuming the response JSON structure is as shown
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [router]);
  return (
    <div>
      <div className="w-full max-w-7xl mx-auto left-0 lg:left-auto h-24 bg-gray-200 p-4 fixed bottom-0 z-50 flex items-center">
        <button
          className="w-full py-3 text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          onClick={() => router.push("/add-new")}
        >
          Add new Doctor
        </button>
      </div>

      <div className="relative overflow-x-auto sm:rounded-lg mt-6">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-orange-600">Welcome!</h1>
            <button>
              <img
                src="/logout.png"
                alt="logout-button"
                className="w-8 h-8 z-50"
              />
            </button>
          </div>

          <p className="capitalize text-xl font-semibold">
            {data.users.userName}
          </p>
          <p className="text-xs">Emp. code: {data.users.code}</p>
        </div>
        <div className="mt-10">
          <h1 className="font-semibold text-lg">🧑🏻‍🔬 Doctor List</h1>
          <hr />
        </div>
        <div className="hidden md:block mt-10">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-10 shadow-md">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Doctor Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Doctor Mobile
                </th>
                <th scope="col" className="px-6 py-3">
                  Video Generated
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr
                  key={doctor.hash}
                  className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {doctor.name}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {doctor.mobile}
                  </td>
                  <td className="px-6 py-4">
                    {doctor.download ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    {doctor.approved_status ? (
                      doctor.download ? (
                        <a href={doctor.download} download>
                          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Download
                          </button>
                        </a>
                      ) : null // Handle the case where download is null
                    ) : (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() =>
                          router.push(`/doctor/${doctor.hash}/personal`)
                        }
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden mt-10">
          {doctors.map((doctor) => (
            <div
              key={doctor.hash}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Mobile: {doctor.mobile}
                  </p>
                  <p className="text-sm">
                    {doctor.download
                      ? "Video Generated: Yes"
                      : "Video Generated: No"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-3">
                {doctor.approved_status ? (
                  doctor.download ? (
                    <a href={doctor.download} download>
                      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Download
                      </button>
                    </a>
                  ) : null // Handle the case where download is null
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                      router.push(`/doctor/${doctor.hash}/personal`)
                    }
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;

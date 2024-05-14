"use client";

import React, { useState, useEffect } from "react";
import SceneBox from "@/components/SceneBox";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EducationEntry {
  degree: string;
  field_specialization: string;
  college_university_name: string;
  location: string;
  passing_year: string | null; // Update to handle null value for DatePicker
}

interface ResponseData {
  contact: {
    mobile?: string;
  };
  data: {
    doctor: {};
    educations: EducationEntry[];
    certifications: [];
    experience: {};
    memberships: [];
    specializations: [];
    achievements: []
  };
}

const EducationForm = () => {
  const [responseData, setResponseData] = useState<ResponseData>({
    contact: {},
    data: {
      doctor: {},
      educations: [],
      certifications: [],
      experience: {},
      memberships: [],
      specializations: [],
      achievements: [],
    },
  });
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeHashId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const router = useRouter();

  useEffect(() => {
    const doctorHash = localStorage.getItem("doctorHash");
    const employeeHash = localStorage.getItem("EmployeeHash");

    setDoctorHashId(doctorHash);
    setEmployeeHashId(employeeHash);

    if (doctorHash && employeeHash) {
      fetch(
        `https://pixpro.app/api/employee/${employeeHash}/contact/${doctorHash}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: doctorHash,
            name: "Rohan Sakhale",
            mobile: "8976379661",
            data: { doctor: [] },
          }),
        }
      )
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData?.data) {
            const fetchedData = responseData.data[0] || responseData.data;

            const formattedData = {
              doctor: {},
              educations: fetchedData.educations || [],
              certifications: fetchedData.certifications || [],
              experience: fetchedData.experience || {},
              memberships: fetchedData.memberships || [],
              specializations: fetchedData.specializations || [],
              achievements: fetchedData.achievements || [],
            };

            setResponseData({
              contact: responseData.contact,
              data: formattedData,
            });
          }
        })
        .catch((error) =>
          console.error("Error fetching education data:", error)
        )
        .finally(() => setLoading(false));
    }
  }, []);

  const addEducation = () => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        educations: [
          ...prevData.data.educations,
          {
            degree: "",
            field_specialization: "",
            college_university_name: "",
            location: "",
            passing_year: null,
          },
        ],
      },
    }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationEntry,
    value: any
  ) => {
    setResponseData((prevData) => {
      const updatedEducations = [...prevData.data.educations];
      updatedEducations[index][field] = value;
      return {
        ...prevData,
        data: { ...prevData.data, educations: updatedEducations },
      };
    });
  };

  const removeEducation = (index: number) => {
    setResponseData((prevData) => {
      const updatedEducations = [...prevData.data.educations];
      updatedEducations.splice(index, 1);
      return {
        ...prevData,
        data: { ...prevData.data, educations: updatedEducations },
      };
    });
  };

  const handleSubmit = async () => {
    if (!doctorHashId || !employeeHashId) {
      console.error("No doctor or employee hash ID found");
      return;
    }

    let currentData;
    try {
      const response = await fetch(
        `https://pixpro.app/api/employee/${employeeHashId}/contact/${doctorHashId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: doctorHashId,
          }),
        }
      );
      currentData = await response.json();
    } catch (error) {
      console.error("Error fetching current data:", error);
      return;
    }

    if (currentData?.data) {
      const fetchedData = currentData.data[0] || currentData.data;

      const updatedData = {
        ...fetchedData,
        educations: responseData.data.educations,
      };

      try {
        await fetch(
          `https://pixpro.app/api/employee/${employeeHashId}/contact/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: doctorHashId,
              mobile: responseData.contact.mobile,
              data: updatedData,
            }),
          }
        );
        console.log("Education updated successfully.");
      } catch (error) {
        console.error("Error submitting education:", error);
      }
    }
  };

  if (loading) {
    return (
      <SceneBox>
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      </SceneBox>
    );
  }

  return (
    <SceneBox>
      <div>
        <button
          onClick={addEducation}
          className="w-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add Education
        </button>
        {responseData.data.educations.map((edu, index: number) => (
          <div className="mt-6" key={index}>
            <div className="flex justify-between items-center bg-gray-100 py-2 px-4">
              <div className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Add new Education for doctor
              </div>
              <button
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-700 text-3xl dark:hover:text-red-500"
              >
                {" "}
                &times;
              </button>
            </div>
            <form className="flex flex-wrap">
              {Object.keys(edu).map((key) => (
                <div key={key} className="w-full lg:w-1/4 lg:ml-4 mt-3">
                  <label
                    htmlFor={`${key}-${index}`}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {key
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  {key === "passing_year" ? (
                    <DatePicker
                      id={`${key}-${index}`}
                      selected={edu.passing_year ? new Date(edu.passing_year) : null}
                      onChange={(date: Date) =>
                        handleEducationChange(
                          index,
                          key as keyof EducationEntry,
                          date.toISOString().split("T")[0]
                        )
                      }
                      showYearPicker
                      dateFormat="yyyy"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                    />
                  ) : (
                    <input
                      id={`${key}-${index}`}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      placeholder={key
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      value={edu[key as keyof EducationEntry] || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          key as keyof EducationEntry,
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </form>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <button
            onClick={async () => {
              await handleSubmit();
              router.push(`/doctor/${doctorHashId}/personal`);
            }}
            className="bg-red-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            back
          </button>
          <button
            onClick={async () => {
              await handleSubmit();
              router.push(`/doctor/${doctorHashId}/experience`);
            }}
            className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            {responseData.data.educations.length === 0 ? "Skip" : "Next"}
          </button>
        </div>
      </div>
    </SceneBox>
  );
};

export default EducationForm;

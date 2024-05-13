"use client";

import SceneBox from "@/components/SceneBox";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface EducationEntry {
  degree: string;
  field_specialization: string;
  college_university_name: string;
  location: string;
  passing_year: string;
}

interface MainJsonType {
  educations: EducationEntry[];
}

const EducationForm = () => {
  const [educations, setEducations] = useState<EducationEntry[]>([]);
  const [doctorHashId, setDoctorId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setDoctorId(localStorage.getItem("doctorHash"));
    setEmployeeId(localStorage.getItem("EmployeeHash"));

    const fetchEducations = async () => {
      if (doctorHashId && employeeHashId) {
        try {
          const response = await fetch(
            `https://pixpro.app/api/employee/${employeeHashId}/contact/${doctorHashId}/educations`
          );
          const data = await response.json();
          setEducations(data.educations || []);
        } catch (error) {
          console.error("Error fetching education data:", error);
        }
      }
    };

    fetchEducations();
  }, [doctorHashId, employeeHashId]);

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        degree: "",
        field_specialization: "",
        college_university_name: "",
        location: "",
        passing_year: "",
      },
    ]);
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationEntry,
    value: string
  ) => {
    const updatedEducations = educations.map((edu, eduIndex) => {
      if (index === eduIndex) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    setEducations(updatedEducations);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, eduIndex) => eduIndex !== index));
  };

  const handleSubmit = async () => {
    if (!doctorHashId) {
      console.error("No doctor hash ID found");
      return;
    }

    const apiUrl = `https://pixpro.app/api/employee/${employeeHashId}/contact/${doctorHashId}`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: doctorHashId,
          data: { educations },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Convert response payload to JSON
      console.log("Response data:", educations);
      localStorage.setItem("data", JSON.stringify({ educations }));
    } catch (error) {
      console.error("Error submitting experience:", error);
    }
  };

  return (
    <SceneBox>
      <div>
        <button
          onClick={addEducation}
          className="w-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add Education
        </button>
        {educations.map((edu, index: number) => (
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
                  <input
                    id={`${key}-${index}`}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    placeholder={key
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    value={edu[key as keyof EducationEntry]}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        key as keyof EducationEntry,
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
            </form>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              handleSubmit;
              router.push(`/doctor/${doctorHashId}/personal`);
            }}
            className="bg-red-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            back
          </button>
          <button
            onClick={() => {
              handleSubmit;
              router.push(`/doctor/${doctorHashId}/experience`);
            }}
            className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            {educations.length === 0 ? "Skip" : "Next"}
          </button>
        </div>
      </div>
    </SceneBox>
  );
};

export default EducationForm;

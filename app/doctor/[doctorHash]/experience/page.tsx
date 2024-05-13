"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SceneBox from "@/components/SceneBox";

interface Experience {
  years: string;
  speciality: string;
  successful_stories: string[];
  image: string;
}

const ExperienceForm: React.FC = () => {
  const [experience, setExperience] = useState<Experience>({
    years: "",
    speciality: "",
    successful_stories: [],
    image: "",
  });
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeHashId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchExperience = async () => {
      const doctorHash = localStorage.getItem("doctorHash");
      const employeeHash = localStorage.getItem("EmployeeHash");

      setDoctorHashId(doctorHash);
      setEmployeeHashId(employeeHash);
      if (doctorHash && employeeHash) {
        try {
          const response = await fetch(
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
          );
          const data = await response.json();
          if (data && data.data && data.data.doctor) {
            setExperience(data.data.doctor[0].experience || {});
          }
        } catch (error) {
          console.error("Error fetching experience data:", error);
        }
      }
    };
    fetchExperience();
  }, []);

  const addSuccessStory = () => {
    console.log("Current stories:", experience.successful_stories);
    setExperience((prev) => {
      console.log("Previous stories before update:", prev.successful_stories);
      return {
        ...prev,
        successful_stories: Array.isArray(prev.successful_stories)
          ? [...prev.successful_stories, ""]
          : [""],
      };
    });
  };
  const handleExperienceChange = (field: keyof Experience, value: string) => {
    setExperience((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStoryChange = (index: number, value: string) => {
    const newStories = [...experience.successful_stories];
    newStories[index] = value;
    setExperience((prev) => ({
      ...prev,
      successful_stories: newStories,
    }));
  };

  const removeSuccessStory = (index: number) => {
    setExperience((prev) => ({
      ...prev,
      successful_stories: prev.successful_stories.filter((_, i) => i !== index),
    }));
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
          data: { experience },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Convert response payload to JSON
      console.log("Response data:", experience);
      localStorage.setItem("data", JSON.stringify({ experience }));
    } catch (error) {
      console.error("Error submitting experience:", error);
    }
  };

  return (
    <SceneBox>
      <div>
        <div className="text-xl font-bold bg-gray-100 py-2 px-4 text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Doctor's Experience
        </div>
        <form className="flex flex-wrap p-4">
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Years of Experience
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
              value={experience.years}
              onChange={(e) => handleExperienceChange("years", e.target.value)}
            />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Speciality
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
              value={experience.speciality}
              onChange={(e) =>
                handleExperienceChange("speciality", e.target.value)
              }
            />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Image
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
              value={experience.image}
              onChange={(e) => handleExperienceChange("image", e.target.value)}
            />
          </div>
          {experience.successful_stories &&
            Array.isArray(experience.successful_stories) &&
            experience.successful_stories.map((story, index) => (
              <div key={index + 1} className="w-full lg:w-1/4 lg:ml-4 mt-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Success Story {index + 1}
                  </label>
                  {index > 0 && (
                    <button
                      onClick={() => removeSuccessStory(index)}
                      className="text-red-500 hover:text-red-700 text-xs dark:hover:text-red-500"
                    >
                      &times;
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  value={story}
                  onChange={(e) => handleStoryChange(index, e.target.value)}
                />
              </div>
            ))}
        </form>
        <button
          onClick={addSuccessStory}
          className="mt-4 block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ml-4"
        >
          Add Success Story
        </button>
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              handleSubmit;
              router.push(`/doctor/${doctorHashId}/education`);
            }}
            className="bg-red-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            back
          </button>
          <button
            onClick={() => {
              handleSubmit;
              router.push(`/doctor/${doctorHashId}/certificate`);
            }}
            className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            {experience.successful_stories === null ? "Skip" : "Next"}
          </button>
        </div>
      </div>
    </SceneBox>
  );
};

export default ExperienceForm;

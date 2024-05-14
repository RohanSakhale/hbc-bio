"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SceneBox from "@/components/SceneBox";

interface Experience {
  years: string;
  speciality: string;
  successful_stories: string[];
}

interface ResponseData {
  contact: {
    mobile?: string;
  };
  data: {
    doctor: {};
    educations: [];
    experience: Experience;
    certifications: [];
    memberships: [];
    specializations: [];
    achievements: [];
  };
}

const ExperienceForm: React.FC = () => {
  const [responseData, setResponseData] = useState<ResponseData>({
    contact: {},
    data: {
      doctor: {},
      educations: [],
      experience: {
        years: "",
        speciality: "",
        successful_stories: [],
      },
      certifications: [],
      memberships: [],
      specializations: [],
      achievements: [],
    },
  });
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeHashId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
              educations: [],
              experience: fetchedData.experience || {
                years: "",
                speciality: "",
                successful_stories: [],
              },
              certifications: [],
              memberships: fetchedData.memberships || [],
              specializations: fetchedData.specializations || [],
              achievements: fetchedData.achievements || [],
            };

            setResponseData({
              contact: responseData.contact,
              // @ts-ignore
              data: formattedData,
            });
          }
        })
        .catch((error) =>
          console.error("Error fetching experience data:", error)
        )
        .finally(() => setLoading(false));
    }
  }, []);

  const addSuccessStory = () => {
    setResponseData((prevData) => {
      const updatedExperience = { ...prevData.data.experience };
      updatedExperience.successful_stories = Array.isArray(
        updatedExperience.successful_stories
      )
        ? [...updatedExperience.successful_stories, ""]
        : [""];
      return {
        ...prevData,
        data: { ...prevData.data, experience: updatedExperience },
      };
    });
  };

  const handleExperienceChange = (field: keyof Experience, value: any) => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        experience: { ...prevData.data.experience, [field]: value },
      },
    }));
  };

  const handleStoryChange = (index: number, value: string) => {
    setResponseData((prevData) => {
      const updatedStories = [...prevData.data.experience.successful_stories];
      updatedStories[index] = value;
      return {
        ...prevData,
        data: {
          ...prevData.data,
          experience: {
            ...prevData.data.experience,
            successful_stories: updatedStories,
          },
        },
      };
    });
  };

  const removeSuccessStory = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault(); // Prevent the default button behavior
    setResponseData((prevData) => {
      const updatedStories = prevData.data.experience.successful_stories.filter(
        (_, i) => i !== index
      );
      return {
        ...prevData,
        data: {
          ...prevData.data,
          experience: {
            ...prevData.data.experience,
            successful_stories: updatedStories,
          },
        },
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
        experience: responseData.data.experience,
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
        console.log("Experience updated successfully.");
        localStorage.setItem(
          "data",
          JSON.stringify({ experience: responseData.data.experience })
        );
      } catch (error) {
        console.error("Error submitting experience:", error);
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
        <div className="text-xl font-bold bg-gray-100 py-2 px-4 text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Doctor Experience
        </div>
        <form className="flex flex-wrap p-4">
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Years of Experience
            </label>
            <DatePicker
              selected={
                responseData.data.experience.years
                  ? new Date(responseData.data.experience.years)
                  : null
              }
              onChange={(date: Date) =>
                handleExperienceChange(
                  "years",
                  date.toISOString().split("T")[0]
                )
              }
              showYearPicker
              dateFormat="yyyy"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Speciality
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
              value={responseData.data.experience.speciality}
              onChange={(e) =>
                handleExperienceChange("speciality", e.target.value)
              }
            />
          </div>
          {responseData.data.experience.successful_stories &&
            responseData.data.experience.successful_stories.map(
              (story, index) => (
                <div key={index} className="w-full lg:w-1/4 lg:ml-4 mt-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                      Success Story {index + 1}
                    </label>
                    <button
                      onClick={(e) => removeSuccessStory(index, e)}
                      className="text-red-500 hover:text-red-700 text-xs dark:hover:text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                    value={story}
                    onChange={(e) => handleStoryChange(index, e.target.value)}
                  />
                </div>
              )
            )}
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
            onClick={async () => {
              await handleSubmit();
              router.push(`/doctor/${doctorHashId}/education`);
            }}
            className="bg-red-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            back
          </button>
          <button
            onClick={async () => {
              await handleSubmit();
              router.push(`/doctor/${doctorHashId}/certification`);
            }}
            className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            Next
          </button>
        </div>
      </div>
    </SceneBox>
  );
};

export default ExperienceForm;

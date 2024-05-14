"use client";

import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SceneBox from "@/components/SceneBox";
import ImageCropper from "@/components/ImageCropper";
import { useRouter } from "next/navigation";

interface Achievement {
  international: boolean;
  images: string[];
  recognitions: { title: string; date: number }[];
  awards: { title: string; date: number }[];
  publications: { title: string; journal: string; year: string }[];
}

interface ResponseData {
  contact: { mobile?: string };
  data: {
    doctor: {};
    educations: [];
    certifications: [];
    experience: {};
    memberships: [];
    specializations: [];
    achievements: Achievement[];
  };
}

const AchievementForm: React.FC = () => {
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
  const [loading, setLoading] = useState<boolean>(true);
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: doctorHash, data: [] }),
        }
      )
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData?.data) {
            const fetchedData = responseData.data[0] || responseData.data;

            const formattedData = {
              doctor: {},
              educations: [],
              certifications: [],
              experience: {},
              memberships: [],
              specializations: [],
              achievements: fetchedData.achievements || [],
            };

            setResponseData({
              contact: responseData.contact,
              data: formattedData,
            });
          }
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleAchievementChange = (field: keyof Achievement, value: any) => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        achievements: prevData.data.achievements.map((achievement, index) =>
          index === 0 ? { ...achievement, [field]: value } : achievement
        ),
      },
    }));
  };

  const handleArrayChange = (
    arrayField: keyof Achievement,
    index: number,
    field: string,
    value: any
  ) => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        achievements: prevData.data.achievements.map((achievement, achIndex) =>
          achIndex === 0
            ? {
                ...achievement,
                [arrayField]: achievement[arrayField].map((item, itemIndex) =>
                  itemIndex === index ? { ...item, [field]: value } : item
                ),
              }
            : achievement
        ),
      },
    }));
  };

  const addArrayItem = (arrayField: keyof Achievement, newItem: any) => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        achievements: prevData.data.achievements.map((achievement, index) =>
          index === 0
            ? {
                ...achievement,
                [arrayField]: [...achievement[arrayField], newItem],
              }
            : achievement
        ),
      },
    }));
  };

  const removeArrayItem = (arrayField: keyof Achievement, index: number) => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        achievements: prevData.data.achievements.map((achievement, achIndex) =>
          achIndex === 0
            ? {
                ...achievement,
                [arrayField]: achievement[arrayField].filter(
                  (_, itemIndex) => itemIndex !== index
                ),
              }
            : achievement
        ),
      },
    }));
  };

  const addAchievement = () => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        achievements: [
          ...prevData.data.achievements,
          {
            international: false,
            images: ["", ""],
            recognitions: [{ title: "", date: new Date().getFullYear() }],
            awards: [{ title: "", date: new Date().getFullYear() }],
            publications: [
              {
                title: "",
                journal: "",
                year: new Date().getFullYear().toString(),
              },
            ],
          },
        ],
      },
    }));
  };

  const handleImageCrop = (croppedImageUrl: string) => {
    if (currentImageIndex !== null) {
      setResponseData((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          achievements: prevData.data.achievements.map((achievement, index) =>
            index === 0
              ? {
                  ...achievement,
                  images: achievement.images.map((image, imgIndex) =>
                    imgIndex === currentImageIndex ? croppedImageUrl : image
                  ),
                }
              : achievement
          ),
        },
      }));
      setCropperOpen(false);
      setImageToCrop(null);
      setCurrentImageIndex(null);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCurrentImageIndex(index);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!doctorHashId || !employeeHashId) {
      console.error("No doctor or employee hash ID found");
      return;
    }

    const apiUrl = `https://pixpro.app/api/employee/${employeeHashId}/contact/save`;
    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: doctorHashId,
          mobile: responseData.contact.mobile,
          data: responseData.data,
        }),
      });
      console.log("Achievements updated successfully.");
    } catch (error) {
      console.error("Error submitting achievements:", error);
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
      <div className="px-2 pt-6 pb-8 mb-4">
        {responseData.data.achievements.length === 0 ? (
          <button
            onClick={addAchievement}
            className="mt-4 block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Add Achievement
          </button>
        ) : (
          responseData.data.achievements.map(
            (achievement, achievementIndex) => (
              <div key={achievementIndex}>
                <div className="text-xl font-bold mb-4">
                  Achievement {achievementIndex + 1}
                </div>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Images
                    </label>
                    {achievement.images.map((image, index) => (
                      <div key={index} className="mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border border-gray-300">
                          <img
                            src={image || "https://via.placeholder.com/150"}
                            alt="Achievement"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, index)}
                          className="mt-2 block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        />
                        {cropperOpen && (
                          <ImageCropper onCrop={handleImageCrop} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
                    <label className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Recognitions
                    </label>
                    {achievement.recognitions.map((recognition, index) => (
                      <div key={index} className="mb-4">
                        <div>
                          <h1 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white bg-gray-100 px-2 my-2">
                            Add new Recognitions
                          </h1>
                        </div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Title
                        </label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={recognition.title}
                          onChange={(e) =>
                            handleArrayChange(
                              "recognitions",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2">
                          Date
                        </label>
                        <DatePicker
                          selected={new Date(recognition.date)}
                          onChange={(date: Date) =>
                            handleArrayChange(
                              "recognitions",
                              index,
                              "date",
                              date.getFullYear()
                            )
                          }
                          showYearPicker
                          dateFormat="yyyy"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <button
                          onClick={() => removeArrayItem("recognitions", index)}
                          className="text-red-500 hover:text-red-700 text-xs dark:hover:text-red-500 mt-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        addArrayItem("recognitions", {
                          title: "",
                          date: new Date().getFullYear(),
                        })
                      }
                      className="mt-4 block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Add Recognition
                    </button>
                  </div>
                  <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
                    <label className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Awards
                    </label>
                    {achievement.awards.map((award, index) => (
                      <div key={index} className="mb-4">
                        <div>
                          <h1 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white bg-gray-100 px-2 my-2">
                            Add new awards
                          </h1>
                        </div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Title
                        </label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={award.title}
                          onChange={(e) =>
                            handleArrayChange(
                              "awards",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2">
                          Date
                        </label>
                        <DatePicker
                          selected={new Date(award.date)}
                          onChange={(date: Date) =>
                            handleArrayChange(
                              "awards",
                              index,
                              "date",
                              date.getFullYear()
                            )
                          }
                          showYearPicker
                          dateFormat="yyyy"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <button
                          onClick={() => removeArrayItem("awards", index)}
                          className="text-red-500 hover:text-red-700 text-xs dark:hover:text-red-500 mt-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        addArrayItem("awards", {
                          title: "",
                          date: new Date().getFullYear(),
                        })
                      }
                      className="mt-4 block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Add Award
                    </button>
                  </div>
                  <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
                    <label className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Publications
                    </label>
                    {achievement.publications.map((publication, index) => (
                      <div key={index} className="mb-4">
                        <div>
                          <h1 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white bg-gray-100 px-2 my-2">
                            Add new Publications
                          </h1>
                        </div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Title
                        </label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={publication.title}
                          onChange={(e) =>
                            handleArrayChange(
                              "publications",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2">
                          Journal
                        </label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={publication.journal}
                          onChange={(e) =>
                            handleArrayChange(
                              "publications",
                              index,
                              "journal",
                              e.target.value
                            )
                          }
                        />
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2">
                          Year
                        </label>
                        <DatePicker
                          selected={
                            publication.year ? new Date(publication.year) : null
                          }
                          onChange={(date: Date) =>
                            handleArrayChange(
                              "publications",
                              index,
                              "year",
                              date.getFullYear().toString()
                            )
                          }
                          showYearPicker
                          dateFormat="yyyy"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <button
                          onClick={() => removeArrayItem("publications", index)}
                          className="text-red-500 hover:text-red-700 text-xs dark:hover:text-red-500 mt-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        addArrayItem("publications", {
                          title: "",
                          journal: "",
                          year: new Date().getFullYear().toString(),
                        })
                      }
                      className="mt-4 block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Add Publication
                    </button>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await handleSubmit();
                    router.push(`/doctor/${doctorHashId}/personal`);
                  }}
                  className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
                >
                  Next
                </button>
              </div>
            )
          )
        )}
      </div>
    </SceneBox>
  );
};

export default AchievementForm;

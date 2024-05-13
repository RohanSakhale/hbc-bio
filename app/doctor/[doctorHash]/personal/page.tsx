"use client";
import React, { useEffect, useRef, useState } from "react";
import ImageCropper from "@/components/ImageCropper";
import SceneBox from "@/components/SceneBox";

interface Doctor {
  name: string;
  photo: string;
  credentials: string;
  designation: string;
  hospitalName: string;
  hospitalAddress: string;
  location: string;
  gender: string;
}

const DoctorProfileForm: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor>({
    name: "",
    photo: "",
    credentials: "",
    designation: "",
    hospitalName: "",
    hospitalAddress: "",
    location: "",
    gender: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);

  useEffect(() => {
    const doctorHashId = localStorage.getItem("doctorHash");
    setDoctorHashId(doctorHashId);
    if (doctorHashId) {
      fetch(
        `https://pixpro.app/api/employee/pnr7x42z/contact/${doctorHashId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: doctorHashId,
            name: "Rohan Sakhale",
            mobile: "8976379661",
            data: { doctor: [] },
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Full API Response:", data.data);
          if (data && data.data) {
            setDoctor(data.data.doctor[0][0]);
          }
        })
        .catch((error) => console.error("Error fetching doctor data:", error));
    }
  }, []);

  const handleChange = (field: keyof Doctor, value: string) => {
    setDoctor({ ...doctor, [field]: value });
  };

  const handleImageCrop = (croppedImageUrl: string) => {
    setDoctor((prev) => ({ ...prev, photo: croppedImageUrl }));
  };

  const triggerFileSelectPopup = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    console.log(doctorHashId)
    console.log(doctor)
    if (!doctorHashId) {
      console.error("No doctor hash ID found");
      return; // Early exit if no hash ID is found
    }

    const apiUrl = `https://pixpro.app/api/employee/pnr7x42z/contact/${doctorHashId}`;

    const bodyData = {
      id: doctorHashId,
      name: "Rohan Sakhale",
      mobile: "8976379661",
      data: {
        doctor:doctor,
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const responseData = await response.json();
      console.log("Response from mainAPI:", responseData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <SceneBox>
      <div className="px-2 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Doctor's Profile</h2>
          <hr />
        </div>
        <div className="flex flex-wrap">
          <div className="w-full lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Photo
            </label>
            <div
              className="w-24 h-24 rounded-full overflow-hidden cursor-pointer"
              onClick={triggerFileSelectPopup}
            >
              <img
                src={doctor.photo || "https://via.placeholder.com/150"}
                alt="Doctor's Profile"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <ImageCropper onCrop={handleImageCrop} />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={doctor.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Credentials
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={doctor.credentials}
              onChange={(e) => handleChange("credentials", e.target.value)}
            />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Designation
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={doctor.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
            />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Hospital Name
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={doctor.hospitalName}
              onChange={(e) => handleChange("hospitalName", e.target.value)}
            />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Hospital Address
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={doctor.hospitalAddress}
              onChange={(e) => handleChange("hospitalAddress", e.target.value)}
            />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Gender
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={doctor.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
        >
          Next
        </button>
      </div>
    </SceneBox>
  );
};

export default DoctorProfileForm;
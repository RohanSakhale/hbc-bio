"use client";

import React, { useRef, useState } from "react";
import ImageCropper from "@/components/ImageCropper";

const AddNewDoctor: React.FC = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    mobile:"",
    photo: "",
    credentials: "",
    designation: "",
    hospitalName: "",
    hospitalAddress: "",
    location: "",
    gender: "",
  });
  const employeeHash = localStorage.getItem("EmployeeHash");
  console.log(employeeHash);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof typeof doctor, value: string) => {
    setDoctor({ ...doctor, [field]: value });
  };

  const handleImageCrop = (croppedImageUrl: string) => {
    setDoctor((prev) => ({ ...prev, Photo: croppedImageUrl }));
  };

  const triggerFileSelectPopup = () => {
    fileInputRef.current?.click();
  };
console.log(doctor)
  const handleSubmit = async () => {
    const apiUrl = `https://pixpro.app/api/employee/${employeeHash}/contact/save`;
    console.log(doctor)
    const bodyData = {
      id: null,
      name:doctor.name,
      mobile: doctor.mobile,
      data: {
        doctor: [doctor], // Send the entire doctor object as an array item
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
      console.log("Response from API:", responseData);

      // Check if the API call was successful and the response contains the hash
      if (response.ok && responseData.contact && responseData.contact.hash) {
        localStorage.setItem("doctorHash", responseData.contact.hash);
        console.log(
          "Hash ID saved to localStorage:",
          responseData.contact.hash
        );
      } else {
        console.error("Failed to retrieve hash from API response");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
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
              src={doctor.photo}
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
            Number
          </label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={doctor.mobile}
            onChange={(e) => handleChange("mobile", e.target.value)}
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
        Save and next
      </button>
    </div>
  );
};
export default AddNewDoctor;
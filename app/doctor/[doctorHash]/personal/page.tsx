"use client";

import React, { useEffect, useRef, useState } from "react";
import SceneBox from "@/components/SceneBox";
import ImageCropper from "@/components/ImageCropper";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Doctor {
  name: string;
  mobile: string;
  photo: string;
  credentials: string;
  designation: string;
  hospitalName: string;
  hospitalAddress: string;
  location: string;
  gender: string;
}

interface ResponseData {
  contact: {
    mobile?: string;
  };
  data: {
    doctor: Doctor;
    educations: [];
    certifications: [];
    experience: {};
    memberships: [];
    specializations: [];
    achievements: [];
  };
}

const DoctorProfileForm: React.FC = () => {
  const [responseData, setResponseData] = useState<ResponseData>({
    contact: {},
    data: {
      doctor: {
        name: "",
        mobile: "",
        photo: "",
        credentials: "",
        designation: "",
        hospitalName: "",
        hospitalAddress: "",
        location: "",
        gender: "",
      },
      educations: [],
      certifications: [],
      experience: {},
      memberships: [],
      specializations: [],
      achievements: [],
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeHashId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
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
          }),
        }
      )
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData?.data) {
            const fetchedData = responseData.data[0] || responseData.data;

            const formattedData = {
              doctor: fetchedData.doctor || {
                name: "",
                mobile: "",
                photo: "",
                credentials: "",
                designation: "",
                hospitalName: "",
                hospitalAddress: "",
                location: "",
                gender: "",
              },
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
        .catch((error) => console.error("Error fetching doctor data:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleChange = (field: keyof Doctor, value: string) => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        doctor: { ...prevData.data.doctor, [field]: value },
      },
    }));
  };

  const handleImageCrop = (croppedImageUrl: string) => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        doctor: { ...prevData.data.doctor, photo: croppedImageUrl },
      },
    }));
    setCropperOpen(false);
  };

  const triggerFileSelectPopup = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!doctorHashId || !employeeHashId) {
      console.error("No doctor or employee hash ID found");
      return;
    }

    const apiUrl = `https://pixpro.app/api/employee/${employeeHashId}/contact/save`;
    const bodyData = {
      id: doctorHashId,
      mobile: responseData.contact.mobile,
      data: responseData.data,
    };

    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      router.push(`/doctor/${doctorHashId}/education`);
    } catch (error) {
      console.error("Error submitting form:", error);
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
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Doctors Profile</h2>
          <hr />
        </div>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Photo
            </label>
            <div
              className="w-24 h-24 overflow-hidden cursor-pointer border border-gray-300"
              onClick={triggerFileSelectPopup}
            >
              <Image
                src={
                  responseData.data.doctor.photo ||
                  "https://via.placeholder.com/150"
                }
                alt="Doctor's Profile"
                className="w-full h-full object-cover object-center"
                width={300}
                height={300}
              />
            </div>
            {cropperOpen && (
              <ImageCropper
                key="doctor-photo-cropper"
                onCrop={handleImageCrop}
              />
            )}
            <input
              type="file"
              ref={fileInputRef}
              id="doctor-photo"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setCroppedImage(reader.result as string);
                    setCropperOpen(true);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={responseData.data.doctor.name}
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
              value={responseData.data.doctor.credentials}
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
              value={responseData.data.doctor.designation}
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
              value={responseData.data.doctor.hospitalName}
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
              value={responseData.data.doctor.hospitalAddress}
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
              value={responseData.data.doctor.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={async () => {
            await handleSubmit();
            router.push(`/doctor/${doctorHashId}/education`);
          }}
          className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
        >
          Next
        </button>
      </div>
    </SceneBox>
  );
};

export default DoctorProfileForm;

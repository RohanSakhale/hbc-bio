"use client";

import React, { useState, useEffect } from "react";
import SceneBox from "@/components/SceneBox";
import { useRouter } from "next/navigation";
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageCropper from "@/components/ImageCropper"; // Ensure the path to ImageCropper is correct

interface Certification {
  CertificateName: string;
  IssuingOrganization: string;
  Year: string | null;
  CertificateImage: string;
}

interface ResponseData {
  contact: {
    mobile?: string;
  };
  data: {
    doctor: {};
    educations: [];
    certifications: Certification[];
    experience: {};
    memberships: any[];
    specializations: any[];
    achievements: any[],
  };
}

const CertificationsForm = () => {
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
  const [cropperOpen, setCropperOpen] = useState<number | null>(null); // State to track which cropper is open
  const [imageToCrop, setImageToCrop] = useState<string | null>(null); // State to hold the image to crop
  const [currentCertIndex, setCurrentCertIndex] = useState<number | null>(null); // State to track current certification index for image cropping
  const router = useRouter();

  // Fetch initial data from the API
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
              certifications: fetchedData.certifications || [],
              experience: {},
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
        .catch((error) => console.error("Error fetching doctor data:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  // Add a new certification entry
  const addCertification = () => {
    setResponseData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        certifications: [
          ...prevData.data.certifications,
          {
            CertificateName: "",
            IssuingOrganization: "",
            Year: null,
            CertificateImage: "",
          },
        ],
      },
    }));
  };

  // Handle changes in the certification fields
  const handleCertificationChange = (
    index: number,
    field: keyof Certification,
    value: any
  ) => {
    setResponseData((prevData) => {
      const updatedCertifications = [...prevData.data.certifications];
      updatedCertifications[index][field] = value;
      return {
        ...prevData,
        data: { ...prevData.data, certifications: updatedCertifications },
      };
    });
  };

  // Remove a certification
  const removeCertification = (index: number) => {
    setResponseData((prevData) => {
      const updatedCertifications = [...prevData.data.certifications];
      updatedCertifications.splice(index, 1);
      return {
        ...prevData,
        data: { ...prevData.data, certifications: updatedCertifications },
      };
    });
  };

  // Handle image crop
  const handleImageCrop = (croppedImageUrl: string) => {
    if (currentCertIndex !== null) {
      setResponseData((prevData) => {
        const updatedCertifications = [...prevData.data.certifications];
        updatedCertifications[currentCertIndex].CertificateImage =
          croppedImageUrl;
        return {
          ...prevData,
          data: { ...prevData.data, certifications: updatedCertifications },
        };
      });
      setCropperOpen(null); // Close the cropper after cropping
      setImageToCrop(null); // Clear the image to crop
      setCurrentCertIndex(null); // Reset the current certification index
    }
  };

  // Submit the certifications to the API
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
        certifications: responseData.data.certifications,
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
        console.log("Certifications updated successfully.");
      } catch (error) {
        console.error("Error submitting certifications:", error);
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
      <div className="px-2 pt-6 pb-8 mb-4">
        <button
          onClick={addCertification}
          className="w-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add Certification
        </button>
        {responseData.data.certifications.map((certification, index) => (
          <div className="mt-6" key={index}>
            <div className="flex justify-between items-center bg-gray-100 py-2 px-4">
              <div className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Add new Certification for Doctor
              </div>
              <button
                onClick={() => removeCertification(index)}
                className="text-red-500 hover:text-red-700 text-3xl dark:hover:text-red-500"
              >
                &times;
              </button>
            </div>
            <form className="flex flex-wrap">
              <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
                <label
                  htmlFor={`CertificateName-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Certificate Name
                </label>
                <input
                  id={`CertificateName-${index}`}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter Certificate Name"
                  value={certification.CertificateName}
                  onChange={(e) =>
                    handleCertificationChange(
                      index,
                      "CertificateName",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
                <label
                  htmlFor={`IssuingOrganization-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Issuing Organization
                </label>
                <input
                  id={`IssuingOrganization-${index}`}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter Issuing Organization"
                  value={certification.IssuingOrganization}
                  onChange={(e) =>
                    handleCertificationChange(
                      index,
                      "IssuingOrganization",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
                <label
                  htmlFor={`Year-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Year
                </label>
                <DatePicker
                  id={`Year-${index}`}
                  selected={
                    certification.Year ? new Date(certification.Year) : null
                  }
                  onChange={(date: Date) =>
                    handleCertificationChange(
                      index,
                      "Year",
                      date.toISOString().split("T")[0]
                    )
                  }
                  showYearPicker
                  dateFormat="yyyy"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
                <label
                  htmlFor={`CertificateImage-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Certificate Image
                </label>
                <div
                  className="w-24 h-24 overflow-hidden cursor-pointer border border-gray-300"
                  onClick={() => {
                    setCurrentCertIndex(index);
                    setCropperOpen(index);
                  }}
                >
                  {certification.CertificateImage ? (
                    <img
                      src={certification.CertificateImage}
                      alt="Certificate"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Placeholder"
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                </div>
                {cropperOpen === index && (
                  <ImageCropper
                    key={`CertificateImage-${index}`}
                    onCrop={(croppedImageUrl) =>
                      handleImageCrop(croppedImageUrl)
                    }
                  />
                )}
                <input
                  type="file"
                  id={`CertificateImage-${index}`}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setImageToCrop(reader.result as string);
                        setCurrentCertIndex(index);
                        setCropperOpen(index);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </form>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <button
            onClick={async () => {
              await handleSubmit();
              router.push(`/doctor/${doctorHashId}/experience`);
            }}
            className="bg-red-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            Back
          </button>
          <button
            onClick={async () => {
              await handleSubmit();
              router.push(`/doctor/${doctorHashId}/membership`);
            }}
            className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            {responseData.data.certifications.length === 0 ? "Skip" : "Next"}
          </button>
        </div>
      </div>
    </SceneBox>
  );
};

export default CertificationsForm;

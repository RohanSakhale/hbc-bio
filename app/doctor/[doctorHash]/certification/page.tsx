"use client";

import React, { useState, useEffect } from "react";
import SceneBox from "@/components/SceneBox"; // Ensure the path to SceneBox is correct
import { useRouter } from "next/navigation";

// Define the shape of the certificate object
interface Certification {
  CertificateName: string;
  IssuingOrganization: string;
  Year: string;
  CertificateImage: string;
}

const CertificationsForm = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch initial certifications data from the API
  useEffect(() => {
    const doctorHash = localStorage.getItem("doctorHash");
    const employeeHash = localStorage.getItem("EmployeeHash");
    setDoctorId(doctorHash);
    setEmployeeId(employeeHash);

    const fetchCertifications = async () => {
      if (doctorHash && employeeHash) {
        try {
          const response = await fetch(
            `https://pixpro.app/api/employee/${employeeHash}/contact/${doctorHash}/certifications`
          );
          const data = await response.json();
          setCertifications(data.certifications || []);
        } catch (error) {
          console.error("Error fetching certification data:", error);
        }
      }
    };

    fetchCertifications();
  }, []);

  // Add a new certification entry
  const addCertification = () => {
    const newCertification: Certification = {
      CertificateName: "",
      IssuingOrganization: "",
      Year: "",
      CertificateImage: "",
    };
    setCertifications([...certifications, newCertification]);
  };

  // Handle changes in the certification fields
  const handleCertificationChange = (
    index: number,
    field: keyof Certification,
    value: string
  ) => {
    const updatedCertifications = certifications.map((certification, idx) => {
      if (index === idx) {
        return { ...certification, [field]: value };
      }
      return certification;
    });
    setCertifications(updatedCertifications);
  };

  // Remove a certification
  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, idx) => idx !== index));
  };

  // Submit the certifications to the API
  const handleSubmit = async () => {
    if (doctorId && employeeId) {
      try {
        await fetch(
          `https://pixpro.app/api/employee/${employeeId}/contact/${doctorId}/certifications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ certifications }),
          }
        );
        console.log("Certifications updated successfully.");
      } catch (error) {
        console.error("Error submitting certifications:", error);
      }
    }
  };

  return (
    <SceneBox>
      <div className="px-2 pt-6 pb-8 mb-4">
        <button
          onClick={addCertification}
          className="w-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add Certification
        </button>
        {certifications.map((cer, index) => (
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
              {Object.keys(cer).map((key) => (
                <div key={key} className="w-full lg:w-1/4 lg:ml-4 mt-3">
                  <label
                    htmlFor={`${key}-${index}`}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .replace("Certificate", "")
                      .replace("Name", "Name:")}
                  </label>
                  <input
                    id={`${key}-${index}`}
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={`Enter ${key
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .replace("Certificate", "")
                      .replace("Name", "Name:")}`}
                    value={cer[key as keyof Certification]}
                    onChange={(e) =>
                      handleCertificationChange(
                        index,
                        key as keyof Certification,
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
              router.push(`/doctor/${doctorId}/experience`);
            }}
            className="bg-red-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            back
          </button>
          <button
            onClick={() => {
              handleSubmit;
              router.push(`/doctor/${doctorId}/membership`);
            }}
            className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            {certifications.length === 0 ? "Skip" : "Next"}
          </button>
        </div>
      </div>
    </SceneBox>
  );
};

export default CertificationsForm;

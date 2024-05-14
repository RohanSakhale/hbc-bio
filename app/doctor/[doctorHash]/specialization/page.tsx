"use client";

import React, { useState, useEffect } from "react";
import SceneBox from "@/components/SceneBox";
import { useRouter } from "next/navigation";
import ImageCropper from "@/components/ImageCropper";

interface Instrument {
  name: string;
  image: string;
}

interface Specialization {
  image: string;
  hospital_address: string;
  treatment_options: string[];
  therapy: string;
  instruments: Instrument[];
}

interface ResponseData {
  contact: {
    mobile?: string;
  };
  data: {
    doctor: {};
    educations: [];
    experience: {};
    certifications: [];
    memberships: any[];
    specializations: Specialization[];
    achievements: [];
  };
}

const SpecializationForm: React.FC = () => {
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeHashId] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState<number | null>(null); // State to track which cropper is open
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const router = useRouter();
  const [responseData, setResponseData] = useState<ResponseData>({
    contact: {},
    data: {
      doctor: {},
      educations: [],
      experience: {},
      certifications: [],
      memberships: [],
      specializations: [],
      achievements: [],
    },
  });

  useEffect(() => {
    const doctorHash = localStorage.getItem("doctorHash");
    const employeeHash = localStorage.getItem("EmployeeHash");
    setDoctorHashId(doctorHash);
    setEmployeeHashId(employeeHash);

    if (doctorHash) {
      fetch(
        `https://pixpro.app/api/employee/${employeeHash}/contact/${doctorHash}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: doctorHash,
            data: [],
          }),
        }
      )
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData) {
            const fetchedData = responseData.data[0] || responseData.data;
            const formattedData = {
              doctor: {},
              educations: [],
              experience: {},
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
          } else {
            console.error("No response data received.");
          }
        })
        .catch((error) => console.error("Error fetching doctor data:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  const addSpecialization = () => {
    setResponseData((prevData: ResponseData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        specializations: [
          ...prevData.data.specializations,
          {
            image: "",
            hospital_address: "",
            treatment_options: [],
            therapy: "",
            instruments: [],
          },
        ],
      },
    }));
  };

  const removeSpecialization = (index: number) => {
    setResponseData((prevData: ResponseData) => {
      const updatedSpecializations = [...prevData.data.specializations];
      updatedSpecializations.splice(index, 1);
      return {
        ...prevData,
        data: { ...prevData.data, specializations: updatedSpecializations },
      };
    });
  };

  const handleSpecializationChange = (
    index: number,
    field: keyof Specialization,
    value: any
  ) => {
    setResponseData((prevData: ResponseData) => {
      const updatedSpecializations = [...prevData.data.specializations];
      updatedSpecializations[index][field] = value;
      return {
        ...prevData,
        data: { ...prevData.data, specializations: updatedSpecializations },
      };
    });
  };

  const addInstrument = (specIndex: number) => {
    setResponseData((prevData: ResponseData) => {
      const updatedSpecializations = [...prevData.data.specializations];
      updatedSpecializations[specIndex].instruments.push({
        name: "",
        image: "",
      });
      return {
        ...prevData,
        data: { ...prevData.data, specializations: updatedSpecializations },
      };
    });
  };

  const removeInstrument = (specIndex: number, instrumentIndex: number) => {
    setResponseData((prevData: ResponseData) => {
      const updatedSpecializations = [...prevData.data.specializations];
      updatedSpecializations[specIndex].instruments.splice(instrumentIndex, 1);
      return {
        ...prevData,
        data: { ...prevData.data, specializations: updatedSpecializations },
      };
    });
  };

  const handleInstrumentChange = (
    specIndex: number,
    instrumentIndex: number,
    field: keyof Instrument,
    value: any
  ) => {
    setResponseData((prevData: ResponseData) => {
      const updatedSpecializations = [...prevData.data.specializations];
      updatedSpecializations[specIndex].instruments[instrumentIndex][field] =
        value;
      return {
        ...prevData,
        data: { ...prevData.data, specializations: updatedSpecializations },
      };
    });
  };

  const handleImageCrop = (croppedImageUrl: string, specIndex: number) => {
    setResponseData((prevData: ResponseData) => {
      const updatedSpecializations = [...prevData.data.specializations];
      updatedSpecializations[specIndex].image = croppedImageUrl;
      return {
        ...prevData,
        data: { ...prevData.data, specializations: updatedSpecializations },
      };
    });
    setCropperOpen(null); // Close the cropper after cropping
  };

  const handleSubmit = async () => {
    if (!doctorHashId || !employeeHashId) {
      console.error("Doctor or Employee Hash ID not found");
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
      console.log("Specializations updated successfully.");
    } catch (error) {
      console.error("Error submitting specializations:", error);
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
      <div className="flex flex-col pt-6 pb-8 mb-4">
        <button
          onClick={addSpecialization}
          className="w-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add Specialization
        </button>
        {responseData.data?.specializations &&
          responseData.data.specializations.map(
            (spec: Specialization, specIndex: number) => (
              <div
                key={specIndex}
                className="mt-4 bg-gray-100 p-2 rounded-md relative"
              >
                <button
                  onClick={() => removeSpecialization(specIndex)}
                  className="text-red-500 absolute -top-2 -right-1"
                >
                  ❌
                </button>
                <div className="mt-4">
                  <label htmlFor={`spec-${specIndex}-image`}>Image</label>
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => setCropperOpen(specIndex)}
                  >
                    {spec.image ? (
                      <img
                        src={spec.image}
                        alt="Specialization Image"
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
                  {cropperOpen === specIndex && (
                    <ImageCropper
                      key={`spec-${specIndex}-image`}
                      onCrop={(croppedImageUrl) =>
                        handleImageCrop(croppedImageUrl, specIndex)
                      }
                    />
                  )}
                  <input
                    type="file"
                    id={`spec-${specIndex}-image`}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setCropperOpen(specIndex);
                          setCroppedImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor={`spec-${specIndex}-hospital-address`}>
                    Hospital Address
                  </label>
                  <input
                    type="text"
                    id={`spec-${specIndex}-hospital-address`}
                    value={spec.hospital_address}
                    onChange={(e) =>
                      handleSpecializationChange(
                        specIndex,
                        "hospital_address",
                        e.target.value
                      )
                    }
                    className="bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor={`spec-${specIndex}-therapy`}>Therapy</label>
                  <input
                    type="text"
                    id={`spec-${specIndex}-therapy`}
                    value={spec.therapy}
                    onChange={(e) =>
                      handleSpecializationChange(
                        specIndex,
                        "therapy",
                        e.target.value
                      )
                    }
                    className="bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <label>Treatment Options Details</label>
                  {spec.treatment_options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const updatedOptions = [...spec.treatment_options];
                          updatedOptions[optionIndex] = e.target.value;
                          handleSpecializationChange(
                            specIndex,
                            "treatment_options",
                            updatedOptions
                          );
                        }}
                        className="bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      const updatedOptions = [...spec.treatment_options, ""];
                      handleSpecializationChange(
                        specIndex,
                        "treatment_options",
                        updatedOptions
                      );
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                  >
                    Add New Treatment
                  </button>
                </div>
                <div className="mt-4">
                  <label>Instruments</label>
                  {spec.instruments.map((instrument, instrumentIndex) => (
                    <div key={instrumentIndex} className="mt-2">
                      <label>{`Instrument Name`}</label>
                      <input
                        type="text"
                        value={instrument.name}
                        onChange={(e) =>
                          handleInstrumentChange(
                            specIndex,
                            instrumentIndex,
                            "name",
                            e.target.value
                          )
                        }
                        className="bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <label>{`Instrument Image`}</label>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              handleInstrumentChange(
                                specIndex,
                                instrumentIndex,
                                "image",
                                reader.result as string
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <button
                        onClick={() =>
                          removeInstrument(specIndex, instrumentIndex)
                        }
                        className="text-red-500 mt-1"
                      >
                        Remove Instrument
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => addInstrument(specIndex)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                  >
                    Add Instrument
                  </button>
                </div>
              </div>
            )
          )}

        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <button
            onClick={async () => {
              await handleSubmit();
              router.push(`/doctor/${doctorHashId}/certification`);
            }}
            className="bg-red-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            Back
          </button>
          <button
            onClick={async () => {
              await handleSubmit();
              //   router.push(`/doctor/${doctorHashId}/personal`);
            }}
            className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            {responseData.data.specializations?.length === 0 ? "Skip" : "Next"}
          </button>
        </div>
      </div>
    </SceneBox>
  );
};

export default SpecializationForm;

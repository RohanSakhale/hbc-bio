"use client";
import CertificationsForm from "@/components/CertificationsForm";
import ExperienceForm from "@/components/ExperienceForm";
import EducationForm from "@/components/EducationForm";
import { FormEventHandler, useState } from "react";
import DoctorProfileForm from "@/components/DoctorProfileForm";
import MembershipsForm from "@/components/MembershipsForm";

const fetchedData = {
  doctor: {
    Name: "Dr. Sail Patil",
    Photo:
      "https://static.vecteezy.com/system/resources/thumbnails/028/287/555/small_2x/an-indian-young-female-doctor-isolated-on-green-ai-generated-photo.jpg",
    Credentials: "MBBS, MD Dermatology",
    Designation: "Consultant Dermatologist",
    HospitalName: "Max Healthcare Institute",
    HospitalAddress: "1, Press Enclave Road, Saket, New Delhi, 110017",
    Location: "New Delhi Road",
    Gender: "Male",
  },
  educations: [],
  certifications: [],
  experience: {
    successful_stories: [],
  },
  memberships: [],
  specializations: [],
  achievements: {},
  gallery: [],
  thank_you: {},
};

const AddNewDoctor: React.FC<{}> = () => {
  const [activeForm, setActiveForm] = useState("doctor");
  const [mainJson, setMainJson] = useState(fetchedData);
  return (
    <div>
      <div className="bg-gray-100 p-4 shadow-md border">
        <h1 className="bg-orange-500 py-2 w-full rounded-lg text-white text-center text-lg">
          Scene Box
        </h1>
        <div className="flex flex-wrap mt-4">
          <button
            onClick={() => setActiveForm("doctor")}
            className={`w-fit text-white border-2 ml-2 mt-2 ${
              activeForm === "doctor"
                ? "bg-orange-600 hover:bg-orange-700"
                : " border-orange-600 hover:bg-orange-100 text-orange-500"
            } font-medium rounded-lg text-md px-3 py-1 text-center `}
          >
            Doctor
          </button>
          <button
            onClick={() => setActiveForm("education")}
            className={`w-fit text-white border-2 ml-2 mt-2 ${
              activeForm === "education"
                ? "bg-orange-600 hover:bg-orange-700"
                : " border-orange-600 hover:bg-orange-100 text-orange-500"
            } font-medium rounded-lg text-md px-3 py-1 text-center `}
          >
            Education
          </button>
          <button
            onClick={() => setActiveForm("experience")}
            className={`w-fit text-white border-2 ml-2 mt-2 ${
              activeForm === "experience"
                ? "bg-orange-600 hover:bg-orange-700"
                : " border-orange-600 hover:bg-orange-100 text-orange-500"
            } font-medium rounded-lg text-md px-3 py-1 text-center `}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveForm("certificate")}
            className={`w-fit text-white border-2 ml-2 mt-2 ${
              activeForm === "certificate"
                ? "bg-orange-600 hover:bg-orange-700"
                : " border-orange-600 hover:bg-orange-100 text-orange-500"
            } font-medium rounded-lg text-md px-3 py-1 text-center `}
          >
            certification
          </button>
          <button
            onClick={() => setActiveForm("membership")}
            className={`w-fit text-white border-2 ml-2 mt-2 ${
              activeForm === "membership"
                ? "bg-orange-600 hover:bg-orange-700"
                : " border-orange-600 hover:bg-orange-100 text-orange-500"
            } font-medium rounded-lg text-md px-3 py-1 text-center `}
          >
            Membership
          </button>
        </div>
      </div>

      <div className="mb-6">
        {activeForm === "doctor" ? (
          <DoctorProfileForm setMainJson={setMainJson} mainJson={mainJson} />
        ) : activeForm === "education" ? (
          <EducationForm setMainJson={setMainJson} mainJson={mainJson} />
        ) : activeForm === "certificate" ? (
          <CertificationsForm setMainJson={setMainJson} mainJson={mainJson} />
        ) : activeForm === "experience" ? (
          <ExperienceForm setMainJson={setMainJson} mainJson={mainJson} />
        ) : activeForm === "membership" ? (
          <MembershipsForm setMainJson={setMainJson} mainJson={mainJson} />
        ) : (
          activeForm === ""
        )}
      </div>
    </div>
  );
};
export default AddNewDoctor;

"use client";

import {useState } from "react";
import Link from "next/link";
import DoctorProfileForm from "../doctor/[doctorHash]/personal/page";

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

const AddNewDoctor: React.FC<{}> = ({ children }) => {
  const [activeForm, setActiveForm] = useState("doctor");

  const doctorHash = "32434";

  return (
    <div>
      <div className="bg-gray-100 p-4 shadow-md border">
        <h1 className="bg-orange-500 py-2 w-full rounded-lg text-white text-center text-lg">
          Scene Box
        </h1>
        <div className="flex flex-wrap mt-4">
          <Link href={`/doctor/${doctorHash}/personal`}>
            <button
              onClick={() => setActiveForm("doctor")}
              className={`w-fit text-orange-500 border-2 ml-2 mt-2 ${
                activeForm === "doctor"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : " border-orange-600 hover:bg-orange-100 text-orange-500"
              } font-medium rounded-lg text-md px-3 py-1 text-center `}
            >
              Doctor
            </button>
          </Link>
          <Link href={`/doctor/${doctorHash}/education`}>
            <button
              onClick={() => setActiveForm("education")}
              className={`w-fit text-orange-500 border-2 ml-2 mt-2 ${
                activeForm === "education"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : " border-orange-600 hover:bg-orange-100 text-orange-500"
              } font-medium rounded-lg text-md px-3 py-1 text-center `}
            >
              Education
            </button>
          </Link>
          <Link href={`/doctor/${doctorHash}/experience`}>
            <button
              onClick={() => setActiveForm("experience")}
              className={`w-fit text-orange-500 border-2 ml-2 mt-2 ${
                activeForm === "experience"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : " border-orange-600 hover:bg-orange-100 text-orange-500"
              } font-medium rounded-lg text-md px-3 py-1 text-center `}
            >
              Experience
            </button>
          </Link>
          <Link href={`/doctor/${doctorHash}/certification`}>
            <button
              onClick={() => setActiveForm("certificate")}
              className={`w-fit text-orange-500 border-2 ml-2 mt-2 ${
                activeForm === "certificate"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : " border-orange-600 hover:bg-orange-100 text-orange-500"
              } font-medium rounded-lg text-md px-3 py-1 text-center `}
            >
              certification
            </button>
          </Link>
          <Link href={`/doctor/${doctorHash}/`}>
            <button
              onClick={() => setActiveForm("membership")}
              className={`w-fit text-orange-500 border-2 ml-2 mt-2 ${
                activeForm === "membership"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : " border-orange-600 hover:bg-orange-100 text-orange-500"
              } font-medium rounded-lg text-md px-3 py-1 text-center `}
            >
              Membership
            </button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <DoctorProfileForm />
      </div>
    </div>
  );
};
export default AddNewDoctor;

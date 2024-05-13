"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SceneBoxProps {
  children: React.ReactNode; // Typing for children using React.ReactNode
}

const SceneBox: React.FC<SceneBoxProps> = ({ children }) => {
  const [activeForm, setActiveForm] = useState("");
  const doctorHash = localStorage.getItem("doctorHash");
  const router = useRouter();

  useEffect(() => {
    if (!doctorHash) {
      router.push("/projects");
    }
  }, [doctorHash, router]);

  // Determine active form from URL
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const activeIndex =
      pathSegments.findIndex((segment) => segment === doctorHash) + 1;
    if (activeIndex > 0 && activeIndex < pathSegments.length) {
      setActiveForm(pathSegments[activeIndex]);
    }
  }, [doctorHash]);

  return (
    <div className="bg-gray-100 p-4 shadow-md border">
      <h1 className="bg-orange-500 py-2 w-full rounded-lg text-white text-center text-lg">
        Scene Box
      </h1>
      <div className="flex flex-wrap mt-4">
        {[
          { name: "personal", label: "Doctor" },
          { name: "education", label: "Education" },
          { name: "experience", label: "Experience" },
          { name: "certification", label: "Certification" },
          { name: "membership", label: "Membership" },
        ].map((tab) => (
          <Link
            key={tab.name}
            href={`/doctor/${doctorHash}/${tab.name}`}
            className={`w-fit text-orange-500 border-2 ml-2 mt-2 ${
              activeForm === tab.name
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "border-orange-600 hover:bg-orange-100 text-orange-500"
            } font-medium rounded-lg text-md px-3 py-1 text-center`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SceneBox;

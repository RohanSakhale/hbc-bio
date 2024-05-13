"use client";

import React, { useState, useEffect } from "react";
import SceneBox from "@/components/SceneBox";
import { useRouter } from "next/navigation";

interface Membership {
  international: boolean;
  associations: string[];
}
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

const MembershipForm: React.FC = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeHashId] = useState<string | null>(null);
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor>({
    name: "",
    mobile: "",
    photo: "",
    credentials: "",
    designation: "",
    hospitalName: "",
    hospitalAddress: "",
    location: "",
    gender: "",
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
            name: "Rohan Sakhale",
            mobile: "8976379661",
            data: { doctor: [] },
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data) {
            console.log(data);
            // setDoctor(data.data.doctor[0]);
          }
        })
        .catch((error) => console.error("Error fetching doctor data:", error));
    }
  }, []);

  const addMembership = () => {
    setMemberships([
      ...memberships,
      { international: false, associations: [] },
    ]);
  };

  const addAssociation = (index: number) => {
    const updatedMemberships = memberships.map((membership, memIndex) => {
      if (index === memIndex) {
        return {
          ...membership,
          associations: [...membership.associations, ""],
        };
      }
      return membership;
    });
    setMemberships(updatedMemberships);
  };

  const handleInternationalChange = (index: number, value: boolean) => {
    const updatedMemberships = memberships.map((membership, memIndex) => {
      if (memIndex === index) {
        return { ...membership, international: value };
      }
      return membership;
    });
    setMemberships(updatedMemberships);
  };

  const handleAssociationChange = (
    index: number,
    assocIndex: number,
    value: string
  ) => {
    const updatedMemberships = memberships.map((membership, memIndex) => {
      if (memIndex === index) {
        const newAssociations = [...membership.associations];
        newAssociations[assocIndex] = value;
        return { ...membership, associations: newAssociations };
      }
      return membership;
    });
    setMemberships(updatedMemberships);
  };

  const removeMembership = (index: number) => {
    setMemberships(memberships.filter((_, memIndex) => memIndex !== index));
  };

  const removeAssociation = (index: number, assocIdx: number) => {
    const updatedMemberships = memberships.map((membership, memIndex) => {
      if (memIndex === index) {
        return {
          ...membership,
          associations: membership.associations.filter(
            (_, idx) => idx !== assocIdx
          ),
        };
      }
      return membership;
    });
    setMemberships(updatedMemberships);
  };

  const handleSubmit = async () => {
    if (!doctorHashId) {
      console.error("No doctor hash ID found");
      return;
    }
    const apiUrl = `https://pixpro.app/api/employee/${employeeHashId}/contact/${doctorHashId}`;
    const bodyData = {
      id: doctorHashId,
      name: doctor.name,
      mobile: doctor.mobile,
      data: {
        memberships: memberships,
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
      console.log("data", responseData);
      // router.push(`/doctor/${doctorHashId}/membership`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  console.log(memberships);
  return (
    <SceneBox>
      <div className="pt-6 pb-8 mb-4">
        <button
          onClick={addMembership}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Membership
        </button>
        {memberships.map((membership, index) => (
          <div key={index} className="mt-4 bg-gray-100 p-2 rounded-md relative">
            <div className="flex space-x-2">
              <input
                type="checkbox"
                checked={membership.international}
                onChange={(e) =>
                  handleInternationalChange(index, e.target.checked)
                }
              />{" "}
              <p>International</p>
            </div>
            {membership.associations.map((association, assocIdx) => (
              <div key={assocIdx} className="mt-4">
                <div className="flex justify-between w-full">
                  <label htmlFor={`${index}-${assocIdx}`}>{`Enter association ${
                    assocIdx + 1
                  }`}</label>
                  <button
                    onClick={() => removeAssociation(index, assocIdx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={association}
                  id={`${index}-${assocIdx}`}
                  className="bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) =>
                    handleAssociationChange(index, assocIdx, e.target.value)
                  }
                />
              </div>
            ))}
            <button
              onClick={() => addAssociation(index)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Add Association
            </button>
            <button
              onClick={() => removeMembership(index)}
              className="text-red-500 absolute -top-2 -right-1"
            >
              ❌
            </button>
          </div>
        ))}
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

export default MembershipForm;

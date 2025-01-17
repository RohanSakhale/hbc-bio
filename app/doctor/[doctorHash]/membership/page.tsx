"use client";

import React, { useState, useEffect } from "react";
import SceneBox from "@/components/SceneBox";
import { useRouter } from "next/navigation";

interface Membership {
  international: boolean;
  associations: string[];
}

const MembershipForm: React.FC = () => {
  const [data, setData] = useState<any>({
    doctor: {},
    educations: [],
    experience: {},
    certifications: [],
    memberships: [],
    specializations: [],
    achievements:[]
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeHashId] = useState<string | null>(null);
  const [contact, setContact] = useState<any | null>(null);
  const router = useRouter();

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
              experience: {},
              certifications: [],
              memberships: fetchedData.memberships || [],
              specializations: fetchedData.specializations || [],
              achievements: fetchedData.achievements || [],
            };

            setData(formattedData);
            setContact(responseData.contact);
          }
        })
        .catch((error) => console.error("Error fetching doctor data:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  const addMembership = () => {
    setData((prevData: any) => ({
      ...prevData,
      memberships: [
        ...(prevData?.memberships || []),
        { international: false, associations: [] },
      ],
    }));
  };

  const addAssociation = (index: number) => {
    setData((prevData: any) => {
      const updatedMemberships = [...prevData.memberships];
      updatedMemberships[index].associations.push("");
      return { ...prevData, memberships: updatedMemberships };
    });
  };

  const handleInternationalChange = (index: number, value: boolean) => {
    setData((prevData: any) => {
      const updatedMemberships = [...prevData.memberships];
      updatedMemberships[index].international = value;
      return { ...prevData, memberships: updatedMemberships };
    });
  };

  const handleAssociationChange = (
    index: number,
    assocIndex: number,
    value: string
  ) => {
    setData((prevData: any) => {
      const updatedMemberships = [...prevData.memberships];
      updatedMemberships[index].associations[assocIndex] = value;
      return { ...prevData, memberships: updatedMemberships };
    });
  };

  const removeMembership = (index: number) => {
    setData((prevData: any) => {
      const updatedMemberships = [...prevData.memberships];
      updatedMemberships.splice(index, 1);
      return { ...prevData, memberships: updatedMemberships };
    });
  };

  const removeAssociation = (index: number, assocIdx: number) => {
    setData((prevData: any) => {
      const updatedMemberships = [...prevData.memberships];
      updatedMemberships[index].associations.splice(assocIdx, 1);
      return { ...prevData, memberships: updatedMemberships };
    });
  };

  const handleSubmit = async () => {
    if (!doctorHashId || !employeeHashId) {
      console.error("No doctor or employee hash ID found");
      return;
    }

    const bodyData = {
      id: doctorHashId,
      mobile: contact?.mobile,
      data: {
        ...data,
        memberships: data.memberships.map((membership: Membership) => ({
          international: membership.international,
          associations: membership.associations,
        })),
      },
    };

    try {
      const response = await fetch(
        `https://pixpro.app/api/employee/${employeeHashId}/contact/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      localStorage.setItem("data", JSON.stringify(data.memberships));
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
      <div className="flex flex-col pt-6 pb-8 mb-4">
        <button
          onClick={addMembership}
          className="w-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add Membership
        </button>
        {(data?.memberships || []).map((membership: Membership, index: number) => (
          <div key={index} className="mt-4 bg-gray-100 p-2 rounded-md relative">
            <div className="flex space-x-2">
              <input
                type="checkbox"
                checked={membership.international}
                onChange={(e) => handleInternationalChange(index, e.target.checked)}
              />{" "}
              <p>International</p>
            </div>
            {membership.associations.map((association: string, assocIdx: number) => (
              <div key={assocIdx} className="mt-4">
                <div className="flex justify-between w-full">
                  <label htmlFor={`${index}-${assocIdx}`}>{`Enter association ${assocIdx + 1}`}</label>
                  <button onClick={() => removeAssociation(index, assocIdx)} className="text-red-500">
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={association}
                  id={`${index}-${assocIdx}`}
                  className="bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => handleAssociationChange(index, assocIdx, e.target.value)}
                />
              </div>
            ))}
            <button onClick={() => addAssociation(index)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">
              Add Association
            </button>
            <button onClick={() => removeMembership(index)} className="text-red-500 absolute -top-2 -right-1">
              ❌
            </button>
          </div>
        ))}
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
              router.push(`/doctor/${doctorHashId}/specialization`);
            }}
            className="bg-green-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            {(data?.memberships || []).length === 0 ? "Skip" : "Next"}
          </button>
        </div>
      </div>
    </SceneBox>
  );
};

export default MembershipForm;

"use client";

import React, { useState, useEffect } from "react";
import SceneBox from "@/components/SceneBox";
import { useRouter } from "next/navigation";

interface Membership {
  international: boolean;
  associations: string[];
}

const MembershipForm: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeHashId] = useState<string | null>(null);
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
          body: JSON.stringify({
            id: doctorHash,
            data: [],
          }),
        }
      )
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData && responseData.data) {
            setData(responseData.data);
          }
        })
        .catch((error) => console.error("Error fetching doctor data:", error));
    }
  }, []);

  const addMembership = () => {
    setData({
      ...data,
      memberships: [
        ...(data?.memberships || []),
        { international: false, associations: [] },
      ],
    });
  };

  const addAssociation = (index: number) => {
    const updatedMemberships = [...data.memberships];
    updatedMemberships[index].associations.push("");
    setData({ ...data, memberships: updatedMemberships });
  };

  const handleInternationalChange = (index: number, value: boolean) => {
    const updatedMemberships = [...data.memberships];
    updatedMemberships[index].international = value;
    setData({ ...data, memberships: updatedMemberships });
  };

  const handleAssociationChange = (
    index: number,
    assocIndex: number,
    value: string
  ) => {
    const updatedMemberships = [...data.memberships];
    updatedMemberships[index].associations[assocIndex] = value;
    setData({ ...data, memberships: updatedMemberships });
  };

  const removeMembership = (index: number) => {
    const updatedMemberships = [...data.memberships];
    updatedMemberships.splice(index, 1);
    setData({ ...data, memberships: updatedMemberships });
  };

  const removeAssociation = (index: number, assocIdx: number) => {
    const updatedMemberships = [...data.memberships];
    updatedMemberships[index].associations.splice(assocIdx, 1);
    setData({ ...data, memberships: updatedMemberships });
  };

  const handleSubmit = async () => {
    if (!doctorHashId) {
      console.error("No doctor hash ID found");
      return;
    }

    const bodyData = {
      id: doctorHashId,
      data: {
        ...data,
        memberships: data.memberships.map((membership: Membership) => ({
          international: membership.international,
          associations: membership.associations,
        })),
      },
    };
    console.log(bodyData);
    const apiUrl = `https://pixpro.app/api/employee/${employeeHashId}/contact/save`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      const responseData = await response.json();
      localStorage.setItem("data", JSON.stringify(data.memberships));
      console.log("dataResponse", responseData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

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
                onChange={(e) =>
                  handleInternationalChange(index, e.target.checked)
                }
              />{" "}
              <p>International</p>
            </div>
            {membership.associations.map(
              (association: string, assocIdx: number) => (
                <div key={assocIdx} className="mt-4">
                  <div className="flex justify-between w-full">
                    <label
                      htmlFor={`${index}-${assocIdx}`}
                    >{`Enter association ${assocIdx + 1}`}</label>
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
              )
            )}
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
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <button
            onClick={async () => {
              await handleSubmit();
              router.push(`/doctor/${doctorHashId}/certification`);
            }}
            className="bg-red-500 rounded-md mt-6 text-white text-xl px-4 py-2"
          >
            back
          </button>
          <button
            onClick={async () => {
              await handleSubmit();
              // router.push(`/doctor/${doctorHashId}/personal`);
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




// const specialtyData = responseData.data.find(
//   (item: any) => item.specialty
// );
// if (specialtyData) {
//   setSpecializations(specialtyData.specialty);
// }
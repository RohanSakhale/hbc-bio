import React from "react";

// Define the shape of the certificate object
interface Membership {
  international: boolean;
  associations: string[];
}

// Define the shape of the main JSON state
interface MainJson {
  memberships: Membership[];
}

// Define the props for the CertificationsForm component
interface MembershipFormProps {
  setMainJson: React.Dispatch<React.SetStateAction<MainJson>>;
  mainJson: MainJson;
}

const MembershipForm: React.FC<MembershipFormProps> = ({
  setMainJson,
  mainJson,
}) => {
  const addMembership = () => {
    const newMembership: Membership = {
      international: false,
      associations:[],
    };
    setMainJson({
      ...mainJson,
      memberships: [...mainJson.memberships, newMembership],
    });
  };

  const handleMembershipChange = (
    index: number,
    field: keyof Membership,
    value: string
  ) => {
    const updatedMemberships = mainJson.memberships.map(
      (membership, memIndex) => {
        if (index === memIndex) {
          return { ...membership, [field]: value };
        }
        return membership;
      }
    );
    setMainJson({ ...mainJson, memberships: updatedMemberships });
  };

  const removeMembership = (index: number) => {
    setMainJson({
      ...mainJson,
      memberships: mainJson.memberships.filter(
        (_, memIndex) => memIndex !== index
      ),
    });
  };

  return (
    <div  className="px-2 pt-6 pb-8 mb-4">
      <button
        onClick={addMembership}
        className="w-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Add Membership
      </button>
      {mainJson.memberships.map((mem, index) => (
        <div className="mt-6" key={index}>
          <div className="flex justify-between items-center bg-gray-100 py-2 px-4">
            <div className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Add new membership
            </div>
            <button
              onClick={() => removeMembership(index)}
              className="text-red-500 hover:text-red-700 text-3xl dark:hover:text-red-500"
            >
              &times;
            </button>
          </div>
          <form className="flex flex-wrap">
            {Object.keys(mem).map((key) => (
              <div key={key} className="w-full lg:w-1/4 lg:ml-4 mt-3">
                <label
                  htmlFor={`${key}-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {key
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  id={`${key}-${index}`}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                  placeholder={key
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  value={mem[key as keyof Membership]}
                  onChange={(e) =>
                    handleMembershipChange(index, key as keyof Membership, e.target.value)
                  }
                />
              </div>
            ))}
          </form>
        </div>
      ))}
    </div>
  );
};

export default MembershipForm;

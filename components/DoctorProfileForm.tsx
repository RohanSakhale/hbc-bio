import React from "react";

interface Doctor {
    Photo: string;
  Name: string;
  Credentials: string;
  Designation: string;
  HospitalName: string;
  HospitalAddress: string;
  Location: string;
  Gender: string;
}

interface MainJson {
  doctor: Doctor;
}

interface DoctorProfileFormProps {
  setMainJson: React.Dispatch<React.SetStateAction<MainJson>>;
  mainJson: MainJson;
}

const DoctorProfileForm: React.FC<DoctorProfileFormProps> = ({
  setMainJson,
  mainJson,
}) => {
  const handleChange = (field: keyof Doctor, value: string) => {
    setMainJson({
      ...mainJson,
      doctor: {
        ...mainJson.doctor,
        [field]: value,
      },
    });
  };

  return (
    <div className="px-2 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Doctor's Profile</h2>
      </div>
      <div className="flex flex-wrap">
        {Object.entries(mainJson.doctor).map(([key, value]) => (
          <div key={key} className="w-full lg:w-1/4 lg:ml-4 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {key.replace(/([A-Z])/g, " $1").trim()}{" "}
              {/* Add spaces before capital letters */}
            </label>
            {key === "Photo" ? (
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={value}
                  alt="Doctor's Profile"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ) : (
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={value}
                onChange={(e) =>
                  handleChange(key as keyof Doctor, e.target.value)
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorProfileForm;

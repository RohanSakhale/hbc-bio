"use client";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Projects: React.FC<{}> = () => {
  const { isAuthenticated, data } = useAuth();
  const router = useRouter();
  const doctors = [
    {
      id: 1,
      name: "Dr. John Doe",
      photoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmVc0v_cLEW_hXiYaRcr7Zgk2sSrdrto_Jow3RKbFSEA&s",
      videoGenerated: true,
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      photoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmVc0v_cLEW_hXiYaRcr7Zgk2sSrdrto_Jow3RKbFSEA&s",
      videoGenerated: false,
    },
    {
      id: 1,
      name: "Dr. John Doe",
      photoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmVc0v_cLEW_hXiYaRcr7Zgk2sSrdrto_Jow3RKbFSEA&s",
      videoGenerated: true,
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      photoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmVc0v_cLEW_hXiYaRcr7Zgk2sSrdrto_Jow3RKbFSEA&s",
      videoGenerated: false,
    },
    // Add more doctor data as needed
  ];
  return (
    <div>
      <div className="h-32 md:h-64 w-full overflow-hidden ">
        <Image
          alt="top-banner"
          src={
            "https://w7.pngwing.com/pngs/569/779/png-transparent-chart-abstract-background-purple-texture-other.png"
          }
          width={1800}
          height={100}
        />
      </div>
      <div className="w-full max-w-7xl mx-auto left-0 lg:left-auto h-24 bg-gray-200 p-4 fixed bottom-0 z-50 flex items-center">
        <button
          className="w-full py-3 text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          onClick={() => {
            router.push("/addnewdoctor");
          }}
        >
          Add new Doctor
        </button>
      </div>

      <div className="relative overflow-x-auto sm:rounded-lg mt-10">
        <div>
          <h1>Employee Name :- {data.users.userName}</h1>
          <p>Employee code :- {data.users.code}</p>
        </div>
        <div className="hidden md:block">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-10 shadow-md">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Doctor Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Doctor Photo
                </th>
                <th scope="col" className="px-6 py-3">
                  Video Generated
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {doctor.name}
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={doctor.photoUrl}
                      alt={doctor.name}
                      className="h-10 w-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {doctor.videoGenerated ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Preview
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards for small screens */}
        <div className="md:hidden">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={doctor.photoUrl}
                  alt={doctor.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-500">
                    {doctor.videoGenerated ? "Video Available" : "No Video"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Preview
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;

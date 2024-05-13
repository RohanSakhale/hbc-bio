"use client"


// interface EducationEntry {
//   degree: string;
//   field_specialization: string;
//   college_university_name: string;
//   location: string;
//   passing_year: string;
// }

// interface EducationFormProps {
//   setMainJson: (mainJson: MainJsonType) => void;
//   mainJson: MainJsonType;
// }

// interface MainJsonType {
//   educations: EducationEntry[];
// }

const EducationForm = () => {
  // const addEducation = () => {
  //   const newEducation = {
  //     degree: "",
  //     field_specialization: "",
  //     college_university_name: "",
  //     location: "",
  //     passing_year: "",
  //   };
  //   setMainJson({
  //     ...mainJson,
  //     educations: [...mainJson.educations, newEducation],
  //   });
  // };

  // const handleEducationChange = (
  //   index: number,
  //   field: keyof EducationEntry,
  //   value: string
  // ) => {
  //   const updatedEducations = mainJson.educations.map(
  //     (edu, eduIndex: number) => {
  //       if (index === eduIndex) {
  //         return { ...edu, [field]: value };
  //       }
  //       return edu;
  //     }
  //   );
  //   setMainJson({ ...mainJson, educations: updatedEducations });
  // };

  // const removeEducation = (index: number) => {
  //   setMainJson({
  //     ...mainJson,
  //     educations: mainJson.educations.filter(
  //       (_, eduIndex: number) => eduIndex !== index
  //     ),
  //   });
  // };

  return (
    // <div>
    //   <button
    //     onClick={addEducation}
    //     className="w-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //   >
    //     Add Education
    //   </button>
    //   {mainJson.educations.map((edu, index: number) => (
    //     <div className="mt-6" key={index}>
    //       <div className="flex justify-between items-center bg-gray-100 py-2 px-4">
    //         <div className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
    //           Add new Education for doctor
    //         </div>
    //         <button
    //           onClick={() => removeEducation(index)}
    //           className="text-red-500 hover:text-red-700 text-3xl dark:hover:text-red-500"
    //         >
    //           {" "}
    //           &times;
    //         </button>
    //       </div>
    //       <form className="flex flex-wrap">
    //         {Object.keys(edu).map((key) => (
    //           <div key={key} className="w-full lg:w-1/4 lg:ml-4 mt-3">
    //             <label
    //               htmlFor={`${key}-${index}`}
    //               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    //             >
    //               {key
    //                 .replace("_", " ")
    //                 .replace(/\b\w/g, (l) => l.toUpperCase())}
    //             </label>
    //             <input
    //               id={`${key}-${index}`}
    //               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //               type="text"
    //               placeholder={key
    //                 .replace("_", " ")
    //                 .replace(/\b\w/g, (l) => l.toUpperCase())}
    //               value={edu[key as keyof EducationEntry]}
    //               onChange={(e) =>
    //                 handleEducationChange(
    //                   index,
    //                   key as keyof EducationEntry,
    //                   e.target.value
    //                 )
    //               }
    //             />
    //           </div>
    //         ))}
    //       </form>
    //     </div>
    //   ))}
    // </div>
    <div>
      experience
    </div>
  );
};

export default EducationForm;
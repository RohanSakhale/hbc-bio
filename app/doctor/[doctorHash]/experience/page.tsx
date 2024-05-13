"use client"
import React from "react";

// interface Experience {
//   years: string;
//   speciality: string;
//   successful_stories: string[];
//   image: string;
// }

// interface MainJson {
//   experience: Experience;
// }

// interface ExperienceFormProps {
//   setMainJson: React.Dispatch<React.SetStateAction<MainJson>>;
//   mainJson: MainJson;
// }

const ExperienceForm = () => {
  // Ensure initial state includes at least one success story
  // if (
  //   !mainJson.experience ||
  //   mainJson.experience.successful_stories.length === 0
  // ) {
  //   mainJson.experience = {
  //     ...mainJson.experience,
  //     successful_stories: [""],
  //   };
  // }

  // const addSuccessStory = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   const updatedExperience = {
  //     ...mainJson.experience,
  //     successful_stories: [...mainJson.experience.successful_stories, ""],
  //   };
  //   setMainJson({
  //     ...mainJson,
  //     experience: updatedExperience,
  //   });
  // };

  // const handleExperienceChange = (field: keyof Experience, value: string) => {
  //   setMainJson({
  //     ...mainJson,
  //     experience: {
  //       ...mainJson.experience,
  //       [field]: value,
  //     },
  //   });
  // };

  // const handleStoryChange = (index: number, value: string) => {
  //   const stories = [...mainJson.experience.successful_stories];
  //   stories[index] = value;
  //   setMainJson({
  //     ...mainJson,
  //     experience: {
  //       ...mainJson.experience,
  //       successful_stories: stories,
  //     },
  //   });
  // };

  // const removeSuccessStory = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   index: number
  // ) => {
  //   event.preventDefault(); // This stops the form from submitting and the page from refreshing
  //   const filteredStories = mainJson.experience.successful_stories.filter(
  //     (_, idx) => idx !== index
  //   );
  //   setMainJson({
  //     ...mainJson,
  //     experience: {
  //       ...mainJson.experience,
  //       successful_stories: filteredStories,
  //     },
  //   });
  // };

  return (
    // <div>
    //   <div className="text-xl font-bold bg-gray-100 py-2 px-4 text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
    //     Doctor's Experience
    //   </div>
    //   <form className="flex flex-wrap p-4">
    //     <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
    //       <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    //         Years of Experience
    //       </label>
    //       <input
    //         type="text"
    //         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
    //         value={mainJson.experience.years}
    //         onChange={(e) => handleExperienceChange("years", e.target.value)}
    //       />
    //     </div>
    //     <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
    //       <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    //         Speciality
    //       </label>
    //       <input
    //         type="text"
    //         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
    //         value={mainJson.experience.speciality}
    //         onChange={(e) =>
    //           handleExperienceChange("speciality", e.target.value)
    //         }
    //       />
    //     </div>
    //     <div className="w-full lg:w-1/4 lg:ml-4 mt-3">
    //       <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    //         Image
    //       </label>
    //       <input
    //         type="text"
    //         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
    //         value={mainJson.experience.image}
    //         onChange={(e) => handleExperienceChange("image", e.target.value)}
    //       />
    //     </div>
    //     {mainJson.experience.successful_stories.map((story, index) => (
    //       <div key={index + 1} className="w-full lg:w-1/4 lg:ml-4 mt-3">
    //         <div className="flex justify-between items-center">
    //           <label className="block text-sm font-medium text-gray-900 dark:text-white">
    //             Success Story {index + 1}
    //           </label>
    //           {index > 0 && (
    //             <button
    //               onClick={(e) => removeSuccessStory(e, index)}
    //               className="text-red-500 hover:text-red-700 text-xs dark:hover:text-red-500"
    //             >
    //               &times;
    //             </button>
    //           )}
    //         </div>
    //         <input
    //           type="text"
    //           className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
    //           value={story}
    //           onChange={(e) => handleStoryChange(index, e.target.value)}
    //         />
    //       </div>
    //     ))}
    //   </form>
    //   <button
    //     onClick={addSuccessStory}
    //     className="mt-4 block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ml-4"
    //   >
    //     Add Success Story
    //   </button>
    // </div>
    <div>
      omkar
    </div>
  );
};

export default ExperienceForm;

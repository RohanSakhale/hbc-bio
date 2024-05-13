
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for useRouter
import SceneBox from '@/components/SceneBox'; // Ensure this path matches your project structure

interface Instrument {
  name: string;
  image: string;
}

interface Specialization {
  image: string;
  hospital_address: string;
  treatment_options: string[];
  therapy: string;
  instruments: Instrument[];
}

const SpecializationForm: React.FC = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [doctorHashId, setDoctorHashId] = useState<string | null>(null);
  const [employeeHashId, setEmployeeHashId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const doctorHash = localStorage.getItem('doctorHash');
    const employeeHash = localStorage.getItem('EmployeeHash');
    
    setDoctorHashId(doctorHash);
    setEmployeeHashId(employeeHash);

    if (doctorHash && employeeHash) {
      const apiUrl = `https://pixpro.app/api/employee/${employeeHash}/contact/${doctorHash}/specializations`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data && data.specializations) {
            setSpecializations(data.specializations);
          }
        })
        .catch(error => console.error('Error fetching specialization data:', error));
    }
  }, []);

  const addSpecialization = () => {
    const newSpecialization: Specialization = {
      image: "",
      hospital_address: "",
      treatment_options: [],
      therapy: "",
      instruments: []
    };
    setSpecializations([...specializations, newSpecialization]);
  };

  const removeSpecialization = (index: number) => {
    const updatedSpecializations = specializations.filter((_, i) => i !== index);
    setSpecializations(updatedSpecializations);
  };

  const handleSpecializationChange = (index: number, field: keyof Specialization, value: any) => {
    const updatedSpecializations = specializations.map((spec, i) => {
      if (i === index) {
        return { ...spec, [field]: value };
      }
      return spec;
    });
    setSpecializations(updatedSpecializations);
  };

  const handleSubmit = async () => {
    if (!doctorHashId || !employeeHashId) {
      console.error("Doctor or Employee Hash ID not found");
      return;
    }
    const apiUrl = `https://pixpro.app/api/employee/${employeeHashId}/contact/${doctorHashId}/specializations`;
    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ specializations })
      });
      console.log("Specializations updated successfully.");
    } catch (error) {
      console.error("Error submitting specializations:", error);
    }
  };

  return (
    <SceneBox>
      <button onClick={addSpecialization} className="add-btn">Add Specialization</button>
      {specializations.map((spec, index) => (
        <div key={index}>
          {/* Display and edit fields for each specialization */}
          <button onClick={() => removeSpecialization(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleSubmit} className="submit-btn">Save Specializations</button>
    </SceneBox>
  );
};

export default SpecializationForm;
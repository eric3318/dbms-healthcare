import { components } from '../lib/api';

// Define patient-related types
export type Patient = components['schemas']['Patient'];
export type PatientCreateDto = components['schemas']['PatientCreateDto'] & {
  personalHealthNumber?: string;
  address?: string;
  userId?: string;
  doctorId?: string;
};
export type PatientUpdateDto = components['schemas']['PatientUpdateDto'];

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetches all patients from the API
 * @returns Array of patients or null on error
 */
export async function getAllPatients(): Promise<Patient[] | null> {
  try {
    const response = await fetch(`${API_URL}/patients`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch patients: ${response.status}`);
    }

    const data: Patient[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    return null;
  }
}

/**
 * Fetches a specific patient by ID
 * @param id - The patient's ID
 * @returns The patient object or null on error
 */
export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch patient: ${response.status}`);
    }

    const data: Patient = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching patient with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetches patients by doctor ID
 * @param doctorId - The doctor ID associated with the patients
 * @returns Array of patient objects or null on error
 */
export async function getPatientsByDoctorId(doctorId: string): Promise<Patient[] | null> {
  try {
    const response = await fetch(`${API_URL}/patients/doctor/${doctorId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch patients by doctor ID: ${response.status}`);
    }

    const data: Patient[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching patients with doctor ID ${doctorId}:`, error);
    return null;
  }
}

/**
 * Creates a new patient
 * @param patientData - The patient data to create
 * @returns The created patient object or null on error
 */
export async function createPatient(patientData: PatientCreateDto): Promise<Patient | null> {
  try {
    const response = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to create patient: ${response.status}`);
    }

    const data: Patient = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating patient:', error);
    return null;
  }
}

/**
 * Updates an existing patient
 * @param id - The patient's ID
 * @param patientData - The patient data to update
 * @returns The updated patient object or null on error
 */
export async function updatePatient(id: string, patientData: PatientUpdateDto): Promise<Patient | null> {
  try {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to update patient: ${response.status}`);
    }

    const data: Patient = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating patient with ID ${id}:`, error);
    return null;
  }
}

/**
 * Deletes a patient
 * @param id - The patient's ID
 * @returns True if successful, false otherwise
 */
export async function deletePatient(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete patient: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting patient with ID ${id}:`, error);
    return false;
  }
} 
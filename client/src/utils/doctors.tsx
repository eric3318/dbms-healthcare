import { components } from '../lib/api';

// Define doctor-related types
export type Doctor = components['schemas']['Doctor'];
export type DoctorCreateDto = components['schemas']['DoctorCreateDto'];
export type DoctorUpdateDto = components['schemas']['DoctorUpdateDto'];

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetches all doctors from the API
 * @returns Array of doctors or null on error
 */
export async function getAllDoctors(): Promise<Doctor[] | null> {
  try {
    const response = await fetch(`${API_URL}/doctors`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch doctors: ${response.status}`);
    }

    const data: Doctor[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return null;
  }
}

/**
 * Fetches a specific doctor by ID
 * @param id - The doctor's ID
 * @returns The doctor object or null on error
 */
export async function getDoctorById(id: string): Promise<Doctor | null> {
  try {
    const response = await fetch(`${API_URL}/doctors/${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch doctor: ${response.status}`);
    }

    const data: Doctor = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching doctor with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetches a doctor by user ID
 * @param userId - The user ID associated with the doctor
 * @returns The doctor object or null on error
 */
export async function getDoctorByUserId(userId: string): Promise<Doctor | null> {
  try {
    const response = await fetch(`${API_URL}/doctors/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch doctor by user ID: ${response.status}`);
    }

    const data: Doctor = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching doctor with user ID ${userId}:`, error);
    return null;
  }
}

/**
 * Creates a new doctor
 * @param doctorData - The doctor data to create
 * @returns The created doctor object or null on error
 */
export async function createDoctor(doctorData: DoctorCreateDto): Promise<Doctor | null> {
  try {
    const response = await fetch(`${API_URL}/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to create doctor: ${response.status}`);
    }

    const data: Doctor = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    return null;
  }
}

/**
 * Updates an existing doctor
 * @param id - The doctor's ID
 * @param doctorData - The updated doctor data
 * @returns The updated doctor object or null on error
 */
export async function updateDoctor(id: string, doctorData: DoctorUpdateDto): Promise<Doctor | null> {
  try {
    const response = await fetch(`${API_URL}/doctors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to update doctor: ${response.status}`);
    }

    const data: Doctor = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating doctor with ID ${id}:`, error);
    return null;
  }
}

/**
 * Deletes a doctor
 * @param id - The doctor's ID
 * @returns True if successful, false otherwise
 */
export async function deleteDoctor(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/doctors/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete doctor: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting doctor with ID ${id}:`, error);
    return false;
  }
}

const fs = require('fs');
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const API_URL = 'http://localhost:8080/api';
const AUTH_URL = 'http://localhost:8080/auth';
const data = JSON.parse(fs.readFileSync('exampleData.json', 'utf-8'));

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

async function insertResource(resourceName, resource) {
  const entries = resource.entries;
  const url = resource.apiResource
    ? `${API_URL}/${resourceName}`
    : `${AUTH_URL}/${resource.endpoint}`;

  console.log(`Starting insertion for ${resourceName}...`);
  
  try {
    for (const entry of entries) {
      const res = await client.post(url, entry, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(`Failed to insert entry in ${resourceName}: ${res.status}`);
      }
    }
    console.log(`Successfully inserted all ${resourceName}`);
  } catch (err) {
    console.error(`Insertion failed for ${resourceName}:`, err.message);
  }
}

async function verifyIdentity(entry) {
  try {
    const res = await client.post(`${AUTH_URL}/identity`, entry, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.status !== 200) {
      throw new Error(`Failed to verify identity: ${res.status}`);
    }
  } catch (err) {
    console.error(`Verification failed for ${JSON.stringify(entry)}:`, err.message);
  }
}

async function createUser(entry) {
  try {
    const res = await client.post(`${AUTH_URL}/register`, entry, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Failed to create user: ${res.status}`);
    }
  } catch (err) {
    console.error(`Creation failed for ${JSON.stringify(entry)}:`, err.message);
  }
}

async function getAllDoctors() {
  try {
    const res = await client.get(`${API_URL}/doctors`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.status !== 200) {
      throw new Error(`Failed to get doctors: ${res.status}`);
    }

    return res.data;
  } catch (err) {
    console.error('Failed to fetch doctors:', err.message);
    return [];
  }
}

async function generateSlotsForDoctor(doctor, slotTemplates) {
  // We'll use the example data as a pattern for time slots
  const createdSlots = [];
  const slotsPerDoctor = 20;
  
  // Create slotsPerDoctor slots for each doctor
  for (let i = 0; i < slotsPerDoctor; i++) {
    // Use the slot templates as patterns, cycling through them if needed
    const templateIndex = i % slotTemplates.length;
    const slotTemplate = slotTemplates[templateIndex];
    
    // Generate a new date for this slot, offset by the slot index
    // This ensures each slot has a unique date even when using the same template
    const baseDate = new Date(slotTemplate.startTime);
    const newStartDate = new Date(baseDate);
    // Add i days to the base date to create different dates
    newStartDate.setDate(baseDate.getDate() + i);
    
    const startTime = newStartDate.toISOString();
    
    // Calculate end time (30 minutes later)
    const newEndDate = new Date(newStartDate);
    newEndDate.setMinutes(newEndDate.getMinutes() + 30);
    const endTime = newEndDate.toISOString();
    
    const slot = {
      doctorId: doctor.id,
      startTime: startTime,
      endTime: endTime
    };
    
    try {
      const res = await client.post(`${API_URL}/slots`, slot, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.status === 200 || res.status === 201) {
        createdSlots.push(slot);
        console.log(`Created slot ${i+1}/20 for doctor ${doctor.name} (ID: ${doctor.id}) at ${startTime}`);
      }
    } catch (err) {
      console.error(`Failed to create slot ${i+1}/20 for doctor ${doctor.name} (ID: ${doctor.id}):`, err.message);
    }
  }
  
  return createdSlots;
}

(async () => {
  await insertResource('patients', data.patients);
  await insertResource('doctors', data.doctors);

  const patientEntries = data.patients.entries;
  const doctorEntries = data.doctors.entries;
  const userEntries = data.users.entries;

  let userIdx = 0;

  for (const patient of patientEntries) {
    await verifyIdentity(patient);
    await createUser(userEntries[userIdx]);
    userIdx++;
  }

  for (const doctor of doctorEntries) {
    await verifyIdentity(doctor);
    await createUser(userEntries[userIdx]);
    userIdx++;
  }

  // Query all doctors and create slots using templates from example data
  console.log('Querying all doctors...');
  const doctors = await getAllDoctors();
  console.log(`Found ${doctors.length} doctors`);
  
  if (doctors.length > 0 && data.slots && data.slots.entries) {
    console.log('Creating 20 slots for each doctor...');
    const slotTemplates = data.slots.entries;
    
    let totalCreatedSlots = 0;
    for (const doctor of doctors) {
      console.log(`Creating slots for doctor: ${doctor.name} (ID: ${doctor.id})`);
      const doctorSlots = await generateSlotsForDoctor(doctor, slotTemplates);
      totalCreatedSlots += doctorSlots.length;
    }
    
    console.log(`Created a total of ${totalCreatedSlots} slots for ${doctors.length} doctors`);
  } else {
    console.log('No doctors found or no slot templates available');
  }
})();
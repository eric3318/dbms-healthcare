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

})();
const fs = require('fs');

const API_URL = 'http://localhost:8080/api';
const AUTH_URL = 'http://localhost:8080/auth';
const data = JSON.parse(fs.readFileSync('exampleData.json', 'utf-8'));

async function insertData(key) {
      const url = data[key].apiResource ? `${API_URL}/${key}` : `${AUTH_URL}/${data[key].endpoint}`;
      const entries = data[key].entries;

      await Promise.all(
        entries.map(async (entry) => {
          try {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(entry)
            });
            if (!res.ok) {
              throw new Error(`Failed to insert ${key}`);
            }
          } catch (err) {
            console.error(`Failed to insert ${key}:`, err.message);
          }
        })
  );
}

async function fetchData(url) {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }

    return res.json();
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err.message);
    return [];
  }
}

async function generateSlotsForDoctor(doctor, slotTemplates) {
  const createdSlots = [];
  const slotsPerDoctor = 20;
  
  for (let i = 0; i < slotsPerDoctor; i++) {
    const templateIndex = i % slotTemplates.length;
    const slotTemplate = slotTemplates[templateIndex];
    
    const baseDate = new Date(slotTemplate.startTime);
    const newStartDate = new Date(baseDate);
    newStartDate.setDate(baseDate.getDate() + i);
    
    const startTime = newStartDate.toISOString();
    
    const newEndDate = new Date(newStartDate);
    newEndDate.setMinutes(newEndDate.getMinutes() + 30);
    const endTime = newEndDate.toISOString();
    
    const slot = {
      doctorId: doctor.id,
      startTime: startTime,
      endTime: endTime
    };
    
    try {
      const res = await fetch(`${API_URL}/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slot)
      });
      
      if (res.ok) {
        createdSlots.push(slot);
        console.log(`Created slot ${i+1}/20 for doctor ${doctor.name} (ID: ${doctor.id}) at ${startTime}`);
      }
    } catch (err) {
      console.error(`Failed to create slot ${i+1}/20 for doctor ${doctor.name} (ID: ${doctor.id}):`, err.message);
    }
  }
  return createdSlots;
}

async function updateUser(id, payload){
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Failed to update user ${id}`);
  }
}

async function verifyUser(payload){
  const res = await fetch(`${AUTH_URL}/test-identity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Failed to verify user ${payload.userId}`);
  }
}

async function main(){
  await Promise.all([
    insertData('patients'),
    insertData('doctors'),
    insertData('users'),
  ])

  const [doctors, patients, users] = await Promise.all([
    fetchData(`${API_URL}/doctors`),
    fetchData(`${API_URL}/patients`),
    fetchData(`${API_URL}/users`),
  ])

  await Promise.all(
    doctors.map((doctor) => generateSlotsForDoctor(doctor, data.slots.entries))
  );

  await updateUser(users[0].id, {roles: ['ADMIN']});

  for (let i = 1; i < 10; i ++){
    await verifyUser({
      userId: users[i].id,
      roleId: doctors[i].id,
      role : "DOCTOR"
    });
  }

  for (let i = 10; i < 19; i ++){
    await verifyUser({
      userId: users[i].id,
      roleId: patients[i].id,
      role : "PATIENT"
    });
  }
}

main();


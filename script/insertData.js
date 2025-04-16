const fs = require('fs');
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const API_URL = 'http://localhost:8080/api';
const AUTH_URL = 'http://localhost:8080/auth';
const data = JSON.parse(fs.readFileSync('exampleData.json', 'utf-8'));


const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

// 存储ID映射关系 - 从逻辑ID到MongoDB ID
const idMappings = {
  patients: {},
  doctors: {}
};

async function insertResource(resourceName, resource) {
  const entries = resource.entries;
  const url = resource.apiResource
    ? `${API_URL}/${resourceName}`
    : `${AUTH_URL}/${resource.endpoint}`;

  console.log(`Starting insertion for ${resourceName}...`);
  
  try {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      
      // 创建一个条目的副本，以避免修改原始数据
      let modifiedEntry = { ...entry };
      
      // 如果是医疗记录，需要替换逻辑ID为实际MongoDB ID
      if (resourceName === 'medical_records') {
        // 处理患者ID
        if (modifiedEntry.patientId && modifiedEntry.patientId.startsWith('patient-')) {
          const patientNum = modifiedEntry.patientId.replace('patient-', '');
          if (idMappings.patients[patientNum]) {
            console.log(`将逻辑患者ID ${modifiedEntry.patientId} 替换为实际ID ${idMappings.patients[patientNum]}`);
            modifiedEntry.patientId = idMappings.patients[patientNum];
          } else {
            console.warn(`警告: 未找到患者ID映射: ${modifiedEntry.patientId}`);
          }
        }
        
        // 处理医生ID
        if (modifiedEntry.doctorId && modifiedEntry.doctorId.startsWith('doc-')) {
          const doctorNum = modifiedEntry.doctorId.replace('doc-', '');
          if (idMappings.doctors[doctorNum]) {
            console.log(`将逻辑医生ID ${modifiedEntry.doctorId} 替换为实际ID ${idMappings.doctors[doctorNum]}`);
            modifiedEntry.doctorId = idMappings.doctors[doctorNum];
          } else {
            console.warn(`警告: 未找到医生ID映射: ${modifiedEntry.doctorId}`);
          }
        }
        
        // 移除ID字段，让MongoDB自动生成ID
        if (modifiedEntry.id) {
          delete modifiedEntry.id;
        }
        
        // 确保所有必填字段都存在，避免验证错误
        if (!modifiedEntry.visitReason) {
          modifiedEntry.visitReason = "General checkup";
          console.log("添加默认的visitReason字段");
        }
        if (!modifiedEntry.patientDescription) {
          modifiedEntry.patientDescription = "Patient description not provided";
          console.log("添加默认的patientDescription字段");
        }
        if (!modifiedEntry.billingAmount) {
          modifiedEntry.billingAmount = 100.0;
          console.log("添加默认的billingAmount字段");
        }
        
        // 特殊处理医疗记录插入
        try {
          console.log("准备插入医疗记录，详细数据:");
          console.log(JSON.stringify(modifiedEntry, null, 2));
          
          const res = await client.post(url, modifiedEntry, {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            validateStatus: function (status) {
              // 接受任何状态码，便于调试
              return true;
            }
          });
          
          console.log(`医疗记录插入响应状态: ${res.status}`);
          if (res.data) console.log(`响应数据: ${JSON.stringify(res.data)}`);
          
          if (res.status >= 200 && res.status < 300) {
            console.log(`成功插入医疗记录! ID: ${res.data.id}`);
          } else {
            console.error(`插入医疗记录失败: ${res.status}`);
            console.error(`错误信息: ${JSON.stringify(res.data)}`);
          }
          
          continue; // 继续下一条医疗记录
        } catch (err) {
          console.error("插入医疗记录时发生异常:", err.message);
          if (err.response) {
            console.error('状态码:', err.response.status);
            console.error('响应头:', JSON.stringify(err.response.headers));
            console.error('响应数据:', JSON.stringify(err.response.data));
          } else if (err.request) {
            console.error('请求已发出但没有收到响应:', err.request);
          } else {
            console.error('请求设置出错:', err.message);
          }
          continue;
        }
      }
      
      // 如果是申请表或支付记录，需要使用正确的医疗记录ID
      if (resourceName === 'requisitions' || resourceName === 'payments') {
        // 直接使用医疗记录映射（未实现，可以扩展）
        
        // 移除ID字段，让MongoDB自动生成ID
        if (modifiedEntry.id) {
          delete modifiedEntry.id;
        }
      }

      console.log(`正在插入 ${resourceName} 记录: ${JSON.stringify(modifiedEntry).substring(0, 100)}...`);
      
      try {
        const res = await client.post(url, modifiedEntry, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (res.status !== 200 && res.status !== 201) {
          throw new Error(`插入 ${resourceName} 记录失败: ${res.status}`);
        }
        
        // 存储患者和医生的ID映射
        if ((resourceName === 'patients' || resourceName === 'doctors') && res.data && res.data.id) {
          const index = i + 1; // 计算逻辑ID序号
          const logicalId = index.toString();
          
          if (resourceName === 'patients') {
            idMappings.patients[logicalId] = res.data.id;
            console.log(`映射 patient-${logicalId} -> ${res.data.id}`);
          } else if (resourceName === 'doctors') {
            idMappings.doctors[logicalId] = res.data.id;
            console.log(`映射 doc-${logicalId} -> ${res.data.id}`);
          }
        }
        
        console.log(`成功插入 ${resourceName} 记录，响应：`, res.data);
      } catch (err) {
        console.error(`插入 ${resourceName} 条目失败:`, err.message);
        if (err.response) {
          console.error('状态码:', err.response.status);
          console.error('返回头:', err.response.headers);
          console.error('响应数据:', err.response.data);
        }
        // 继续处理下一条记录而不是中断整个过程
        continue;
      }
    }
    console.log(`成功插入所有 ${resourceName}`);
  } catch (err) {
    console.error(`插入 ${resourceName} 失败:`, err.message);
    if (err.response && err.response.data) {
      console.error('错误详情:', JSON.stringify(err.response.data));
    }
  }
}

// 直接构建医疗记录样本进行测试
async function insertTestMedicalRecord() {
  try {
    // 获取第一位患者和医生的ID用于测试
    let firstPatientId = null;
    let firstDoctorId = null;
    
    for (const key in idMappings.patients) {
      firstPatientId = idMappings.patients[key];
      break;
    }
    
    for (const key in idMappings.doctors) {
      firstDoctorId = idMappings.doctors[key];
      break;
    }
    
    if (!firstPatientId || !firstDoctorId) {
      console.error("找不到有效的患者ID或医生ID进行测试");
      return;
    }
    
    const testRecord = {
      patientId: firstPatientId,
      doctorId: firstDoctorId,
      visitReason: "Test medical checkup",
      patientDescription: "Patient complains of headache",
      doctorNotes: "Patient appears to be in good health",
      finalDiagnosis: "Common cold",
      billingAmount: 150.00
    };
    
    console.log("尝试插入测试医疗记录...");
    console.log(JSON.stringify(testRecord, null, 2));
    
    const res = await client.post(`${API_URL}/medical_records`, testRecord, {
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log(`测试医疗记录插入响应: ${res.status}`);
    console.log(`响应数据: ${JSON.stringify(res.data)}`);
    
  } catch (err) {
    console.error("插入测试医疗记录失败:", err.message);
    if (err.response) {
      console.error('状态码:', err.response.status);
      console.error('响应头:', JSON.stringify(err.response.headers));
      console.error('响应数据:', JSON.stringify(err.response.data));
    }
  }
} 

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


(async () => {
  // 顺序很重要: 先插入基础数据，再插入依赖数据
  console.log('开始数据导入过程...');
  
  // 先插入患者和医生，并保存ID映射
  await insertResource('patients', data.patients);
  await insertResource('doctors', data.doctors);
  
  console.log('--------- ID映射情况 ---------');
  console.log('患者ID映射:', idMappings.patients);
  console.log('医生ID映射:', idMappings.doctors);
  console.log('-------------------------------');

  await insertData("users");

  const [doctors, patients, users] = await Promise.all([
    fetchData(`${API_URL}/doctors`),
    fetchData(`${API_URL}/patients`),
    fetchData(`${API_URL}/users`),
  ])

  console.log("doctors size", doctors.length);
  console.log("patients size", patients.length);
  console.log("users size", users.length);

  await Promise.all(
    doctors.map((doctor) => generateSlotsForDoctor(doctor, data.slots.entries))
  );

  for (let i = 0; i < 20; i ++){
    await verifyUser({
      userId: users[i].id,
      roleId: doctors[i].id,
      role : "DOCTOR"
    });
  }

  for (let i = 20; i < 35; i ++){
    await verifyUser({
      userId: users[i].id,
      roleId: patients[i - 20].id,
      role : "PATIENT"
    });
  }

  await updateUser(users[35].id, {roles: ['ADMIN']});
  
  // 尝试插入一条测试医疗记录
  await insertTestMedicalRecord();
  
  // 然后插入医疗记录，使用映射后的ID
  await insertResource('medical_records', data.medical_records);
  
  // 最后插入依赖医疗记录的数据
  await insertResource('requisitions', data.requisitions);
  await insertResource('payments', data.payments);
  
})();

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




const fs = require('fs');

const API_URL = 'http://localhost:8080/api';
const AUTH_URL = 'http://localhost:8080/auth'
const data = JSON.parse(fs.readFileSync('exampleData.json', 'utf-8'));

(async () => {
  for (const resourceName in data) {
    const resource = data[resourceName];
    const entries = resource.entries;

    const url = resource.apiResource
        ? `${API_URL}/${resourceName}`
        : `${AUTH_URL}/${resource.endpoint}`;
    try {
      for (const e of entries) {
        const res = await fetch (url, {
          method:"POST",
          headers:{
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(e)
        });

        if (!res.ok) {
          throw new Error();
        }
      }
    }catch (err) {
      console.log(`Insertion failed for ${resourceName}`)
    }
  }
})();
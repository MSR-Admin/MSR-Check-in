// Debug script to test the API response
const https = require('https');

const API_URL = 'https://script.google.com/macros/s/AKfycbznvRVVrBk3cUdgub4WhW1oBsKX3ZisjxxPxqMVPB6mwtrqagn4y8I4sMzQAbApV6jPHA/exec';

console.log('=== Testing API Response ===\n');
console.log('API URL:', API_URL);
console.log('');

// Test 1: Fetch visitors
console.log('Test 1: Fetching visitors...');
https.get(API_URL, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Status:', json.status);
      console.log('Total visitors:', json.data.length);
      if (json.data.length > 0) {
        console.log('\nFirst visitor data:');
        console.log(JSON.stringify(json.data[0], null, 2));
        console.log('\nDate field:', json.data[0].date);
        console.log('Time field:', json.data[0].time);
      }
    } catch (err) {
      console.log('Error parsing response:', err.message);
      console.log('Raw response:', data);
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});

// Test 2: Fetch employees
console.log('\nTest 2: Fetching employees...');
https.get(API_URL + '?action=employees', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Status:', json.status);
      console.log('Total employees:', json.data.length);
      if (json.data.length > 0) {
        console.log('\nFirst employee data:');
        console.log(JSON.stringify(json.data[0], null, 2));
        console.log('\nDate field:', json.data[0].date);
        console.log('Time field:', json.data[0].time);
      }
    } catch (err) {
      console.log('Error parsing response:', err.message);
      console.log('Raw response:', data);
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});

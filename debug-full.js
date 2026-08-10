// Full debug script to trace the exact issue
const https = require('https');

const API_URL = 'https://script.google.com/macros/s/AKfycbznvRVVrBk3cUdgub4WhW1oBsKX3ZisjxxPxqMVPB6mwtrqagn4y8I4sMzQAbApV6jPHA/exec';

console.log('=== FULL DEBUG: MSR Check-in API ===\n');
console.log('Testing API endpoint:', API_URL);
console.log('');

// Test 1: Fetch visitors
console.log('TEST 1: Fetching visitors...');
const req1 = https.get(API_URL, (res) => {
  let data = '';
  console.log('Response status:', res.statusCode);
  console.log('Response headers:', JSON.stringify(res.headers, null, 2));
  
  res.on('data', (chunk) => {
    data += chunk;
    console.log('Chunk received:', chunk.substring(0, 100) + '...');
  });
  
  res.on('end', () => {
    console.log('\nFull response:', data);
    
    if (data.trim() === '') {
      console.log('\n❌ ERROR: API returned EMPTY response!');
      console.log('This means the Google Apps Script deployment is broken.');
      console.log('You need to:');
      console.log('1. Check Apps Script editor for errors');
      console.log('2. Check Execution log (View > Logs)');
      console.log('3. Redeploy the web app');
    } else {
      try {
        const json = JSON.parse(data);
        console.log('\n✅ API returned valid JSON');
        console.log('Status:', json.status);
        console.log('Data count:', json.data?.length || 0);
        
        if (json.data && json.data.length > 0) {
          console.log('\nFirst record:');
          console.log(JSON.stringify(json.data[0], null, 2));
          
          // Test date parsing
          const date = json.data[0].date;
          const time = json.data[0].time;
          
          console.log('\n=== Date/Time Analysis ===');
          console.log('Date from API:', date, '(type:', typeof date + ')');
          console.log('Time from API:', time, '(type:', typeof time + ')');
          
          // Test formatting
          function formatDate(raw) {
            if (!raw) return '';
            if (raw instanceof Date) {
              return raw.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
            }
            var str = String(raw).trim();
            if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
              var parts = str.split('/');
              var day = parseInt(parts[0], 10);
              var month = parseInt(parts[1], 10);
              var year = parseInt(parts[2], 10);
              var d = new Date(year, month - 1, day);
              if (isNaN(d.getTime())) return str;
              return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
            }
            var d = new Date(str);
            if (isNaN(d.getTime())) return str;
            return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
          }
          
          function formatTime(raw) {
            if (!raw) return '';
            if (raw instanceof Date) {
              return raw.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
            }
            var trimmed = String(raw).trim();
            if (/^\d{1,2}:\d{2}\s*[AP]M$/i.test(trimmed)) return trimmed;
            var d = new Date(trimmed);
            if (isNaN(d.getTime())) return trimmed;
            return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
          }
          
          console.log('\nAfter formatting:');
          console.log('Date:', formatDate(date), '(Expected: Aug 10, 2026)');
          console.log('Time:', formatTime(time), '(Expected: 12:08 PM)');
          
          const datePass = formatDate(date) === 'Aug 10, 2026';
          const timePass = formatTime(time) === '12:08 PM';
          
          console.log('\n=== Test Results ===');
          console.log('Date formatting:', datePass ? '✅ PASS' : '❌ FAIL');
          console.log('Time formatting:', timePass ? '✅ PASS' : '❌ FAIL');
          
          if (!datePass || !timePass) {
            console.log('\n⚠️  Date/time formatting failed!');
            console.log('The API is returning data, but the format is wrong.');
            console.log('Check the Google Apps Script execution logs for errors.');
          }
        }
      } catch (err) {
        console.log('\n❌ ERROR: Invalid JSON response');
        console.log('Error:', err.message);
        console.log('Raw response:', data);
      }
    }
  });
}).on('error', (err) => {
  console.log('\n❌ ERROR: Failed to connect to API');
  console.log('Error:', err.message);
  console.log('\nPossible causes:');
  console.log('1. API URL is incorrect');
  console.log('2. Web app deployment failed');
  console.log('3. Network connectivity issue');
  console.log('4. Google Apps Script has runtime errors');
});

console.log('\nWaiting for API response...\n');

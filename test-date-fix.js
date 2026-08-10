// Test script to verify the date/time fix
const fs = require('fs');

// Read the admin.js file
const adminJs = fs.readFileSync('/Users/ritchegerona/Development/MSR Check-in/js/admin.js', 'utf8');

// Test 1: Check that formatDate handles Date objects
console.log('=== Test 1: formatDate with Date object ===');
const testDate = new Date(2026, 7, 10, 14, 7, 0); // Aug 10, 2026 2:07 PM
function formatDate(raw) {
  if (!raw) return '';
  if (raw instanceof Date) {
    return raw.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  var str = String(raw).trim();
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) return str;
  var d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}
const result1 = formatDate(testDate);
console.log('Input:', testDate);
console.log('Output:', result1);
console.log('PASS:', result1 === 'Aug 10, 2026' ? 'YES' : 'NO - Expected "Aug 10, 2026"');

// Test 2: Check that formatTime handles Date objects
console.log('\n=== Test 2: formatTime with Date object ===');
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
const result2 = formatTime(testDate);
console.log('Input:', testDate);
console.log('Output:', result2);
console.log('PASS:', result2 === '02:07 PM' ? 'YES' : 'NO - Expected "02:07 PM"');

// Test 3: Check buildTimestamp
console.log('\n=== Test 3: buildTimestamp ===');
function normalizeTime(timeStr) {
  timeStr = String(timeStr).trim();
  var isPM = /pm$/i.test(timeStr);
  var isAM = /am$/i.test(timeStr);
  timeStr = timeStr.replace(/\s*[AP]M\s*$/i, '').trim();
  var parts = timeStr.split(':');
  if (parts.length === 2) {
    var hours = parseInt(parts[0], 10);
    var minutes = parts[1] || '00';
    if (isNaN(hours)) hours = 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':00';
  }
  return '00:00:00';
}

function buildTimestamp(dateVal, timeVal) {
  var dateD;
  if (dateVal instanceof Date) {
    dateD = dateVal;
  } else {
    var str = String(dateVal).trim();
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
      var parts = str.split('/');
      dateD = new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
    } else {
      dateD = new Date(str);
    }
  }
  if (isNaN(dateD.getTime())) return new Date(NaN);
  
  var timeStr = '';
  if (timeVal instanceof Date) {
    timeStr = timeVal.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: false });
  } else {
    timeStr = String(timeVal || '').trim();
    timeStr = normalizeTime(timeStr);
  }
  
  var parts = timeStr.split(':');
  var hours = parseInt(parts[0], 10) || 0;
  var minutes = parseInt(parts[1], 10) || 0;
  
  var result = new Date(dateD);
  result.setHours(hours, minutes, 0, 0);
  return result;
}
const result3 = buildTimestamp(testDate, '2:07 PM');
console.log('Input: Date + "2:07 PM"');
console.log('Output:', result3.toISOString());
console.log('PASS:', result3.toISOString().includes('2026-08-10') ? 'YES' : 'NO');

// Test 4: Check isToday
console.log('\n=== Test 4: isToday ===');
function isToday(raw) {
  if (!raw) return false;
  var d;
  if (raw instanceof Date) {
    d = raw;
  } else {
    var str = String(raw).trim();
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
      var parts = str.split('/');
      d = new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
    } else {
      d = new Date(raw);
    }
  }
  if (isNaN(d.getTime())) return false;
  var now = new Date();
  return d.toDateString() === now.toDateString();
}
const today = new Date();
const result4 = isToday(today);
console.log('Input: Today\'s date');
console.log('Output:', result4);
console.log('PASS:', result4 === true ? 'YES' : 'NO');

// Test 5: Check renderStats logic
console.log('\n=== Test 5: renderStats date comparison ===');
const now = new Date();
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const todayEnd = new Date(todayStart.getTime() + 86400000);
const sampleEntry = buildTimestamp(testDate, '2:07 PM');
console.log('Sample entry timestamp:', sampleEntry.toISOString());
console.log('Today start:', todayStart.toISOString());
console.log('Today end:', todayEnd.toISOString());
const isInRange = sampleEntry >= todayStart && sampleEntry < todayEnd;
console.log('In range:', isInRange);
console.log('PASS:', isInRange === true ? 'YES' : 'NO');

console.log('\n=== All tests completed ===');

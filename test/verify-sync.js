// Verify date/time sync between Code.gs and admin.js
// This tests the exact parsing logic used in both files

// ─── Code.gs formatDate_ (returns dd/MM/yyyy) ───
function gasFormatDate(date) {
  if (!date) return '';
  if (date instanceof Date) {
    // Simulate Utilities.formatDate(date, 'Asia/Manila', 'dd/MM/yyyy')
    var d = new Date(date.getTime() + (8 * 60 * 60 * 1000)); // +8h for Manila
    var day = String(d.getUTCDate()).padStart(2, '0');
    var month = String(d.getUTCMonth() + 1).padStart(2, '0');
    var year = d.getUTCFullYear();
    return day + '/' + month + '/' + year;
  }
  return String(date);
}

// ─── Code.gs formatTime_ (returns hh:mm aa) ───
function gasFormatTime(date) {
  if (!date) return '';
  if (date instanceof Date) {
    var d = new Date(date.getTime() + (8 * 60 * 60 * 1000)); // +8h for Manila
    var hours = d.getUTCHours();
    var minutes = String(d.getUTCMinutes()).padStart(2, '0');
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + ':' + minutes + ' ' + ampm;
  }
  return String(date);
}

// ─── admin.js formatDate (parses dd/MM/yyyy) ───
function adminFormatDate(raw) {
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

// ─── admin.js formatTime (parses hh:mm aa) ───
function adminFormatTime(raw) {
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

// ─── admin.js buildTimestamp ───
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

function adminBuildTimestamp(dateVal, timeVal) {
  var dateD;
  if (dateVal instanceof Date) {
    dateD = dateVal;
  } else {
    var str = String(dateVal).trim();
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
      var parts = str.split('/');
      var day = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10);
      var year = parseInt(parts[2], 10);
      dateD = new Date(year, month - 1, day);
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

// ─── TESTS ───
var passCount = 0;
var failCount = 0;

function check(desc, actual, expected) {
  var pass = actual === expected;
  if (pass) {
    passCount++;
    console.log('✅ PASS: ' + desc + ' → ' + actual);
  } else {
    failCount++;
    console.log('❌ FAIL: ' + desc + ' → got "' + actual + '", expected "' + expected + '"');
  }
}

console.log('=== DATE FORMAT SYNC TEST ===');
// Code.gs sends dd/MM/yyyy, admin.js should parse as Aug 10, 2026
check('10/08/2026 → Aug 10, 2026', adminFormatDate('10/08/2026'), 'Aug 10, 2026');
check('06/08/2026 → Aug 6, 2026', adminFormatDate('06/08/2026'), 'Aug 6, 2026');
check('07/08/2026 → Aug 7, 2026', adminFormatDate('07/08/2026'), 'Aug 7, 2026');
check('09/08/2026 → Aug 9, 2026', adminFormatDate('09/08/2026'), 'Aug 9, 2026');

console.log('\n=== TIME FORMAT SYNC TEST ===');
check('9:36 AM → 9:36 AM', adminFormatTime('9:36 AM'), '9:36 AM');
check('1:53 PM → 1:53 PM', adminFormatTime('1:53 PM'), '1:53 PM');
check('12:08 PM → 12:08 PM', adminFormatTime('12:08 PM'), '12:08 PM');
check('10:39 AM → 10:39 AM', adminFormatTime('10:39 AM'), '10:39 AM');

console.log('\n=== TIMESTAMP BUILD TEST ===');
var ts1 = adminBuildTimestamp('10/08/2026', '2:07 PM');
check('10/08/2026 + 2:07 PM → Aug 10', ts1.getFullYear() + '-' + (ts1.getMonth() + 1) + '-' + ts1.getDate(), '2026-8-10');
check('10/08/2026 + 2:07 PM → 14:07', ts1.getHours() + ':' + ts1.getMinutes(), '14:7');

var ts2 = adminBuildTimestamp('06/08/2026', '9:36 AM');
check('06/08/2026 + 9:36 AM → Aug 6', ts2.getFullYear() + '-' + (ts2.getMonth() + 1) + '-' + ts2.getDate(), '2026-8-6');
check('06/08/2026 + 9:36 AM → 9:36', ts2.getHours() + ':' + ts2.getMinutes(), '9:36');

var ts3 = adminBuildTimestamp('07/08/2026', '1:53 PM');
check('07/08/2026 + 1:53 PM → Aug 7', ts3.getFullYear() + '-' + (ts3.getMonth() + 1) + '-' + ts3.getDate(), '2026-8-7');
check('07/08/2026 + 1:53 PM → 13:53', ts3.getHours() + ':' + ts3.getMinutes(), '13:53');

console.log('\n=== GAS FORMAT TEST (Date object → string) ===');
var now = new Date(2026, 7, 10, 14, 7, 0); // Aug 10, 2026 2:07 PM local
var gasDate = gasFormatDate(now);
var gasTime = gasFormatTime(now);
console.log('GAS date output:', gasDate);
console.log('GAS time output:', gasTime);
// The GAS output should be parseable by admin.js
check('GAS date parseable by admin', adminFormatDate(gasDate), 'Aug 10, 2026');

console.log('\n=== SUMMARY ===');
console.log('Passed: ' + passCount + ', Failed: ' + failCount);
if (failCount > 0) {
  console.log('❌ SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASSED - Date/time sync is correct!');
}
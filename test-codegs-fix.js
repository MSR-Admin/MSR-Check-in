// Test script to verify the Code.gs date handling fix
// This simulates what Google Apps Script's getValues() returns

console.log('=== Testing Code.gs Date handling ===\n');

// Simulate what Google Apps Script returns
// getValues() returns Date objects for date columns, not strings
const mockSheetData = [
  ['ID Number', 'Full Name', 'Contact Number', 'Contact Person', 'Purpose', 'Status', 'Date', 'Time', 'Checkout Time'],
  ['VIS-20260810-2050', 'Ron Adan', '0998 92341 98', 'Majeed Ali Alshawi', 'Meeting', 'checked-in', new Date(2026, 7, 10, 11, 34, 0), new Date(2026, 7, 10, 11, 34, 0), ''],
  ['VIS-20260810-3685', 'test', '0998 92341 98', 'Mia Bullungan', 'Interview', 'checked-in', new Date(2026, 7, 10, 12, 8, 0), new Date(2026, 7, 10, 12, 8, 0), ''],
  ['VIS-20260809-5384', 'ritche gerona', '0998 92341 98', 'Ron Adan', 'Meeting', 'checked-out', new Date(2026, 7, 9, 15, 43, 0), new Date(2026, 7, 9, 15, 43, 0), new Date(2026, 7, 10, 8, 0, 0)]
];

// Simulate getAllRows() function
function getAllRows(data) {
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    // Convert Date objects to formatted strings for consistent handling
    const dateVal = data[i][6];
    const timeVal = data[i][7];
    const dateStr = dateVal instanceof Date 
      ? dateVal.toLocaleDateString('en-PH', { month: '2-digit', day: '2-digit', year: 'numeric' })
      : (dateVal || '');
    const timeStr = timeVal instanceof Date
      ? dateVal.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true })
      : (timeVal || '');
    
    rows.push({
      id: data[i][0],
      idNumber: data[i][1],
      fullName: data[i][2],
      contactNumber: data[i][3],
      contactPerson: data[i][4],
      purpose: data[i][5],
      status: data[i][6],
      date: dateStr,
      time: timeStr,
      checkoutTime: data[i][8] || null
    });
  }
  return rows;
}

const result = getAllRows(mockSheetData);
console.log('Converted data:');
console.log(JSON.stringify(result, null, 2));

// Verify the conversion worked
console.log('\n=== Verification ===');
console.log('Row 1 date:', result[0].date, '(should be "08/10/2026")');
console.log('Row 1 time:', result[0].time, '(should be "11:34 AM")');
console.log('Row 2 date:', result[1].date, '(should be "08/10/2026")');
console.log('Row 2 time:', result[1].time, '(should be "12:08 PM")');
console.log('Row 3 date:', result[2].date, '(should be "08/09/2026")');
console.log('Row 3 time:', result[2].time, '(should be "03:43 PM")');

const pass1 = result[0].date === '08/10/2026';
const pass2 = result[0].time === '11:34 AM';
const pass3 = result[1].date === '08/10/2026';
const pass4 = result[1].time === '12:08 PM';
const pass5 = result[2].date === '08/09/2026';
const pass6 = result[2].time === '03:43 PM';

console.log('\n=== Test Results ===');
console.log('Test 1 (date format):', pass1 ? 'PASS' : 'FAIL');
console.log('Test 2 (time format):', pass2 ? 'PASS' : 'FAIL');
console.log('Test 3 (date format):', pass3 ? 'PASS' : 'FAIL');
console.log('Test 4 (time format):', pass4 ? 'PASS' : 'FAIL');
console.log('Test 5 (date format):', pass5 ? 'PASS' : 'FAIL');
console.log('Test 6 (time format):', pass6 ? 'PASS' : 'FAIL');

const allPass = pass1 && pass2 && pass3 && pass4 && pass5 && pass6;
console.log('\nOverall:', allPass ? 'ALL TESTS PASSED ✓' : 'SOME TESTS FAILED ✗');

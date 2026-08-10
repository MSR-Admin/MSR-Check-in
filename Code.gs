/* ============================================
   VISITORS LOGIN SYSTEM - Google Apps Script
   Backend API using Google Sheets as database
   ============================================ */

// ─── CONFIGURATION ────────────────────
const SHEET_NAME = 'Visitors';
const EMPLOYEE_SHEET_NAME = 'Employees';
const ADMIN_PIN = '1234';
const HEADERS = ['ID', 'ID Number', 'Full Name', 'Contact Number', 'Contact Person', 'Purpose', 'Status', 'Date', 'Time', 'Checkout Time'];
const EMPLOYEE_HEADERS = ['ID', 'Employee ID', 'Full Name', 'Department', 'Type', 'Status', 'Date', 'Time'];

// ─── SHEET HELPERS ────────────────────
function getSheet() {
  return ensureSheet(SHEET_NAME, HEADERS);
}

function getEmployeeSheet() {
  return ensureSheet(EMPLOYEE_SHEET_NAME, EMPLOYEE_HEADERS);
}

function ensureSheet(name, headerRow) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headerRow);
    sheet.setFrozenRows(1);
    const headerRange = sheet.getRange(1, 1, 1, headerRow.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a73e8');
    headerRange.setFontColor('#ffffff');
  }
  return sheet;
}

// ─── GET ALL ROWS ─────────────────────
function getAllRows() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    // DEBUG: Log the raw data types
    Logger.log('Row ' + i + ':');
    Logger.log('  Date (index 7): ' + data[i][7] + ' (type: ' + typeof data[i][7] + ')');
    Logger.log('  Time (index 8): ' + data[i][8] + ' (type: ' + typeof data[i][8] + ')');
    
    // Convert Date objects to strings
    let dateStr = '';
    let timeStr = '';
    
    if (data[i][7] instanceof Date) {
      // Format date as dd/MM/yyyy
      dateStr = Utilities.formatDate(data[i][7], 'Asia/Manila', 'dd/MM/yyyy');
    } else if (data[i][7] && String(data[i][7]).trim() !== '') {
      // Already a string, use as-is
      dateStr = String(data[i][7]).trim();
    }
    
    if (data[i][8] instanceof Date) {
      // Format time as hh:mm aa
      timeStr = Utilities.formatDate(data[i][8], 'Asia/Manila', 'hh:mm aa');
    } else if (data[i][8] && String(data[i][8]).trim() !== '') {
      // Already a string, use as-is
      timeStr = String(data[i][8]).trim();
    }
    
    // DEBUG: Log the formatted strings
    Logger.log('  Formatted Date: ' + dateStr);
    Logger.log('  Formatted Time: ' + timeStr);
    
    rows.push({
      id: String(data[i][0] || ''),
      idNumber: String(data[i][1] || ''),
      fullName: String(data[i][2] || ''),
      contactNumber: String(data[i][3] || ''),
      contactPerson: String(data[i][4] || ''),
      purpose: String(data[i][5] || ''),
      status: String(data[i][6] || ''),
      date: dateStr,
      time: timeStr,
      checkoutTime: String(data[i][9] || ''),
      timestamp: dateStr && timeStr ? dateStr + ' ' + timeStr : null
    });
  }
  return rows;
}

function getAllEmployeeRows() {
  const sheet = getEmployeeSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    // Convert Date objects to strings
    let dateStr = '';
    let timeStr = '';
    
    if (data[i][6] instanceof Date) {
      dateStr = Utilities.formatDate(data[i][6], 'Asia/Manila', 'dd/MM/yyyy');
    } else if (data[i][6] && String(data[i][6]).trim() !== '') {
      dateStr = String(data[i][6]).trim();
    }
    
    if (data[i][7] instanceof Date) {
      timeStr = Utilities.formatDate(data[i][7], 'Asia/Manila', 'hh:mm aa');
    } else if (data[i][7] && String(data[i][7]).trim() !== '') {
      timeStr = String(data[i][7]).trim();
    }
    
    rows.push({
      id: String(data[i][0] || ''),
      employeeId: String(data[i][1] || ''),
      fullName: String(data[i][2] || ''),
      department: String(data[i][3] || ''),
      type: String(data[i][4] || ''),
      status: String(data[i][5] || ''),
      date: dateStr,
      time: timeStr,
      timestamp: dateStr && timeStr ? dateStr + ' ' + timeStr : null
    });
  }
  return rows;
}

// ─── UTILITY FUNCTIONS ────────────────
function getResponse(data) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: data
  })).setMimeType(ContentService.MimeType.JSON);
}

function getError(message, code) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: message
  })).setStatus(code || 500).setMimeType(ContentService.MimeType.JSON);
}

function generateId() {
  return 'ms' + Utilities.getUuid().substring(0, 8);
}

function generateIdNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `VIS-${year}${month}${day}-${random}`;
}

function generateEmployeeId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `EMP-${year}${month}${day}-${random}`;
}

// ─── GET: Endpoint Router ─────────────
function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = (params.action || '').toLowerCase().trim();
    
    // Clean legacy rows if requested
    if (action === 'cleanLegacy') {
      cleanLegacyRows();
      return getResponse({ cleaned: true });
    }
    
    // Get search and filter parameters
    const search = (params.search || '').toLowerCase().trim();
    const filter = (params.filter || '').toLowerCase().trim();
    
    // ── Employees endpoint ─────────────────
    if (action === 'employees') {
      let employees = getAllEmployeeRows();
      
      // Apply search
      if (search) {
        employees = employees.filter(emp =>
          (emp.fullName || '').toLowerCase().includes(search) ||
          (emp.department || '').toLowerCase().includes(search) ||
          (emp.employeeId || '').toLowerCase().includes(search)
        );
      }
      
      // Apply filter
      if (filter === 'today') {
        const now = new Date();
        const todayStr = Utilities.formatDate(now, 'Asia/Manila', 'dd/MM/yyyy');
        employees = employees.filter(emp => emp.date === todayStr);
      }
      
      return getResponse(employees);
    }
    
    // ── Visitors endpoint (default) ────────
    let visitors = getAllRows();
    
    // Apply filter
    if (filter === 'checked-in') {
      visitors = visitors.filter(v => v.status === 'checked-in');
    } else if (filter === 'checked-out') {
      visitors = visitors.filter(v => v.status === 'checked-out');
    }
    
    // Apply search
    if (search) {
      visitors = visitors.filter(v =>
        (v.fullName || '').toLowerCase().includes(search) ||
        (v.contactNumber || '').toLowerCase().includes(search) ||
        (v.contactPerson || '').toLowerCase().includes(search) ||
        (v.purpose || '').toLowerCase().includes(search) ||
        (v.idNumber || '').toLowerCase().includes(search)
      );
    }
    
    return getResponse(visitors);
    
  } catch (err) {
    Logger.log('doGet error: ' + err.toString());
    return getError(err.toString(), 500);
  }
}

// ─── POST: Endpoint Router ─────────────
function doPost(e) {
  try {
    const params = e.parameter || {};
    const action = (params.action || '').toLowerCase().trim();
    
    // ── Admin login ─────────────────────────
    if (action === 'login') {
      const pin = (params.pin || '').trim();
      if (pin === ADMIN_PIN) {
        return getResponse({ authenticated: true });
      }
      return getError('Invalid PIN', 401);
    }
    
    // ── Check-out visitor ───────────────────
    if (action === 'checkout') {
      const idNumber = params.idNumber;
      if (!idNumber) return getError('Missing idNumber', 400);
      
      const sheet = getSheet();
      const data = sheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][1]) === String(idNumber)) {
          const now = new Date();
          const checkoutTime = Utilities.formatDate(now, 'Asia/Manila', 'hh:mm aa');
          sheet.getRange(i + 1, 10).setValue(checkoutTime);
          sheet.getRange(i + 1, 7).setValue('checked-out');
          return getResponse({ success: true, checkoutTime: checkoutTime });
        }
      }
      return getError('Visitor not found', 404);
    }
    
    // ── Delete visitor ──────────────────────
    if (action === 'deleteVisitor') {
      const idNumber = params.idNumber;
      if (!idNumber) return getError('Missing idNumber', 400);
      
      const sheet = getSheet();
      const data = sheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][1]) === String(idNumber)) {
          sheet.deleteRow(i + 1);
          return getResponse({ success: true });
        }
      }
      return getError('Visitor not found', 404);
    }
    
    // ── Delete employee ─────────────────────
    if (action === 'deleteEmployee') {
      const employeeId = params.employeeId;
      if (!employeeId) return getError('Missing employeeId', 400);
      
      const sheet = getEmployeeSheet();
      const data = sheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][1]) === String(employeeId)) {
          sheet.deleteRow(i + 1);
          return getResponse({ success: true });
        }
      }
      return getError('Employee not found', 404);
    }
    
    // ── Add visitor (manual override) ───────
    if (action === 'addVisitor') {
      const idNumber = params.idNumber;
      const fullName = params.fullName;
      const contactNumber = params.contactNumber;
      const contactPerson = params.contactPerson;
      const purpose = params.purpose;
      
      if (!idNumber || !fullName) {
        return getError('Missing required fields', 400);
      }
      
      const sheet = getSheet();
      const now = new Date();
      const dateStr = Utilities.formatDate(now, 'Asia/Manila', 'dd/MM/yyyy');
      const timeStr = Utilities.formatDate(now, 'Asia/Manila', 'hh:mm aa');
      
      sheet.appendRow([
        generateId(),
        idNumber,
        fullName,
        contactNumber || '',
        contactPerson || '',
        purpose || '',
        'checked-in',
        dateStr,
        timeStr,
        ''
      ]);
      
      return getResponse({ success: true });
    }
    
    // ── Add employee (manual override) ──────
    if (action === 'addEmployee') {
      const employeeId = params.employeeId;
      const fullName = params.fullName;
      const department = params.department;
      
      if (!employeeId || !fullName) {
        return getError('Missing required fields', 400);
      }
      
      const sheet = getEmployeeSheet();
      const now = new Date();
      const dateStr = Utilities.formatDate(now, 'Asia/Manila', 'dd/MM/yyyy');
      const timeStr = Utilities.formatDate(now, 'Asia/Manila', 'hh:mm aa');
      
      sheet.appendRow([
        generateId(),
        employeeId,
        fullName,
        department || '',
        'Employee',
        'Time-in',
        dateStr,
        timeStr
      ]);
      
      return getResponse({ success: true });
    }
    
    return getError('Unknown action: ' + action, 400);
    
  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return getError(err.toString(), 500);
  }
}

// ─── CLEANUP: Remove legacy rows ──────────
function cleanLegacyRows() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  let deleted = 0;
  
  for (let i = data.length - 1; i >= 1; i--) {
    const id = String(data[i][0] || '');
    // Delete rows that don't have the new format ID (ms...)
    if (!id.startsWith('ms')) {
      sheet.deleteRow(i + 1);
      deleted++;
    }
  }
  
  return deleted;
}

// ─── TEST: Debug function ────────────────
function testDateFormatting() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  Logger.log('=== Testing Date Formatting ===');
  Logger.log('Total rows: ' + (data.length - 1));
  
  for (let i = 1; i < Math.min(data.length, 6); i++) {
    const dateVal = data[i][7];
    const timeVal = data[i][8];
    
    Logger.log('\nRow ' + i + ':');
    Logger.log('  Raw Date: ' + dateVal + ' (type: ' + typeof dateVal + ')');
    Logger.log('  Raw Time: ' + timeVal + ' (type: ' + typeof timeVal + ')');
    
    if (dateVal instanceof Date) {
      const dateStr = Utilities.formatDate(dateVal, 'Asia/Manila', 'dd/MM/yyyy');
      Logger.log('  Formatted Date: ' + dateStr);
    } else {
      Logger.log('  Date is already a string: ' + dateVal);
    }
    
    if (timeVal instanceof Date) {
      const timeStr = Utilities.formatDate(timeVal, 'Asia/Manila', 'hh:mm aa');
      Logger.log('  Formatted Time: ' + timeStr);
    } else {
      Logger.log('  Time is already a string: ' + timeVal);
    }
  }
  
  return 'Check Logger for results';
}

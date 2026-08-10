/* ============================================
   VISITORS LOGIN SYSTEM - Google Apps Script
   Backend API using Google Sheets as database
   ============================================ */

// ─── CONFIGURATION ────────────────────────────
const SHEET_NAME = 'Visitors';
const EMPLOYEE_SHEET_NAME = 'Employees';
const ADMIN_PIN = '1234';
const HEADERS = ['ID Number', 'Full Name', 'Contact Number', 'Contact Person', 'Purpose', 'Status', 'Date', 'Time', 'Checkout Time'];
const EMPLOYEE_HEADERS = ['Employee ID', 'Full Name', 'Department', 'Type', 'Status', 'Date', 'Time'];

// ─── SHEET HELPERS ────────────────────────────
function getSheet() {
  return ensureSheet(SHEET_NAME, HEADERS);
}

function getEmployeeSheet() {
  return ensureSheet(EMPLOYEE_SHEET_NAME, EMPLOYEE_HEADERS);
}

// Creates (if missing) and styles a sheet tab with the given headers.
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

function getAllRows() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Only header row
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    // Convert Date objects to formatted strings for consistent handling
    const dateVal = data[i][7];
    const timeVal = data[i][8];
    const dateStr = dateVal instanceof Date 
      ? Utilities.formatDate(dateVal, 'Asia/Manila', 'dd/MM/yyyy')
      : (dateVal || '');
    const timeStr = timeVal instanceof Date
      ? Utilities.formatDate(timeVal, 'Asia/Manila', 'hh:mm aa')
      : (timeVal || '');
    
    rows.push({
      id: data[i][0], // placeholder generic ID column (unused)
      idNumber: data[i][1],
      fullName: data[i][2],
      contactNumber: data[i][3],
      contactPerson: data[i][4],
      purpose: data[i][5],
      status: data[i][6],
      date: dateStr,
      time: timeStr,
      checkoutTime: data[i][8] || null,
      timestamp: (dateVal && timeVal) ? new Date(dateStr + ' ' + timeStr) : null
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
    // Convert Date objects to formatted strings for consistent handling
    const dateVal = data[i][6];
    const timeVal = data[i][7];
    const dateStr = dateVal instanceof Date
      ? Utilities.formatDate(dateVal, 'Asia/Manila', 'dd/MM/yyyy')
      : (dateVal || '');
    const timeStr = timeVal instanceof Date
      ? Utilities.formatDate(timeVal, 'Asia/Manila', 'hh:mm aa')
      : (timeVal || '');

    rows.push({
      id: data[i][0], // placeholder generic ID column (unused)
      employeeId: data[i][1],
      fullName: data[i][2],
      department: data[i][3],
      type: data[i][4],
      status: data[i][5],
      date: dateStr,
      time: timeStr,
      timestamp: (dateVal && timeVal) ? new Date(dateStr + ' ' + timeStr) : null
    });
  }
  return rows;
}

function findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    // Match either generic ID (col 0) or primary identifier (col 1)
    if (data[i][0] === id || data[i][1] === id) return i + 1; // 1-indexed for sheet
  }
  return -1;
}

function cleanLegacyRows() {
  // Clean Visitor sheet
  const visitorSheet = getSheet();
  const visitorData = visitorSheet.getDataRange().getValues();
  for (let i = visitorData.length; i > 1; i--) {
    const genericId = visitorData[i - 1][0];
    if (genericId && genericId.toString().trim() !== '') {
      visitorSheet.deleteRow(i);
    }
  }
  // Clean Employee sheet
  const employeeSheet = getEmployeeSheet();
  const employeeData = employeeSheet.getDataRange().getValues();
  for (let i = employeeData.length; i > 1; i--) {
    const genericId = employeeData[i - 1][0];
    if (genericId && genericId.toString().trim() !== '') {
      employeeSheet.deleteRow(i);
    }
  }
}

// ─── HELPERS ──────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function generateIdNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randPart = Math.floor(1000 + Math.random() * 9000);
  return `VIS-${datePart}-${randPart}`;
}

function generateEmpIdNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randPart = Math.floor(1000 + Math.random() * 9000);
  return `EMP-${datePart}-${randPart}`;
}

function getResponse(data, status = 'success') {
  return ContentService
    .createTextOutput(JSON.stringify({ status, data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getError(message, code = 400) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'error', message, code }))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseBody(e) {
  try {
    return JSON.parse(e.postData.contents);
  } catch {
    return {};
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ─── CORS HANDLER ─────────────────────────────
function doOptions(e) {
  return getResponse({}, 'ok');
}

// ─── GET: /api/visitors ──────────────────────
// Query params:
//   ?search=keyword  - search across all text fields
//   ?filter=checked-in | checked-out  - filter by status
function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = (params.action || '').toLowerCase().trim();
    if (action === 'cleanLegacy') {
      cleanLegacyRows();
      return getResponse({ cleaned: true });
    }
  } catch (e) { /* ignore if not called with action */ }

  try {
    const params = e.parameter || {};
    const action = (params.action || '').toLowerCase().trim();
    const search = (params.search || '').toLowerCase().trim();
    const filter = (params.filter || '').toLowerCase().trim();

    // ── Employees endpoint ─────────────────
    if (action === 'employees') {
      let employees = getAllEmployeeRows();
      if (search) {
        employees = employees.filter(emp =>
          (emp.fullName || '').toLowerCase().includes(search) ||
          (emp.department || '').toLowerCase().includes(search) ||
          (emp.employeeId || '').toLowerCase().includes(search)
        );
      }
      // 'today' filter is also applied client-side, but support it here too.
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
    return getError(err.toString(), 500);
  }
}

// ─── POST: Endpoint Router ────────────────────
function doPost(e) {
  try {
    const body = parseBody(e);
    const action = body.action || '';

    switch (action) {

      // ── Create Check-in ────────────────────
      case 'checkin': {
        const sheet = getSheet();
        const { fullName, contactNumber, contactPerson, purpose } = body;

        if (!fullName || !contactNumber || !contactPerson || !purpose) {
          return getError('All fields are required.');
        }

        const id = generateId();
        const idNumber = generateIdNumber();
        const now = new Date();
        const dateStr = Utilities.formatDate(now, 'Asia/Manila', 'dd/MM/yyyy');
        const timeStr = Utilities.formatDate(now, 'Asia/Manila', 'hh:mm aa');

        sheet.appendRow([
          '', // placeholder for generic ID column
          idNumber,
          fullName.trim(),
          contactNumber.trim(),
          contactPerson,
          purpose,
          'checked-in',
          dateStr,
          timeStr,
          ''
        ]);

        return getResponse({
          id: idNumber,
          idNumber,
          fullName: fullName.trim(),
          contactNumber: contactNumber.trim(),
          contactPerson,
          purpose,
          status: 'checked-in',
          date: dateStr,
          time: timeStr
        });
      }

      // ── Check Out ───────────────────────────
      case 'checkout': {
        const { id: checkoutId } = body;
        if (!checkoutId) return getError('Visitor ID is required.');

        const sheet = getSheet();
        const row = findRowById(sheet, checkoutId);
        if (row === -1) return getError('Visitor not found.', 404);

        // Update status (col 7) and checkout time (col 10)
        const checkoutNow = new Date();
        const checkoutTimeStr = Utilities.formatDate(checkoutNow, 'Asia/Manila', 'hh:mm aa');
        const checkoutDateStr = Utilities.formatDate(checkoutNow, 'Asia/Manila', 'dd/MM/yyyy');
sheet.getRange(row, 7).setValue('checked-out'); // status column restored
         sheet.getRange(row, 10).setValue(checkoutDateStr + ' ' + checkoutTimeStr);

        return getResponse({ id: checkoutId, status: 'checked-out' });
      }

      // ── Delete ──────────────────────────────
      case 'delete': {
        const { id: deleteId } = body;
        if (!deleteId) return getError('Visitor ID is required.');

        const sheet = getSheet();
        const row = findRowById(sheet, deleteId);
        if (row === -1) return getError('Visitor not found.', 404);

        sheet.deleteRow(row);
        return getResponse({ id: deleteId, deleted: true });
      }

      // ── Employee Time-in ────────────────────
      case 'empCheckin': {
        const { fullName, department } = body;

        if (!fullName || !department) {
          return getError('Employee full name and department are required.');
        }

        const sheet = getEmployeeSheet();
        const id = generateId();
        const employeeId = generateEmpIdNumber();
        const now = new Date();
        const dateStr = Utilities.formatDate(now, 'Asia/Manila', 'dd/MM/yyyy');
        const timeStr = Utilities.formatDate(now, 'Asia/Manila', 'hh:mm aa');

        sheet.appendRow([
          '', // placeholder for generic ID column
          employeeId,
          fullName.trim(),
          department,
          'Employee',
          'Time-in',
          dateStr,
          timeStr
        ]);

        return getResponse({
          id: employeeId,
          employeeId,
          fullName: fullName.trim(),
          department,
          type: 'Employee',
          status: 'Time-in',
          date: dateStr,
          time: timeStr
        });
      }

      // ── Delete Employee Log ────────────────
      case 'empDelete': {
        const { id: deleteId } = body;
        if (!deleteId) return getError('Employee log ID is required.');

        const sheet = getEmployeeSheet();
        const row = findRowById(sheet, deleteId);
        if (row === -1) return getError('Employee log not found.', 404);

        sheet.deleteRow(row);
        return getResponse({ id: deleteId, deleted: true });
      }

      // ── Auth ────────────────────────────────
      case 'auth': {
        const { pin } = body;
        if (pin === ADMIN_PIN) {
          return getResponse({ authenticated: true, token: 'admin-authenticated' });
        }
        return getResponse({ authenticated: false });
      }

      default:
        return getError('Unknown action: "' + action + '". Valid actions: checkin, checkout, delete, empCheckin, empDelete, auth');
    }
  } catch (err) {
    return getError(err.toString(), 500);
  }
}
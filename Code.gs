/* ============================================
   VISITORS LOGIN SYSTEM - SIMPLE WORKING VERSION
   ============================================ */

function doGet(e) {
  try {
    // Test if we can access the spreadsheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Visitors');
    
    if (!sheet) {
      return createResponse({error: 'Visitors sheet not found'});
    }
    
    // Get all data
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse([]);
    }
    
    // Convert to array of objects
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      
      // Format date and time
      var dateStr = '';
      var timeStr = '';
      
      if (row[7] instanceof Date) {
        dateStr = Utilities.formatDate(row[7], 'Asia/Manila', 'dd/MM/yyyy');
      } else if (row[7]) {
        dateStr = String(row[7]);
      }
      
      if (row[8] instanceof Date) {
        timeStr = Utilities.formatDate(row[8], 'Asia/Manila', 'hh:mm aa');
      } else if (row[8]) {
        timeStr = String(row[8]);
      }
      
      rows.push({
        id: row[0] ? String(row[0]) : '',
        idNumber: row[1] ? String(row[1]) : '',
        fullName: row[2] ? String(row[2]) : '',
        contactNumber: row[3] ? String(row[3]) : '',
        contactPerson: row[4] ? String(row[4]) : '',
        purpose: row[5] ? String(row[5]) : '',
        status: row[6] ? String(row[6]) : '',
        date: dateStr,
        time: timeStr,
        checkoutTime: row[9] ? String(row[9]) : ''
      });
    }
    
    return createResponse(rows);
    
  } catch (err) {
    return createResponse({error: err.toString()});
  }
}

function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

# Deploy Guide: Fix Date/Time Sync Issue

## Current Status
- ✅ GitHub repo updated with fixes
- ✅ Code.gs fixed to convert Date objects to strings
- ✅ admin.js fixed to parse dd/MM/yyyy format correctly
- ❌ **Google Apps Script NOT yet deployed with new code**

## Why It's Not Working
The browser is still calling the **old deployed version** of Code.gs. You need to:
1. Copy the new Code.gs to Google Apps Script
2. Deploy it as a new Web App
3. Update the API URL in the JavaScript files

## Step-by-Step Deployment

### Step 1: Open Google Apps Script
1. Open your Google Sheet (the one used by MSR Check-in)
2. Go to **Extensions > Apps Script**
3. A new tab will open with the Apps Script editor

### Step 2: Replace Code.gs
1. **Select all** code in the editor (Ctrl+A or Cmd+A)
2. **Delete** it
3. **Copy** the entire contents of `/Users/ritchegerona/Development/MSR Check-in/Code.gs`
4. **Paste** it into the Apps Script editor
5. **File > Save** (Ctrl+S or Cmd+S)

### Step 3: Deploy as Web App
1. Click the **"Deploy"** button (top right)
2. Select **"New deployment"**
3. Click the gear icon ⚙️ next to "Select type"
4. Choose **"Web app"**
5. Fill in:
   - **Description**: "Fix date/time sync - v2"
   - **Execute as**: "Me" (your email)
   - **Who has access**: "Anyone"
6. Click **"Deploy"**
7. **Authorize** the script if prompted (click "Review permissions" > Choose account > Advanced > Go to MSR Check-in (unsafe) > Allow)
8. **Copy the new Web App URL** (it will look like: `https://script.google.com/macros/s/AKfycbx.../exec`)

### Step 4: Update API URL in JavaScript
1. Open `/Users/ritchegerona/Development/MSR Check-in/js/admin.js`
2. Find line 11:
   ```javascript
   const API_URL = 'https://script.google.com/macros/s/AKfycbwcG57xAYjgoiA0YEwowIElQZv9Obr4hqr5fnH1cnJmlxHrHejbfYl43YJ8cnHUcC-JHw/exec';
   ```
3. **Replace** with your new Web App URL
4. **Save** the file
5. Do the **same** for `/Users/ritchegerona/Development/MSR Check-in/js/app.js` (line 11)

### Step 5: Commit and Push to GitHub
```bash
cd "/Users/ritchegerona/Development/MSR Check-in"
git add js/admin.js js/app.js
git commit -m "Update API URL to new deployment"
git push origin main
```

### Step 6: Hard Refresh Browser
1. Open your admin page
2. Press **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
3. This forces the browser to load the new `admin.js` with the updated API URL

### Step 7: Test
1. Log in to the admin panel (password: `MSRAdmin2026`)
2. Check the Visitor and Employee logs
3. Dates should now show correctly (e.g., "Aug 10, 2026" not "Oct 8, 2026")
4. Times should show correctly (e.g., "11:34 AM" not "—")
5. The data should sync from Google Sheets

## Verification
Open `/Users/ritchegerona/Development/MSR Check-in/test-api.html` in your browser to test if the API is returning data correctly.

## Troubleshooting

### If API returns 404 or 500 error:
- Make sure you deployed as "Web app" not "Extension"
- Check that "Who has access" is set to "Anyone"
- Try redeploying with a new description

### If data shows but dates are still wrong:
- Make sure you hard refreshed the browser (Cmd+Shift+R)
- Clear browser cache
- Check that the new Code.gs is deployed (not the old one)

### If no data shows:
- Check the browser console (F12) for errors
- Make sure the API URL is correct
- Verify the Google Sheet has data in it

## What Changed in This Fix

### Code.gs
- Added Date object to string conversion in `getAllRows()` and `getAllEmployeeRows()`
- Uses `Utilities.formatDate()` to format dates as `dd/MM/yyyy` and times as `hh:mm aa`
- This ensures the browser receives strings, not Date objects

### admin.js
- `formatDate()` now explicitly parses `dd/MM/yyyy` format
- `formatTime()` handles both Date objects and string times
- `buildTimestamp()` uses correct date parsing for comparisons
- Fixed checkout/delete button lookups to use `idNumber`/`employeeId`

## Notes
- The fix handles both old data (Date objects) and new data (strings)
- Philippine date format (dd/MM/yyyy) is now explicitly parsed
- No more timezone confusion
- Cache-busting version updated to v=7

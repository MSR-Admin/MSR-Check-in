# 🔧 STEP-BY-STEP FIX FOR "Dec 30, 1899" ERROR

## 🎯 The Problem
The Google Apps Script is **returning a 302 redirect** (empty response) instead of JSON data. This means there's a **runtime error** in your deployed Code.gs.

## ✅ The Solution (Follow These Steps Exactly)

### Step 1: Open Google Apps Script Editor
1. Open your Google Sheet
2. Go to **Extensions > Apps Script**

### Step 2: Check for Errors
1. Look at the **bottom of the editor** for any red error messages
2. If you see errors, **read them carefully**
3. Common errors:
   - "SyntaxError: Unexpected token"
   - "TypeError: Cannot read property 'getDataRange' of null"
   - "Permissions denied"

### Step 3: Replace Code.gs with Simple Version
1. **Select ALL code** in the editor (Ctrl+A or Cmd+A)
2. **Delete it** (Press Delete or Backspace)
3. **Copy the entire contents** of this file:
   ```
   /Users/ritchegerona/Development/MSR Check-in/Code.gs
   ```
4. **Paste** into the editor
5. **File > Save** (Ctrl+S or Cmd+S)

### Step 4: Test the Script (CRITICAL)
1. In the Apps Script editor, **select `doGet`** from the dropdown at the top
2. Click the **Run** button (▶️) or press **F9**
3. **Check the Execution log** at the bottom (or go to **View > Logs** or press **Ctrl+Enter**)
4. You should see:
   - ✅ If successful: No errors, and you'll see the output
   - ❌ If error: You'll see an error message

### Step 5: Check for Sheet Access
If you see an error like "Visitors sheet not found":
1. Go back to your Google Sheet
2. Check if there's a tab named **"Visitors"** (case-sensitive)
3. If not, **create a new sheet** and name it exactly "Visitors"
4. Add the headers in row 1:
   ```
   ID | ID Number | Full Name | Contact Number | Contact Person | Purpose | Status | Date | Time | Checkout Time
   ```

### Step 6: Redeploy the Web App
1. Click **"Deploy" > "Manage deployments"**
2. Click the **pencil icon** ✏️ next to your current deployment
3. Click **"Review"**
4. Click **"Deploy"**
5. **Copy the Web App URL** (it should be the same)

### Step 7: Test the API Directly
1. **Open a new browser tab**
2. **Paste this URL**:
   ```
   https://script.google.com/macros/s/AKfycbznvRVVrBk3cUdgub4WhW1oBsKX3ZisjxxPxqMVPB6mwtrqagn4y8I4sMzQAbApV6jPHA/exec
   ```
3. **Press Enter**
4. You should see **JSON data** with your visitors
5. If you see an error message, **take a screenshot** and share it

### Step 8: Hard Refresh Admin Panel
1. Go back to your admin panel
2. **Press Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
3. **Log in** with password: `MSRAdmin2026`
4. **Check the dates** - they should now show correctly

## 🔍 Debugging Checklist

### If API Still Returns Empty:
- [ ] Check Execution log for errors
- [ ] Verify "Visitors" sheet exists
- [ ] Verify sheet has data (not just headers)
- [ ] Check permissions (Extensions > Authorized projects)
- [ ] Try creating a NEW deployment (not editing existing one)

### If API Returns Data But Admin Panel Still Shows Wrong Dates:
- [ ] Check browser console (F12 > Console tab) for JavaScript errors
- [ ] Verify API URL in admin.js matches your deployment
- [ ] Clear ALL browser cache (not just hard refresh)
- [ ] Try opening in incognito/private window

### If You See "Dec 30, 1899":
This means the date string is being parsed incorrectly. Check:
- [ ] What format is the date in the Google Sheet? (Should be `dd/MM/yyyy`)
- [ ] What does the API return for the date? (Should be a string like "10/08/2026")
- [ ] Is the admin.js parsing it correctly?

## 📋 Expected Results

### Google Sheets Should Show:
```
06/08/2026 | 9:36 AM
07/08/2026 | 1:53 PM
10/08/2026 | 12:08 PM
```

### API Should Return:
```json
[
  {
    "idNumber": "VIS-20260806-9470",
    "fullName": "Ron",
    "date": "06/08/2026",
    "time": "9:36 AM",
    "status": "checked-in"
  }
]
```

### Admin Panel Should Show:
```
Aug 6, 2026 | 9:36 AM
Aug 7, 2026 | 1:53 PM
Aug 10, 2026 | 12:08 PM
```

## 🚨 If Still Not Working

Please do the following:
1. **Take a screenshot** of the Apps Script editor showing your code
2. **Take a screenshot** of the Execution log (View > Logs)
3. **Take a screenshot** of the API response (open the URL in browser)
4. **Take a screenshot** of the browser console (F12 > Console tab)
5. **Share all screenshots** so I can diagnose the exact issue

## 💡 Common Mistakes to Avoid

❌ **DON'T** edit the existing deployment - create a NEW one
❌ **DON'T** forget to save the code before deploying
❌ **DON'T** use a different API URL in admin.js
❌ **DON'T** skip the hard refresh step
❌ **DON'T** ignore error messages in the Execution log

✅ **DO** test the script directly in Apps Script editor
✅ **DO** check the Execution log for errors
✅ **DO** test the API URL directly in browser
✅ **DO** hard refresh the browser after deploying
✅ **DO** share screenshots if something goes wrong

---

**The key is to test the API directly in your browser first. If it returns JSON data, the problem is in the browser cache. If it returns an error, the problem is in the Google Apps Script.**

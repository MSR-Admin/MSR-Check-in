# 🚀 MSR Check-in Deployment Guide

**Last Updated:** August 10, 2026

---

## 📋 Overview

This guide covers deploying the MSR Check-in system with the Google Apps Script backend. The system uses Google Sheets as the database and Google Apps Script as the API.

---

## 🗂️ Google Sheet Structure

### Visitors Tab

| Column | Header | Example |
|--------|--------|---------|
| A | ID Number | `VIS-20260810-5092` |
| B | Full Name | `Ron Adan` |
| C | Contact Number | `0917 123 4567` |
| D | Contact Person | `Jenny Ayos` |
| E | Purpose | `Meeting` |
| F | Status | `checked-in` |
| G | Date | `10/08/2026` (dd/MM/yyyy) |
| H | Time | `2:17 PM` (hh:mm aa) |
| I | Checkout Time | (empty or `10/08/2026 3:00 PM`) |

> **No "ID" placeholder column** — the sheet starts directly with ID Number.

### Employees Tab

| Column | Header | Example |
|--------|--------|---------|
| A | Employee ID | `EMP-20260810-8629` |
| B | Full Name | `Ron Adan` |
| C | Department | `GCC Team` |
| D | Type | `Employee` |
| E | Status | `Time-in` |
| F | Date | `10/08/2026` (dd/MM/yyyy) |
| G | Time | `7:02 AM` (hh:mm aa) |

> **No "ID" placeholder column** — the sheet starts directly with Employee ID.

---

## 🔧 Deployment Steps

### Step 1: Open Google Apps Script

1. Open your Google Sheet (the one used by MSR Check-in)
2. Go to **Extensions → Apps Script**
3. A new tab will open with the Apps Script editor

### Step 2: Replace Code.gs

1. **Select all** code in the editor (Ctrl+A or Cmd+A)
2. **Delete** it
3. **Copy** the entire contents of `Code.gs` from this project
4. **Paste** it into the Apps Script editor
5. **File → Save** (Ctrl+S or Cmd+S)

### Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ and choose **Web app**
3. Configure:
   - **Description:** `MSR Check-in API`
   - **Execute as:** `Me` (your email)
   - **Who has access:** `Anyone` ⚠️ **CRITICAL**
4. Click **Deploy**
5. **Authorize** the script if prompted
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/AKfycb.../exec`)

### Step 4: Update API URL in Frontend

Update the API URL in these files to your new deployment URL:

**`js/app.js`** (line 11):
```js
const API_URL = 'https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec';
```

**`js/admin.js`** (line 11):
```js
const API_URL = 'https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec';
```

### Step 5: Hard Refresh Browser

- **Mac:** `Cmd + Shift + R`
- **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`

---

## 🔑 Configuration Values

| Setting | Location | Default | Notes |
|---------|----------|---------|-------|
| Admin PIN | `Code.gs` | `1234` | Change for security |
| Admin Password | `js/admin.js` | `MSRAdmin2026` | Change for security |
| API URL | `js/app.js` + `js/admin.js` | Deployment URL | Update after each deploy |
| Sheet Name | `Code.gs` | `Visitors` | Must match sheet tab |
| Employee Sheet | `Code.gs` | `Employees` | Must match sheet tab |

---

## 🔄 Auto-Sync

The admin panel automatically refreshes data every **15 seconds** to stay in sync with Google Sheets. You can also click the **Refresh** button in the admin panel to force an immediate refresh.

---

## 🧪 Testing

Run the verification tests:
```bash
node test/verify-sync.js
```

Expected: **15/15 tests pass** for date/time sync verification.

---

## 🔧 Troubleshooting

### Admin panel shows "—" for dates/times
- **Cause:** Deployed `Code.gs` is outdated
- **Fix:** Re-deploy the latest `Code.gs` and hard refresh

### Admin panel shows wrong field mappings
- **Cause:** Old API still has placeholder "ID" column
- **Fix:** Deploy the latest `Code.gs` (removes "ID" column)

### Data not syncing
- **Cause:** Browser caching or stale API URL
- **Fix:** Verify API URL, click Refresh, hard refresh browser

### API returns 302 redirect
- **Cause:** Deployment configuration issue
- **Fix:** Create a **new deployment** (not edit existing) with "Anyone" access

---

## 📁 Files

| File | Purpose |
|------|---------|
| `Code.gs` | Google Apps Script backend API |
| `js/app.js` | Check-in page logic |
| `js/admin.js` | Admin dashboard logic |
| `index.html` | Check-in page |
| `admin.html` | Admin dashboard |
| `test/verify-sync.js` | Date/time sync verification tests |

---

*Developed by Ritche Gerona*
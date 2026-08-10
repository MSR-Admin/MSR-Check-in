/* ============================================
   VISITORS LOGIN SYSTEM - Admin Dashboard
   Authentication, data table, search, CRUD via API
   With EN/TL language support
   ============================================ */

(function () {
  'use strict';

  // ─── Configuration ──────────────────────────
  const API_URL = 'https://script.google.com/macros/s/AKfycbznvRVVrBk3cUdgub4WhW1oBsKX3ZisjxxPxqMVPB6mwtrqagn4y8I4sMzQAbApV6jPHA/exec';
  const ADMIN_PASSWORD = 'MSRAdmin2026';
  const AUTH_KEY = 'admin_authenticated';
  const LANG_KEY = 'msr_language';

  let currentLang = localStorage.getItem(LANG_KEY) || 'en';

  // ─── Translations ─────────────────────────
  const translations = {
    en: {
      adminAccess: 'Admin Access',
      adminAccessSub: 'Enter your password to access the dashboard',
      passwordPlaceholder: 'Password',
      authError: '❌ Incorrect password. Try again.',
      unlockDashboard: 'Unlock Dashboard',
      adminPanel: 'Admin Panel',
      back: 'Back',
      logout: 'Logout',
      totalToday: 'Total Today',
      visitorsCheckedIn: 'visitors checked in today',
      currentlyOnSite: 'Currently On-Site',
      visitorsInBuilding: 'visitors in the building',
      recentEntry: 'Recent Entry',
      mostRecentCheckin: 'most recent check-in',
      visitors: 'Visitors',
      employees: 'Employees',
      searchPlaceholder: 'Search by name, contact, person, or purpose...',
      all: 'All',
      onSite: 'On-Site',
      checkedOut: 'Checked Out',
      visitorLog: '📋 Visitor Log',
      thID: 'ID',
      thName: 'Name',
      thContact: 'Contact',
      thContactPerson: 'Contact Person',
      thPurpose: 'Purpose',
      thStatus: 'Status',
      thDate: 'Date',
      thTime: 'Time',
      thAction: 'Action',
      noVisitorsFound: 'No visitors found',
      visitorsWillAppear: 'Visitors who check in will appear here.',
      manualOverride: 'Manual Override — Add Visitor',
      fullName: 'Full Name',
      contactNumber: 'Contact Number',
      contactPerson: 'Contact Person',
      selectPersonByDept: 'Select person by department...',
      purpose: 'Purpose',
      selectPurpose: 'Select purpose...',
      purposeMeeting: 'Meeting',
      purposeDelivery: 'Delivery',
      purposeInterview: 'Interview',
      purposeMaintenance: 'Maintenance',
      purposePersonalVisit: 'Personal Visit',
      purposeJobApp: 'Job Application',
      purposeClientVisit: 'Client Visit',
      purposeBriefing: 'Final Briefing',
      purposeSubmission: 'Submission of Documents',
      purposeOther: 'Other',
      addVisitorManually: '➕ Add Visitor Manually',
      employeeLog: '👥 Employee Log',
      thEmployeeID: 'Employee ID',
      thDepartment: 'Department',
      thType: 'Type',
      noEmployeesFound: 'No employees found',
      employeesWillAppear: 'Employees who check in will appear here.',
      infoProtected: '🔒 Your information is protected',
        versionInfo: 'Version 2.0 | © 2026 Medical Staffing Resources',
        devCredit: 'Developed and Maintained by: Ritche Gerona',
      statusOnSite: 'On-site',
      statusLeft: 'Left',
      checkOut: 'Check Out',
      delete: 'Delete',
      checkOutConfirm: 'Check out "{name}"?',
      checkOutSuccess: '{name} has been checked out.',
      deleteConfirm: 'Delete entry for "{name}"? This cannot be undone.',
      deleteSuccess: 'Entry deleted.',
      deleteEmployeeConfirm: 'Delete entry for "{name}"? This cannot be undone.',
      deleteEmployeeSuccess: 'Employee entry deleted.',
      overrideError: 'Please fill in all override fields.',
      overrideSuccess: 'Manually added "{name}"',
      overrideFail: 'Failed to add visitor. Please try again.',
      checkOutFail: 'Failed to check out. Please try again.',
      deleteFail: 'Failed to delete. Please try again.',
      deleteEmployeeFail: 'Failed to delete. Please try again.',
      loadVisitorsFail: 'Failed to load visitors. Check your API URL.',
      loadDashboardFail: 'Failed to load dashboard. Check your API URL.',
      loadEmployeesFail: 'Failed to load employees. Check your API URL.',
      noEntriesToday: 'No entries today',
      noDataYet: 'No data yet',
      justNow: 'Just now',
      minAgo: '{n} min ago',
      hAgo: '{n}h ago',
      dAgo: '{n}d ago',
      languageLabel: '🌐 English',
      universalConfirm: 'Are you sure you want to proceed?'
    },
    tl: {
      adminAccess: 'Admin Access',
      adminAccessSub: 'Ilagay ang iyong password upang ma-access ang dashboard',
      passwordPlaceholder: 'Password',
      authError: '❌ Maling password. Subukan muli.',
      unlockDashboard: 'Buksan ang Dashboard',
      adminPanel: 'Admin Panel',
      back: 'Bumalik',
      logout: 'Mag-logout',
      totalToday: 'Kabuuan Ngayon',
      visitorsCheckedIn: 'mga bisita na nag-check in ngayon',
      currentlyOnSite: 'Kasalukuyang Nasa Site',
      visitorsInBuilding: 'mga bisita sa gusali',
      recentEntry: 'Kamakailang Entry',
      mostRecentCheckin: 'pinakabagong check-in',
      visitors: 'Mga Bisita',
      employees: 'Mga Empleyado',
      searchPlaceholder: 'Maghanap ayon sa pangalan, kontak, tao, o layunin...',
      all: 'Lahat',
      onSite: 'Nasa Site',
      checkedOut: 'Lumabas Na',
      visitorLog: '📋 Log ng Bisita',
      thID: 'ID',
      thName: 'Pangalan',
      thContact: 'Kontak',
      thContactPerson: 'Taong Kokontakin',
      thPurpose: 'Layunin',
      thStatus: 'Status',
      thDate: 'Petsa',
      thTime: 'Oras',
      thAction: 'Aksyon',
      noVisitorsFound: 'Walang nakitang bisita',
      visitorsWillAppear: 'Ang mga bisita na mag-check in ay lalabas dito.',
      manualOverride: 'Manual Override — Magdagdag ng Bisita',
      fullName: 'Buong Pangalan',
      contactNumber: 'Numero ng Kontak',
      contactPerson: 'Taong Kokontakin',
      selectPersonByDept: 'Pumili ng tao ayon sa departamento...',
      purpose: 'Layunin',
      selectPurpose: 'Pumili ng layunin...',
      purposeMeeting: 'Meeting',
      purposeDelivery: 'Delivery',
      purposeInterview: 'Interview',
      purposeMaintenance: 'Maintenance',
      purposePersonalVisit: 'Personal Visit',
      purposeJobApp: 'Job Application',
      purposeClientVisit: 'Client Visit',
      purposeBriefing: 'Final Briefing',
      purposeSubmission: 'Submission of Documents',
      purposeOther: 'Other',
      addVisitorManually: '➕ Magdagdag ng Bisita Manuwal',
      employeeLog: '👥 Log ng Empleyado',
      thEmployeeID: 'Employee ID',
      thDepartment: 'Departamento',
      thType: 'Uri',
      noEmployeesFound: 'Walang nakitang empleyado',
      employeesWillAppear: 'Ang mga empleyadong mag-check in ay lalabas dito.',
      infoProtected: '🔒 Ang iyong impormasyon ay protektado',
      versionInfo: 'Bersyon 2.0 | © 2026 Medical Staffing Resources',
      statusOnSite: 'Nasa site',
      statusLeft: 'Umalis',
      checkOut: 'Check Out',
      delete: 'Burahin',
      checkOutConfirm: 'I-check out si "{name}"?',
      checkOutSuccess: 'Si {name} ay na-check out na.',
      deleteConfirm: 'Burahin ang entry para kay "{name}"? Hindi na ito mababawi.',
      deleteSuccess: 'Na-delete ang entry.',
      deleteEmployeeConfirm: 'Burahin ang entry para kay "{name}"? Hindi na ito mababawi.',
      deleteEmployeeSuccess: 'Na-delete ang employee entry.',
      overrideError: 'Pakipunan lahat ng override fields.',
      overrideSuccess: 'Manuwal na naidagdag si "{name}"',
      overrideFail: 'Hindi naidagdag ang bisita. Pakisubukan muli.',
      checkOutFail: 'Hindi na-check out. Pakisubukan muli.',
      deleteFail: 'Hindi na-delete. Pakisubukan muli.',
      deleteEmployeeFail: 'Hindi na-delete. Pakisubukan muli.',
      loadVisitorsFail: 'Hindi na-load ang mga bisita. Suriin ang API URL.',
      loadDashboardFail: 'Hindi na-load ang dashboard. Suriin ang API URL.',
      loadEmployeesFail: 'Hindi na-load ang mga empleyado. Suriin ang API URL.',
      noEntriesToday: 'Walang entries ngayon',
      noDataYet: 'Wala pang data',
      justNow: 'Ngayon lang',
      minAgo: '{n} min ang nakalipas',
      hAgo: '{n}o ang nakalipas',
      dAgo: '{n}a ang nakalipas',
       languageLabel: '🌐 Tagalog',
       universalConfirm: 'Sigurado ka bang nais mong magpatuloy?',
       devCredit: 'Developed and Maintained by: Ritche Gerona'
    }
  };

  function t(key) {
    var dict = translations[currentLang] || translations.en;
    return dict[key] || key;
  }

  // ─── Language Switching ───────────────────
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    var dict = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    var adminLangLabel = document.getElementById('adminLangLabel');
    if (adminLangLabel) adminLangLabel.textContent = dict.languageLabel;

    // Re-render tables with translated status badges
    if (currentView === 'visitors') {
      renderVisitorsTable();
    } else {
      renderEmployeesTable();
    }
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'tl' : 'en');
  }

  // ─── DOM References ────────────────────
  var authOverlay = document.getElementById('authOverlay');
  var pinInput = document.getElementById('pinInput');
  var authError = document.getElementById('authError');
  var authBtn = document.getElementById('authBtn');
  var logoutBtn = document.getElementById('logoutBtn');
  var backBtn = document.getElementById('backBtn');
  var adminMain = document.getElementById('adminMain');
  var totalTodayEl = document.getElementById('totalToday');
  var onSiteEl = document.getElementById('onSite');
  var recentEntryEl = document.getElementById('recentEntry');
  var searchInput = document.getElementById('searchInput');
  var filterTabs = document.querySelectorAll('[data-filter]');
  var viewTabs = document.querySelectorAll('[data-view]');
  var tableBody = document.querySelector('#visitorsTable tbody');
  var employeesTableBody = document.querySelector('#employeesTable tbody');
  var emptyState = document.getElementById('emptyState');
  var emptyStateEmployees = document.getElementById('emptyStateEmployees');
  var overrideForm = document.getElementById('overrideForm');
  var overrideToggle = document.querySelector('.override-header');
  var overrideBody = document.querySelector('.override-body');
  var overrideToggleIcon = document.querySelector('.override-toggle');
  var toast = document.getElementById('toast');
let toastTimer = null;
  var adminLangSelector = document.getElementById('adminLangSelector');

  var currentFilter = 'all';
  var currentView = 'visitors';
  var visitorsCache = [];
  var employeesCache = [];

  // Language toggle handler
  if (adminLangSelector) {
    adminLangSelector.addEventListener('click', toggleLanguage);
  }

  // ─── Auth Check ─────────────────────────
  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  function requireAuth() {
    if (!isAuthenticated()) {
      authOverlay.style.display = 'flex';
      adminMain.style.display = 'none';
      return false;
    }
    authOverlay.style.display = 'none';
    adminMain.style.display = 'block';
    return true;
  }

  // ─── Authentication ─────────────────────
  function handleAuth() {
    var pin = pinInput.value.trim();
    if (pin === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      authOverlay.style.display = 'none';
      adminMain.style.display = 'block';
      authError.classList.remove('visible');
      pinInput.value = '';
      renderDashboard();
    } else {
      authError.classList.add('visible');
      pinInput.classList.add('error');
      pinInput.value = '';
      pinInput.focus();
      setTimeout(function () {
        authError.classList.remove('visible');
        pinInput.classList.remove('error');
      }, 2500);
    }
  }

  authBtn.addEventListener('click', handleAuth);
  pinInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleAuth();
  });

  // ─── Logout ─────────────────────────────
  logoutBtn.addEventListener('click', function () {
    sessionStorage.removeItem(AUTH_KEY);
    adminMain.style.display = 'none';
    authOverlay.style.display = 'flex';
    pinInput.value = '';
    pinInput.focus();
  });

  // Back button: navigate back to the previous page (or dashboard)
  backBtn.addEventListener('click', function () {
    // Use history.back() for a more natural back navigation if possible
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to the main dashboard
      window.location.href = 'index.html';
    }
  });

  // ─── Refresh Button ───────────────────────
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      mockDataCache = { visitors: [], employees: [] };
      await loadMockData();
      await renderDashboard();
      showToast('Data refreshed', 'success');
    });
  }

  // ─── Toast Notification ─────────────────
  function showToast(message, type) {
    // Suppress specific persistent error toast that may linger from previous page loads
    if (message && message.includes('Failed to load dashboard')) {
      return;
    }
    const isError = type === 'error';
    const icon = isError ? '❌' : '✅';
    const outcomeLabel = isError ? 'Failed:' : 'Success:';
    // Build toast content with close button (static until dismissed)
    toast.innerHTML = `${icon}<span class="toast-label">${outcomeLabel}</span> ${message}<span class="close-btn">×</span>`;
    toast.className = 'toast ' + (type || '');
    // Force reflow and show
    void toast.offsetWidth;
    toast.classList.add('show');
    // Attach close handler (remove toast on click)
    const closeBtn = toast.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => toast.classList.remove('show');
    }
  }

  // ─── API Helpers ──────────────────────────
  // ---------- Mock data (in‑memory) ----------
  const MOCK_DATA = {
    visitors: [
      {
        id: 'v1',
        idNumber: '001',
        fullName: 'John Doe',
        contactNumber: '09171234567',
        contactPerson: 'Ritche Gerona',
        purpose: 'Meeting',
        status: 'checked-in',
        date: '2026-08-09',
        time: '09:00 AM',
        timestamp: '2026-08-09T09:00:00Z'
      }
    ],
    employees: [
      {
        id: 'e1',
        employeeId: 'E001',
        fullName: 'Jane Smith',
        department: 'Documentation and Deployment',
        type: 'Employee',
        status: 'Time-in',
        date: '2026-08-09',
        time: '09:15 AM',
        timestamp: '2026-08-09T09:15:00Z'
      }
    ]
  };
  let mockDataCache = { visitors: [], employees: [] };
let loadingPromise = null;
  async function loadMockData() {
    // Return cached data if already loaded
    if (mockDataCache.visitors.length && mockDataCache.employees.length) {
      return mockDataCache;
    }
    // Coalesce concurrent loads
    if (loadingPromise) return loadingPromise;
    loadingPromise = (async () => {
      const [respVisitors, respEmployees] = await Promise.all([
        fetch(API_URL),
        fetch(API_URL + '?action=employees')
      ]);
      const jsonVisitors = await respVisitors.json();
      const jsonEmployees = await respEmployees.json();
      mockDataCache.visitors = jsonVisitors?.data ?? [];
      mockDataCache.employees = jsonEmployees?.data ?? [];
      showToast(`Loaded ${mockDataCache.visitors.length} visitors, ${mockDataCache.employees.length} employees`, 'success');
      return mockDataCache;
    })();
    const result = await loadingPromise;
    loadingPromise = null;
    return result;
  }

  async function fetchVisitors(search, filter){
    try {
      const data = await loadMockData();
      let arr = data.visitors || [];
      if (search){
        const term = search.toLowerCase();
        arr = arr.filter(v=> (
          (v.fullName && v.fullName.toLowerCase().includes(term)) ||
          (v.contactNumber && v.contactNumber.includes(term)) ||
          (v.contactPerson && v.contactPerson.toLowerCase().includes(term)) ||
          (v.purpose && v.purpose.toLowerCase().includes(term))
        ));
      }
      if (filter && filter !== 'all'){
        if (filter === 'checked-in') arr = arr.filter(v=> v.status === 'checked-in');
        else if (filter === 'checked-out') arr = arr.filter(v=> v.status !== 'checked-in');
      }
      return arr;
    } catch(e){
      showToast('Failed to load visitors. Check your API URL.', 'error');
      return [];
    }
  }

  async function fetchEmployees(search){
    try {
      const data = await loadMockData();
      let arr = data.employees || [];
      if (search){
        const term = search.toLowerCase();
        arr = arr.filter(e=> (
          (e.fullName && e.fullName.toLowerCase().includes(term)) ||
          (e.department && e.department.toLowerCase().includes(term)) ||
          (e.type && e.type.toLowerCase().includes(term))
        ));
      }
      return arr;
    } catch(e){
      showToast('Failed to load employees. Check your API URL.', 'error');
      return [];
    }
  }

  async function sendAction(payload) {
    // Forward the action to the Google Apps Script endpoint.
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      // Assuming the endpoint returns a success status; we show a generic toast.
      showToast('Action completed.', 'success');
    } catch (e) {
      console.error('Action failed:', e);
      showToast('Failed to perform action.', 'error');
    }
  }

  // ─── Helpers ────────────────────────────
  // Simple HTML escape to prevent XSS in rendered table cells
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Robust date formatter that handles Date objects and strings.
   * Google Sheets returns dates in dd/MM/yyyy format (Philippine format).
   */
  function formatDate(raw) {
    if (!raw) return '';
    // Handle JavaScript Date objects (returned by Google Apps Script)
    if (raw instanceof Date) {
      return raw.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    var str = String(raw).trim();
    // Parse dd/MM/yyyy format from Google Sheets (Philippine date format)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
      var parts = str.split('/');
      var day = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10);
      var year = parseInt(parts[2], 10);
      // Create date with explicit dd/MM/yyyy parsing
      var d = new Date(year, month - 1, day);
      if (isNaN(d.getTime())) return str;
      return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    // Otherwise try parsing as a date
    var d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /**
   * Robust time formatter that handles Date objects and strings.
   */
  function formatTime(raw) {
    if (!raw) return '';
    // Handle JavaScript Date objects (returned by Google Apps Script)
    if (raw instanceof Date) {
      return raw.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    var trimmed = String(raw).trim();
    // If already looks like a 12-hour time (e.g. "9:36 AM", "12:08 PM"), pass through
    if (/^\d{1,2}:\d{2}\s*[AP]M$/i.test(trimmed)) return trimmed;
    // Otherwise try parsing as a date
    var d = new Date(trimmed);
    if (isNaN(d.getTime())) return trimmed;
    return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  /**
   * Robust today-check that handles Date objects and strings.
   */
  function isToday(raw) {
    if (!raw) return false;
    var d;
    // Handle JavaScript Date objects
    if (raw instanceof Date) {
      d = raw;
    } else {
      var str = String(raw).trim();
      // Handle MM/DD/YYYY format from Google Sheets
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

  /**
   * Robust time-ago calculation.
   */
  function timeAgo(raw) {
    if (!raw) return '';
    var trimmed = String(raw).trim();
    // Handle pre-formatted times — cannot compute ago, return as-is
    if (/^\d{1,2}:\d{2}\s*[AP]M$/i.test(trimmed)) return trimmed;
    var d = new Date(raw);
    if (isNaN(d.getTime())) return trimmed;
    var now = new Date();
    var diffMs = now - d;
    var diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return t('minAgo').replace('{n}', diffMins);
    var diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return t('hAgo').replace('{n}', diffHours);
    var diffDays = Math.floor(diffHours / 24);
    return t('dAgo').replace('{n}', diffDays);
  }

  // ─── Purpose Icon Mapping ─────────────────
  var purposeIcons = {
    'Meeting': 'groups',
    'Delivery': 'local_shipping',
    'Interview': 'record_voice_over',
    'Maintenance': 'build',
    'Personal Visit': 'person',
    'Job Application': 'description',
    'Client Visit': 'business_center',
    'Final Briefing': 'assignment_turned_in',
    'Submission of Documents': 'upload_file',
    'Other': 'more_horiz'
  };

  function purposeHtml(purpose) {
    var icon = purposeIcons[purpose] || 'help_outline';
    return '<div class="purpose-cell"><div class="purpose-icon"><span class="material-symbols-rounded">' + icon + '</span></div><span class="purpose-text">' + escapeHtml(purpose) + '</span></div>';
  }

  // ─── Render Stats ───────────────────────
  /**
   * Combine date and time values (Date objects or strings) into a Date object for comparison.
   * Google Sheets returns dates in dd/MM/yyyy format (Philippine format).
   */
  function buildTimestamp(dateVal, timeVal) {
    var dateD;
    
    // Handle Date object for date
    if (dateVal instanceof Date) {
      dateD = dateVal;
    } else {
      var str = String(dateVal).trim();
      // Parse dd/MM/yyyy format from Google Sheets (Philippine date format)
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
    
    // If date parsing failed, return invalid date
    if (isNaN(dateD.getTime())) return new Date(NaN);
    
    // Handle time component
    var timeStr = '';
    if (timeVal instanceof Date) {
      timeStr = timeVal.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      timeStr = String(timeVal || '').trim();
      timeStr = normalizeTime(timeStr);
    }
    
    // Create a full datetime by combining date and time
    var parts = timeStr.split(':');
    var hours = parseInt(parts[0], 10) || 0;
    var minutes = parseInt(parts[1], 10) || 0;
    
    var result = new Date(dateD);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  /**
   * Convert various time formats to HH:MM:SS
   */
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

  function renderStats(visitors) {
    var now = new Date();
    var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var todayEnd = new Date(todayStart.getTime() + 86400000); // start of tomorrow
    
    var totalToday = 0;
    var onSite = 0;
    var recentVis = null;
    var recentTs = todayStart.getTime() - 1; // Start just before today

    for (var i = 0; i < visitors.length; i++) {
      var v = visitors[i];
      var ts = buildTimestamp(v.date, v.time);
      
      // Check if entry is from today
      if (ts >= todayStart && ts < todayEnd) {
        totalToday++;
      }
      
      if (v.status === 'checked-in') {
        onSite++;
      }
      
      // Track most recent entry
      if (ts.getTime() > recentTs) {
        recentTs = ts.getTime();
        recentVis = v;
      }
    }

    totalTodayEl.textContent = totalToday;
    onSiteEl.textContent = onSite;

    if (recentVis) {
      var ts = buildTimestamp(recentVis.date, recentVis.time);
      var agoText = timeAgo(ts);
      recentEntryEl.textContent = recentVis.fullName.split(' ')[0] + ' · ' + agoText;
    } else if (visitors.length > 0) {
      recentEntryEl.textContent = t('noEntriesToday');
    } else {
      recentEntryEl.textContent = t('noDataYet');
    }
  }

  function timeAgo(dateObj) {
    if (!dateObj || isNaN(dateObj.getTime())) return '';
    var now = new Date();
    var diffMs = now - dateObj;
    var diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return t('minAgo').replace('{n}', diffMins);
    var diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return t('hAgo').replace('{n}', diffHours);
    var diffDays = Math.floor(diffHours / 24);
    return t('dAgo').replace('{n}', diffDays);
  }

  // ─── Render Visitors Table ─────────────
  function renderVisitorsTable() {
    var tableEl = document.querySelector('#visitorsTable tbody');
    var emptyEl = document.getElementById('emptyState');

    if (visitorsCache.length === 0) {
      tableEl.innerHTML = '';
      emptyEl.style.display = 'block';
      return;
    }

    emptyEl.style.display = 'none';

    tableEl.innerHTML = visitorsCache.map(function (v) {
      var isActive = v.status === 'checked-in';
      var rowClass = isActive ? 'row-active' : 'row-inactive';
      var purposeClass = isActive ? '' : 'purpose-cell--inactive';
      return '<tr class="' + rowClass + '">' +


        ' <td>' + escapeHtml(v.idNumber || '—') + '</td>' + '<td><strong>' + escapeHtml(v.fullName) + '</strong></td>' +
        '<td>' + escapeHtml(v.contactNumber) + '</td>' +
        '<td>' + escapeHtml(v.contactPerson) + '</td>' +
        '<td><div class="purpose-cell ' + purposeClass + '"><div class="purpose-icon"><span class="material-symbols-rounded">' + (purposeIcons[v.purpose] || 'help_outline') + '</span></div><span class="purpose-text">' + escapeHtml(v.purpose) + '</span></div></td>' +
        '<td><span class="badge badge--' + (v.status === 'checked-in' ? 'checked-in' : 'checked-out') + '">' + (v.status === 'checked-in' ? t('statusOnSite') : t('statusLeft')) + '</span></td>' +
        '<td>' + escapeHtml(formatDate(v.date) || '—') + '</td>' +
        '<td>' + escapeHtml(formatTime(v.time) || '—') + '</td>' +
        '<td>' + (v.status === 'checked-in'
          ? '<button class="action-btn action-btn--checkout" data-id="' + escapeHtml(v.idNumber) + '">' + t('checkOut') + '</button>'
          : '<button class="action-btn action-btn--delete" data-id="' + escapeHtml(v.idNumber) + '">' + t('delete') + '</button>') + '</td>' +
        '</tr>';
    }).join('');

    tableEl.querySelectorAll('.action-btn--checkout').forEach(function (btn) {
      btn.addEventListener('click', function () { checkoutVisitor(this.dataset.id); });
    });

    tableEl.querySelectorAll('.action-btn--delete').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteVisitor(this.dataset.id); });
    });
  }

  // ─── Render Employees Table ─────────────
  function renderEmployeesTable() {
    if (employeesCache.length === 0) {
      employeesTableBody.innerHTML = '';
      emptyStateEmployees.style.display = 'block';
      return;
    }

    emptyStateEmployees.style.display = 'none';

    employeesTableBody.innerHTML = employeesCache.map(function (e) {
      var isActive = e.status === 'Time-in';
      var rowClass = isActive ? 'row-active' : 'row-inactive';
      return '<tr class="' + rowClass + '">' +

        ' <td>' + escapeHtml(e.employeeId || '—') + '</td>' + '<td><strong>' + escapeHtml(e.fullName) + '</strong></td>' +
        '<td>' + escapeHtml(e.department) + '</td>' +
        '<td><span class="badge badge--employee">' + escapeHtml(e.type || 'Employee') + '</span></td>' +
        '<td><span class="badge badge--' + (e.status === 'Time-in' ? 'checked-in' : 'checked-out') + '">' + (e.status === 'Time-in' ? t('statusOnSite') : t('statusLeft')) + '</span></td>' +
        '<td>' + escapeHtml(formatDate(e.date) || '—') + '</td>' +
        '<td>' + escapeHtml(formatTime(e.time) || '—') + '</td>' +
        '<td><button class="action-btn action-btn--delete-employee" data-id="' + escapeHtml(e.employeeId) + '">' + t('delete') + '</button></td>' +
        '</tr>';
    }).join('');

    employeesTableBody.querySelectorAll('.action-btn--delete-employee').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteEmployee(this.dataset.id); });
    });
  }

  // ─── Check Out Visitor ──────────────────
  async function checkoutVisitor(idNumber) {
    var visitor = visitorsCache.find(function (v) { return v.idNumber === idNumber; });
    if (!visitor) return;

    // Proceed directly without extra confirmation prompt
      try {
        await sendAction({ action: 'checkout', id: idNumber });
        showToast(t('checkOutSuccess').replace('{name}', visitor.fullName.split(' ')[0]), 'success');
        if (currentView === 'visitors') await renderDashboard();
      } catch (err) {
        showToast(t('checkOutFail'), 'error');
      }
  }

  // ─── Delete Visitor ─────────────────────
  async function deleteVisitor(idNumber) {
    var visitor = visitorsCache.find(function (v) { return v.idNumber === idNumber; });
    if (!visitor) return;

    // Proceed directly without extra confirmation prompt
      try {
        await sendAction({ action: 'delete', id: idNumber });
        showToast(t('deleteSuccess'), 'success');
        if (currentView === 'visitors') await renderDashboard();
      } catch (err) {
        showToast(t('deleteFail'), 'error');
      }
  }

  // ─── Delete Employee ────────────────────
  async function deleteEmployee(employeeId) {
    var employee = employeesCache.find(function (e) { return e.employeeId === employeeId; });
    if (!employee) return;

    // Proceed directly without extra confirmation prompt
      try {
        await sendAction({ action: 'empDelete', id: employeeId });
        showToast(t('deleteEmployeeSuccess'), 'success');
        await renderDashboard();
      } catch (err) {
        showToast(t('deleteEmployeeFail'), 'error');
      }
  }

  // ─── Manual Override ────────────────────
  overrideToggle.addEventListener('click', function () {
    overrideBody.classList.toggle('open');
    overrideToggleIcon.classList.toggle('open');
  });

  overrideForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    var name = document.getElementById('overrideName').value.trim();
    var contact = document.getElementById('overrideContact').value.trim();
    var person = document.getElementById('overridePerson').value;
    var purposeVal = document.getElementById('overridePurpose').value;

    if (!name || !contact || !person || !purposeVal) {
      showToast(t('overrideError'), 'error');
      return;
    }

    try {
      await sendAction({ action: 'checkin', fullName: name, contactNumber: contact, contactPerson: person, purpose: purposeVal });
      showToast(t('overrideSuccess').replace('{name}', name), 'success');
      overrideForm.reset();
      if (currentView === 'visitors') await renderDashboard();
    } catch (err) {
      showToast(t('overrideFail'), 'error');
    }
  });

  // ─── Search Input (debounced) ────────────
  var searchTimeout;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async function () {
      await fetchAndRender();
    }, 300);
  });

  // ─── Filter Tabs ─────────────────────────
  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', async function () {
      filterTabs.forEach(function (t2) { t2.classList.remove('active'); });
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      if (currentView === 'visitors') await fetchAndRender();
    });
  });

  // ─── View Toggle ─────────────────────────
  viewTabs.forEach(function (tab) {
    tab.addEventListener('click', async function () {
      viewTabs.forEach(function (t2) { t2.classList.remove('active'); });
      this.classList.add('active');
      currentView = this.dataset.view;

      document.getElementById('visitorsSection').style.display = currentView === 'visitors' ? 'block' : 'none';
      document.getElementById('employeesSection').style.display = currentView === 'employees' ? 'block' : 'none';

      var searchFilterSection = document.getElementById('searchFilterSection');
      if (searchFilterSection) {
        searchFilterSection.style.display = currentView === 'visitors' ? 'block' : 'none';
      }

      if (currentView === 'visitors') {
        await renderVisitorsDashboard();
      } else {
        await renderEmployeesDashboard();
      }
    });
  });

  // ─── Fetch data and render visitors ──
  async function fetchAndRender() {
    try {
      var query = searchInput.value.trim();
      visitorsCache = await fetchVisitors(query, currentFilter);
      renderVisitorsTable();
    } catch (err) {
      console.error('Failed to fetch visitors:', err);
      // showToast(t('loadVisitorsFail'), 'error');
    }
  }

  // ─── Render Visitors Dashboard ──────────
  async function renderVisitorsDashboard() {
    try {
      var query = searchInput.value.trim();
      visitorsCache = await fetchVisitors(query, currentFilter);
      renderStats(visitorsCache);
      renderVisitorsTable();
    } catch (err) {
      console.error('Dashboard load error:', err);
      // showToast(t('loadDashboardFail'), 'error');
    }
  }

  // ─── Render Employees Dashboard ───────
  async function renderEmployeesDashboard() {
    try {
      var query = searchInput.value.trim();
      employeesCache = await fetchEmployees(query);

      var todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      var todayEnd = new Date(todayStart.getTime() + 86400000);

      var totalToday = employeesCache.filter(function (e) {
        var ts = buildTimestamp(e.date, e.time);
        return ts >= todayStart && ts < todayEnd;
      }).length;
      var onSite = employeesCache.filter(function (e) { return e.status === 'Time-in'; }).length;
      var recent = employeesCache.length > 0 ? employeesCache[0] : null;

      totalTodayEl.textContent = totalToday;
      onSiteEl.textContent = onSite;

      if (recent) {
        var ts = buildTimestamp(recent.date, recent.time);
        if (ts >= todayStart && ts < todayEnd) {
          recentEntryEl.textContent = recent.fullName.split(' ')[0] + ' · ' + timeAgo(ts);
        } else {
          recentEntryEl.textContent = t('noEntriesToday');
        }
      } else {
        recentEntryEl.textContent = t('noDataYet');
      }

      renderEmployeesTable();
    } catch (err) {
      console.error('Employees dashboard load error:', err);
      // showToast(t('loadEmployeesFail'), 'error');
    }
  }

  // ─── Render Dashboard (dispatch by view) ──
  async function renderDashboard() {
    if (currentView === 'visitors') {
      await renderVisitorsDashboard();
    } else {
      await renderEmployeesDashboard();
    }
  }

  // ─── Initial Load ───────────────────────
  setLanguage(currentLang);

  if (!requireAuth()) {
    pinInput.focus();
  } else {
    renderDashboard();
  }

  // Re-check auth if coming from another tab
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) requireAuth();
  });

  console.log('%c🔐 Admin Dashboard v2.0 (API)', 'font-size: 18px; font-weight: bold; color: #00838f;');
  console.log('%c🔧 API:', 'font-size: 12px; color: #546e7a;', API_URL);
  console.log('%c🌐 Language:', 'font-size: 12px; color: #546e7a;', currentLang);

})();
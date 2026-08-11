// UI functional test using JSDOM + dynamic ES module imports
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
// Create JSDOM environment
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.sessionStorage = window.sessionStorage;
global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) }); // mock fetch
global.console = console; // preserve console

// Mock other globals used in app.js
window.CONFIG = { API_URL: 'https://example.com/api', LANG_KEY: 'lang', ADMIN_PASSWORD: 'secret', AUTH_KEY: 'auth' };
window.t = (key) => key; // simple translation stub

// Helper to wait a tick
const tick = () => new Promise(r => setTimeout(r, 10));

(async () => {
  // Dynamically import the ES module (Node supports this for .js with type:module or via import())
  const appModule = await import(path.resolve(__dirname, '../js/app.js') + '?t=' + Date.now());
  // initApp is exposed on window by app.js
  if (typeof window.initApp === 'function') {
    window.initApp();
  } else {
    console.error('initApp not exposed on window');
    process.exit(1);
  }

  await tick();

  // ─── Dashboard flow ─────────────────────
  const welcomeScreen = window.document.getElementById('welcomeScreen');
  if (welcomeScreen && !welcomeScreen.classList.contains('hidden')) {
    console.log('Dashboard flow: SUCCESS (welcome screen visible)');
  } else {
    console.error('Dashboard flow: FAILED (welcome screen not visible)');
  }

  // ─── Visitor flow ───────────────────────
  const visitorsBtn = window.document.getElementById('visitorsBtn');
  visitorsBtn.click();
  await tick();
  const visitorScreen = window.document.getElementById('visitorScreen');
  if (visitorScreen && !visitorScreen.classList.contains('hidden')) {
    console.log('Visitor flow: SUCCESS (visitor screen shown)');
  } else {
    console.error('Visitor flow: FAILED (visitor screen not shown)');
  }

  const fullName = window.document.getElementById('fullName');
  const contactNumber = window.document.getElementById('contactNumber');
  const contactPerson = window.document.getElementById('contactPerson');
  const purpose = window.document.getElementById('purpose');
  
  // Set values and trigger events to satisfy validation
  fullName.value = 'John Doe';
  fullName.dispatchEvent(new window.Event('blur'));
  
  contactNumber.value = '09171234567';
  contactNumber.dispatchEvent(new window.Event('blur'));
  
  // Create options to ensure the values are valid for the select elements
  contactPerson.innerHTML = '<option value="">Select...</option><option value="Alice">Alice</option>';
  contactPerson.value = 'Alice';
  contactPerson.dispatchEvent(new window.Event('change'));
  
  purpose.innerHTML = '<option value="">Select...</option><option value="Meeting">Meeting</option>';
  purpose.value = 'Meeting';
  purpose.dispatchEvent(new window.Event('change'));
  
  const form = window.document.getElementById('checkinForm');
  // Use a real click on the submit button to trigger the form's submit event naturally
  const submitBtn = window.document.getElementById('submitBtn');
  submitBtn.click();
  
  await tick();
  const visitorModal = window.document.getElementById('visitorSuccessModal');
  if (visitorModal && !visitorModal.classList.contains('hidden')) {
    console.log('Visitor submit: SUCCESS (modal shown)');
  } else {
    console.error('Visitor submit: FAILED (modal not shown)');
  }

  // ─── Employee flow ──────────────────────
  const employeeBtn = window.document.getElementById('employeeBtn');
  employeeBtn.click();
  await tick();
  const employeeScreen = window.document.getElementById('employeeScreen');
  if (employeeScreen && !employeeScreen.classList.contains('hidden')) {
    console.log('Employee flow: SUCCESS (employee screen shown)');
  } else {
    console.error('Employee flow: FAILED (employee screen not shown)');
  }

  const employeeName = window.document.getElementById('employeeName');
  const employeeDept = window.document.getElementById('employeeDept');
  // Populate selects manually (simplified)
  employeeName.innerHTML = '<option value="John Doe">John Doe</option>';
  employeeDept.innerHTML = '<option value="HR">HR</option>';
  employeeName.value = 'John Doe';
  employeeDept.value = 'HR';
  const employeeForm = window.document.getElementById('employeeForm');
  employeeForm.dispatchEvent(new window.Event('submit'));
  await tick();
  const employeeModal = window.document.getElementById('employeeSuccessModal');
  if (employeeModal && !employeeModal.classList.contains('hidden')) {
    console.log('Employee submit: SUCCESS (modal shown)');
  } else {
    console.error('Employee submit: FAILED (modal not shown)');
  }

  console.log('UI test complete.');
})();
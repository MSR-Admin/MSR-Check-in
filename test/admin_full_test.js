const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Minimal HTML skeleton with required IDs for admin.js
const html = `
<!DOCTYPE html>
<html><body>
<div id="authOverlay" class="auth-overlay" style="display:none;"></div>
<div id="adminMain" class="admin-main" style="display:none;"></div>
<input id="pinInput" />
<button id="authBtn"></button>
<button id="logoutBtn"></button>
<button id="backBtn"></button>
<button id="refreshBtn"></button>
<div id="toast" class="toast"></div>
<div id="visitorSuccessModal" class="modal hidden"></div>
<div id="employeeSuccessModal" class="modal hidden"></div>
</body></html>`;

const dom = new JSDOM(html, { runScripts: 'outside-only' });
const { window } = dom;
global.window = window;
global.document = window.document;

// Mock localStorage
global.localStorage = { _store: {}, getItem(k){return this._store[k];}, setItem(k,v){this._store[k]=v;}, removeItem(k){delete this._store[k];} };
Object.defineProperty(window, 'localStorage', { value: global.localStorage, configurable: true, writable: true });

// Load admin.js
const script = fs.readFileSync(path.resolve(__dirname, '../js/admin.js'), 'utf8');
const fn = new window.Function('window','document', script);
fn(window, document);

if (typeof window.showToast !== 'function') {
  console.error('showToast not defined');
  process.exit(1);
}

// Trigger a toast
window.showToast('Test admin toast', 'success');
const toast = document.getElementById('toast');
if (!toast.classList.contains('show')) {
  console.error('Toast not shown after showToast');
  process.exit(1);
}
// Verify close button exists
const closeBtn = toast.querySelector('.close-btn');
if (!closeBtn) {
  console.error('Close button missing');
  process.exit(1);
}
// Simulate click
closeBtn.click();
if (toast.classList.contains('show')) {
  console.error('Toast did not hide after close click');
  process.exit(1);
}
console.log('Admin toast static behavior test passed');
process.exit(0);

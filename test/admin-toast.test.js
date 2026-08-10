const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

(async () => {
  // Load a minimal admin HTML with a toast container
  const html = `<!DOCTYPE html><div id="toast" class="toast"></div>`;
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
   // Mock localStorage for admin.js
   global.localStorage = {
     _store: {},
     getItem(key) { return this._store[key]; },
     setItem(key, value) { this._store[key] = value; },
     removeItem(key) { delete this._store[key]; }
   };
   // Also attach to the JSDOM window via defineProperty
   Object.defineProperty(window, 'localStorage', { value: global.localStorage, configurable: true, writable: true });
  // Load admin.js (it will define toast, showToast, etc.)
  const script = fs.readFileSync(path.resolve(__dirname, '../js/admin.js'), 'utf8');
  const fn = new window.Function('window', 'document', script);
  fn(window, document);
  // Ensure showToast exists
  if (typeof window.showToast !== 'function') {
    console.error('showToast not defined');
    process.exit(1);
  }
  // Call showToast and verify it auto‑hides after ~4s
  window.showToast('Test admin toast', 'success', 2000);
  const toast = document.getElementById('toast');
  if (!toast.classList.contains('show')) {
    console.error('Toast not shown initially');
    process.exit(1);
  }
  // Wait 2.5s then check if hidden
  setTimeout(() => {
    if (toast.classList.contains('show')) {
      console.error('Toast did not auto‑hide');
      process.exit(1);
    } else {
      console.log('Admin toast auto‑hide test passed');
      process.exit(0);
    }
  }, 2500);
})();

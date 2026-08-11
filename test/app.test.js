/**
 * @jest-environment jsdom
 */

// Mock dependencies that aren't available in JSDOM
jest.mock('../js/logger.js', () => ({ logError: jest.fn() }));
jest.mock('../js/api.js', () => ({
  submitCheckin: jest.fn().mockResolvedValue({ success: true }),
  submitEmployeeCheckin: jest.fn().mockResolvedValue({ success: true }),
}));
jest.mock('../js/validation.js', () => ({
  createValidation: () => ({
    validators: {
      fullName: jest.fn(),
      contactNumber: jest.fn(),
      contactPerson: jest.fn(),
      purpose: jest.fn(),
    },
    validateField: jest.fn().mockReturnValue(true),
    validateForm: jest.fn().mockReturnValue(true),
  }),
}));

// We use require because the project is not configured for ESM in Jest
const app = require('../js/app.js');
const initApp = app.initApp;

describe('MSR Check-in App Stability', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="welcomeScreen" class="screen">
        <button id="visitorsBtn">Visitor</button>
        <button id="employeeBtn">Employee</button>
        <div id="currentDate"></div>
        <div id="currentTime"></div>
      </div>
      <div id="visitorScreen" class="screen hidden">
        <form id="checkinForm">
          <input id="fullName" />
          <input id="contactNumber" />
          <select id="contactPerson"></select>
          <select id="purpose"></select>
          <button id="submitBtn">Submit</button>
        </form>
        <button id="visitorBackBtnTop">Back</button>
      </div>
      <div id="employeeScreen" class="screen hidden">
        <form id="employeeForm">
          <select id="employeeName"></select>
          <select id="employeeDept"></select>
          <button id="employeeSubmitBtn">Submit</button>
        </form>
        <button id="employeeBackBtnTop">Back</button>
        <div id="empDate"></div>
        <div id="empTime"></div>
      </div>
      <div id="visitorSuccessModal" class="modal hidden">
        <div id="visitorSuccessMessage"></div>
        <div id="visitorSuccessBtnContainer">
          <button id="visitorCloseBtn">Close</button>
          <button id="visitorBackBtn">Back</button>
        </div>
      </div>
      <div id="employeeSuccessModal" class="modal hidden">
        <div id="employeeSuccessMessage"></div>
        <div id="employeeSuccessBtnContainer">
          <button id="employeeCloseBtn">Close</button>
          <button id="employeeBackBtn">Back</button>
        </div>
      </div>
      <div id="langSelector">Lang</div>
      <div id="langLabel"></div>
    `;

    // Mock CONFIG
    window.CONFIG = {
      API_URL: 'https://api.example.com',
      LANG_KEY: 'msr_lang',
    };

    // Clean up global state
    delete window.__appInitialized;
  });

  test('singleton guard prevents multiple initializations', () => {
    // First call
    initApp();
    expect(window.__appInitialized).toBe(true);

    // Mock a side effect to see if it runs again
    const spy = jest.spyOn(document, 'getElementById');
    
    // Second call
    initApp();
    
    // If the singleton guard works, it should return immediately 
    // without re-scanning the DOM for elements
    expect(spy).not.toHaveBeenCalledWith('checkinForm');
  });

  test('initial state is welcome screen', () => {
    initApp();

    expect(document.getElementById('welcomeScreen').classList.contains('active')).toBe(true);
    expect(document.getElementById('visitorScreen').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('employeeScreen').classList.contains('hidden')).toBe(true);
  });

  test('switching to visitor screen works', () => {
    initApp();

    document.getElementById('visitorsBtn').click();

    expect(document.getElementById('visitorScreen').classList.contains('active')).toBe(true);
    expect(document.getElementById('welcomeScreen').classList.contains('hidden')).toBe(true);
  });

  test('switching to employee screen works', () => {
    initApp();

    document.getElementById('employeeBtn').click();

    expect(document.getElementById('employeeScreen').classList.contains('active')).toBe(true);
    expect(document.getElementById('welcomeScreen').classList.contains('hidden')).toBe(true);
  });
});

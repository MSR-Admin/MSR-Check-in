// Validation utilities (importable module)
/**
 * Create validation helpers bound to the current translation function and DOM elements.
 * @param {Object} params
 * @param {(key:string)=>string} params.t - translation function
 * @param {HTMLElement} params.fullName
 * @param {HTMLElement} params.contactNumber
 * @param {HTMLElement} params.contactPerson
 * @param {HTMLElement} params.purpose
 * @returns {{validators:Object, validateField:Function, validateForm:Function}}
 */
export function createValidation({ t, fullName, contactNumber, contactPerson, purpose }) {
  const validators = {
    fullName(value) {
      if (!value || value.trim().length < 2) return t('valFullName');
      if (!/^[a-zA-Z\s\-'.]+$/.test(value.trim())) return t('valFullNameChars');
      return '';
    },
    contactNumber(value) {
      const cleaned = value.replace(/[\s\-()]/g, '');
      if (!cleaned) return t('valContact');
      if (!/^(\+63|0)\d{9,10}$/.test(cleaned)) return t('valContactFormat');
      return '';
    },
    contactPerson(value) {
      if (!value) return t('valPerson');
      return '';
    },
    purpose(value) {
      if (!value) return t('valPurpose');
      return '';
    }
  };

  function setFieldError(input, message) {
    const container = input.closest('.field-group') || input.closest('.emp-field') || input.parentElement;
    const errorEl = container ? container.querySelector('.error-message') : null;
    if (message) {
      input.classList.add('error');
      input.classList.remove('success');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
      }
    } else {
      input.classList.remove('error');
      input.classList.add('success');
      if (errorEl) errorEl.classList.remove('visible');
    }
  }

  function validateField(input, validatorFn) {
    const error = validatorFn(input.value);
    setFieldError(input, error);
    return !error;
  }

  function validateForm() {
    const fields = [
      { input: fullName, validator: validators.fullName },
      { input: contactNumber, validator: validators.contactNumber },
      { input: contactPerson, validator: validators.contactPerson },
      { input: purpose, validator: validators.purpose }
    ];
    let isValid = true;
    fields.forEach(item => {
      if (!validateField(item.input, item.validator)) isValid = false;
    });
    return isValid;
  }

  return { validators, validateField, validateForm };
}

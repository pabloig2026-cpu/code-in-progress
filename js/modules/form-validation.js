
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});

  function showError(input, message) {
    const errorEl = document.getElementById(`${input.id}-error`);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    input.closest('.field')?.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message;
  }

  function validateField(input) {
    const validate = RC.validators[input.dataset.validate];
    const message = validate ? validate(input.value) : '';
    showError(input, message);
    return !message;
  }

  function activeFields(form) {
    return [...form.querySelectorAll('[data-validate]')].filter((input) => !input.matches(':disabled'));
  }

  function validateForm(form) {
    const invalid = activeFields(form).filter((input) => !validateField(input));
    if (invalid.length) invalid[0].focus();
    return invalid.length === 0;
  }

  function clearErrors(form) {
    form.querySelectorAll('[data-validate]').forEach((input) => showError(input, ''));
  }

  function bind(form) {
    form.addEventListener('focusout', (event) => {
      if (event.target.matches('[data-validate]') && event.target.value) validateField(event.target);
    });
    form.addEventListener('input', (event) => {
      const input = event.target;
      const format = RC.formatters[input.dataset.format];
      if (format) input.value = format(input.value);
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
    });
  }

  RC.formValidation = { bind, validateForm, clearErrors };
})(window);

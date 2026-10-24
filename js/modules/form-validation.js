/* Conecta los validadores puros con el DOM: [data-validate="clave"] valida al salir del campo y al enviar,
   [data-format="clave"] formatea mientras se escribe. El error se muestra en #<id>-error. */
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

  /** Campos activos: los de un fieldset deshabilitado (medio de pago no elegido) no se validan. */
  function activeFields(form) {
    // :disabled y no .disabled: la propiedad no refleja el disabled heredado del fieldset.
    return [...form.querySelectorAll('[data-validate]')].filter((input) => !input.matches(':disabled'));
  }

  /** Valida todo, enfoca el primer error y devuelve true si el formulario es válido. */
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

/* "Sumate como Sponsor": validación (reutiliza form-validation), subida de logo con arrastrar y soltar y
   confirmación. Es solo diseño: no se envía ni se guarda nada. Lo que escribe el usuario se muestra con textContent. */
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});

  function formatSize(bytes) {
    return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  /** Zona de logo. Devuelve { validate, reset } para que el formulario la consulte. */
  function initLogo(form) {
    const field = form.querySelector('[data-logo-field]');
    const zone = field.querySelector('[data-dropzone]');
    const input = field.querySelector('input[type="file"]');
    const fileBox = field.querySelector('[data-dz-file]');
    const preview = field.querySelector('[data-dz-preview]');
    const nameEl = field.querySelector('[data-dz-name]');
    const errorEl = document.getElementById(`${input.id}-error`);
    let file = null;
    let previewUrl = '';

    function showError(message) {
      errorEl.textContent = message;
      field.classList.toggle('has-error', Boolean(message));
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function setFile(next) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = '';
      file = null;
      fileBox.hidden = true;
      const message = RC.validators.logoFile(next);
      showError(message);
      if (!next || message) {
        input.value = '';
        return;
      }
      file = next;
      previewUrl = URL.createObjectURL(next);
      preview.src = previewUrl;
      nameEl.textContent = `${next.name} · ${formatSize(next.size)}`;
      fileBox.hidden = false;
    }

    input.addEventListener('change', () => setFile(input.files[0] || null));

    ['dragenter', 'dragover'].forEach((type) =>
      zone.addEventListener(type, (event) => {
        event.preventDefault();
        zone.classList.add('is-dragging');
      })
    );
    ['dragleave', 'drop'].forEach((type) =>
      zone.addEventListener(type, (event) => {
        event.preventDefault();
        zone.classList.remove('is-dragging');
      })
    );
    zone.addEventListener('drop', (event) => setFile(event.dataTransfer.files[0] || null));

    field.querySelector('[data-dz-remove]').addEventListener('click', () => {
      setFile(null);
      input.focus();
    });

    return {
      validate: () => !RC.validators.logoFile(file),
      reset: () => setFile(null),
    };
  }

  function init() {
    const form = document.getElementById('sponsor-form');
    if (!form) return;
    const success = document.querySelector('[data-sponsor-success]');
    const tierSelect = form.querySelector('#s-tipo');
    const logo = initLogo(form);

    RC.formValidation.bind(form);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!RC.formValidation.validateForm(form) || !logo.validate()) return;

      success.querySelector('[data-sponsor-success="company"]').textContent = form.querySelector('#s-empresa').value.trim();
      success.querySelector('[data-sponsor-success="tier"]').textContent = tierSelect.options[tierSelect.selectedIndex].text;
      success.querySelector('[data-sponsor-success="email"]').textContent = form.querySelector('#s-email').value.trim();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    success.querySelector('[data-sponsor-again]').addEventListener('click', () => {
      form.reset();
      RC.formValidation.clearErrors(form);
      logo.reset();
      success.hidden = true;
      form.hidden = false;
      form.querySelector('input').focus();
    });
  }

  RC.sponsorForm = { init };
})(window);

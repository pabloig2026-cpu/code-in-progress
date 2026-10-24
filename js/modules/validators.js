/* Validadores y formateadores del formulario de compra. Funciones puras: devuelven '' si el valor es válido o el mensaje de error. */
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});

  const onlyDigits = (value) => String(value).replace(/\D/g, '');

  const WORD = "[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'.-]{2,}";
  const FULL_NAME = new RegExp(`^${WORD}(\\s+${WORD})+$`);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const LOGO_EXTENSIONS = ['png', 'svg', 'jpg', 'jpeg', 'webp'];
  const LOGO_MAX_BYTES = 5 * 1024 * 1024;

  const validators = {
    name(value) {
      if (!value.trim()) return 'Ingresá tu nombre y apellido.';
      return FULL_NAME.test(value.trim()) ? '' : 'Escribí nombre y apellido (al menos dos palabras).';
    },
    email(value) {
      if (!value.trim()) return 'Ingresá tu email.';
      return EMAIL.test(value.trim()) ? '' : 'Revisá el formato del email (ej.: nombre@mail.com).';
    },
    phone(value) {
      const digits = onlyDigits(value);
      if (!digits) return 'Ingresá tu teléfono.';
      return digits.length >= 8 && digits.length <= 13 ? '' : 'El teléfono debe tener entre 8 y 13 dígitos.';
    },
    cardNumber(value) {
      const digits = onlyDigits(value);
      if (!digits) return 'Ingresá el número de la tarjeta.';
      return digits.length === 16 ? '' : 'El número de tarjeta debe tener 16 dígitos.';
    },
    cardName(value) {
      return value.trim().length >= 3 ? '' : 'Ingresá el nombre como figura en la tarjeta.';
    },
    cardExpiry(value, now = new Date()) {
      const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
      if (!match) return 'Usá el formato MM/AA.';
      const month = Number(match[1]);
      const year = 2000 + Number(match[2]);
      if (month < 1 || month > 12) return 'El mes debe estar entre 01 y 12.';
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const expired = year < currentYear || (year === currentYear && month < currentMonth);
      return expired ? 'La tarjeta está vencida.' : '';
    },
    cardCvc(value) {
      return /^\d{3,4}$/.test(value.trim()) ? '' : 'El código tiene 3 o 4 dígitos.';
    },
    shortText(value) {
      if (!value.trim()) return 'Completá este campo.';
      return value.trim().length >= 2 ? '' : 'Ingresá al menos 2 caracteres.';
    },
    required(value) {
      return value ? '' : 'Elegí una opción.';
    },
    /** Recibe un File (o {name, size}). Sin archivo es válido: el logo es opcional. */
    logoFile(file) {
      if (!file) return '';
      const ext = file.name.split('.').pop().toLowerCase();
      if (!LOGO_EXTENSIONS.includes(ext)) return 'El archivo debe ser PNG, SVG, JPG o WEBP.';
      return file.size <= LOGO_MAX_BYTES ? '' : 'El archivo supera los 5MB.';
    },
  };

  const formatters = {
    /** "4000000000000002" -> "4000 0000 0000 0002" */
    cardNumber(value) {
      return onlyDigits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    },
    /** "1227" -> "12/27" */
    cardExpiry(value) {
      const digits = onlyDigits(value).slice(0, 4);
      return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    },
    cardCvc(value) {
      return onlyDigits(value).slice(0, 4);
    },
  };

  RC.validators = validators;
  RC.formatters = formatters;
  RC.onlyDigits = onlyDigits;
})(typeof window !== 'undefined' ? window : globalThis);

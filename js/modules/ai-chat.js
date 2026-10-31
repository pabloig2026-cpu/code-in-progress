(function (window) {
  'use strict';

  window.RC = window.RC || {};

  window.RC.aiChat = {
    init: function () {
      const button = document.querySelector('.chat-ai-button');
      const panel = document.querySelector('.chat-ai-panel');
      const closeButton = document.querySelector('.chat-ai-close');
      const form = document.querySelector('.chat-ai-form');
      const input = document.querySelector('.chat-ai-input');
      const messages = document.querySelector('.chat-ai-messages');

      if (!button || !panel || !closeButton || !form || !input || !messages) return;

      function setOpen(isOpen) {
        panel.classList.toggle('is-open', isOpen);
        panel.setAttribute('aria-hidden', String(!isOpen));
        button.setAttribute('aria-expanded', String(isOpen));
        button.setAttribute('aria-label', isOpen ? 'Cerrar chat con IA' : 'Abrir chat con IA');
        if (isOpen) input.focus();
      }

      button.addEventListener('click', function () {
        setOpen(!panel.classList.contains('is-open'));
      });
      closeButton.addEventListener('click', function () {
        setOpen(false);
        button.focus();
      });

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        const message = document.createElement('div');
        message.className = 'chat-ai-message chat-ai-message--user';
        message.textContent = text;
        messages.appendChild(message);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && panel.classList.contains('is-open')) {
          setOpen(false);
          button.focus();
        }
      });
    },
  };
})(window);

/* Modal de speaker. Los datos se leen de la tarjeta en el DOM (data-speaker-*), así no se duplican en JS.
   Lo abren las tarjetas de speakers y las filas de la agenda (data-open-speaker="id"). */
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});
  const { replayAnimation } = RC.utils;

  const TALK_MINUTES = 20;

  function addMinutes(hhmm, minutes) {
    const [h, m] = hhmm.split(':').map(Number);
    const total = h * 60 + m + minutes;
    return `${RC.utils.pad2(Math.floor(total / 60))}:${RC.utils.pad2(total % 60)}`;
  }

  function readSpeaker(id) {
    const card = document.querySelector(`[data-speaker-id="${CSS.escape(id)}"]`);
    if (!card) return null;
    const img = card.querySelector('img');
    return {
      id,
      name: card.dataset.speakerName,
      talk: card.dataset.speakerTalk,
      time: card.dataset.speakerTime,
      description: card.dataset.speakerDescription,
      photo: img ? img.getAttribute('src') : '',
    };
  }

  function init() {
    const modalEl = document.getElementById('speakerModal');
    if (!modalEl || !root.bootstrap) return;
    const modal = root.bootstrap.Modal.getOrCreateInstance(modalEl);
    const fields = {
      photo: modalEl.querySelector('[data-modal="photo"]'),
      name: modalEl.querySelector('[data-modal="name"]'),
      talk: modalEl.querySelector('[data-modal="talk"]'),
      time: modalEl.querySelector('[data-modal="time"]'),
      description: modalEl.querySelector('[data-modal="description"]'),
      agendaBtn: modalEl.querySelector('[data-modal="agenda"]'),
    };
    let currentId = null;
    let afterClose = null;

    function open(id) {
      const speaker = readSpeaker(id);
      if (!speaker) return;
      currentId = id;
      fields.photo.src = speaker.photo;
      fields.photo.alt = `Foto de ${speaker.name}`;
      fields.name.textContent = speaker.name;
      fields.talk.textContent = speaker.talk;
      fields.time.textContent = `Jueves 19/11 · ${speaker.time} a ${addMinutes(speaker.time, TALK_MINUTES)} hs · ${TALK_MINUTES} min`;
      fields.description.textContent = speaker.description;
      modal.show();
    }

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-open-speaker]');
      if (trigger) open(trigger.dataset.openSpeaker);
    });

    const scrollBehavior = () => (RC.utils.prefersReducedMotion() ? 'auto' : 'smooth');

    function closeThen(action) {
      afterClose = action;
      modal.hide();
    }

    fields.agendaBtn.addEventListener('click', () =>
      closeThen(() => {
        const row = document.querySelector(`[data-agenda-speaker="${CSS.escape(currentId)}"]`);
        if (!row) return;
        row.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
        replayAnimation(row, 'is-flash');
        const button = row.querySelector('button');
        if (button) button.focus({ preventScroll: true });
      })
    );

    modalEl.querySelectorAll('a[href^="#"]').forEach((link) =>
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        closeThen(() => target && target.scrollIntoView({ behavior: scrollBehavior() }));
      })
    );

    // Se actúa recién cuando el modal terminó de cerrarse: Bootstrap bloquea el scroll del body mientras está abierto.
    modalEl.addEventListener('hidden.bs.modal', () => {
      const action = afterClose;
      afterClose = null;
      if (action) action();
    });
  }

  RC.speakers = { init, addMinutes };
})(window);

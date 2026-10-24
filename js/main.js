/* Punto de entrada. Cada módulo se encarga de una sección y no hace nada si su sección no está en la página,
   así el mismo main.js sirve para index.html, 404.html y error-pago.html. */
(function (RC) {
  'use strict';

  // checkout va antes que countdown: tiene que escuchar "rc:earlybird-ended" si la fecha ya pasó al cargar.
  const modules = [
    RC.header,
    RC.reveal,
    RC.speakers,
    RC.carousel,
    RC.checkout,
    RC.countdown,
    RC.sponsorForm,
    RC.paymentError,
  ];

  function start() {
    modules.forEach((mod) => {
      if (!mod) return;
      try {
        mod.init();
      } catch (error) {
        // Un módulo roto no debe dejar sin funcionar al resto de la página.
        console.error(error);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window.RC);

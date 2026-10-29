
(function (RC) {
  'use strict';
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
        console.error(error);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window.RC);

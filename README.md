# code-in-progress

Landing del workshop **"¿Por dónde empiezo a programar?"** de Rolling Code School (proyecto educativo). Una página principal, una 404 y una página de error de pago. HTML, CSS y JavaScript vanilla, con Bootstrap 5.3 para grilla, offcanvas y modal.

## Estructura

```
index.html          Landing (header, hero, datos clave, speakers, agenda, sponsors, entradas, compra,
                    sumate como sponsor, ubicación, footer)
404.html            Página no encontrada
error-pago.html     Pago rechazado (lee plan y cantidad de la URL)
css/styles.css      Estilos y tokens de color
js/main.js          Punto de entrada: inicia cada módulo
js/modules/         Un módulo por responsabilidad (namespace window.RC)
  utils.js            formato de moneda, reduced motion, animaciones
  pricing.js          precios, cargo por servicio y cálculo del pedido
  validators.js       validadores y formateadores del formulario (funciones puras)
  form-validation.js  conecta los validadores con el DOM
  header.js           hamburguesa spin + menú offcanvas, sombra y link activo
  reveal.js           entrada al hacer scroll, contadores y barra de progreso
  speakers.js         modal de speaker y salto a la agenda
  carousel.js         carrusel de speakers en móvil (scroll-snap, flechas y puntos)
  countdown.js        contador Early Bird
  checkout.js         compra con total dinámico
  sponsor-form.js     "Sumate como Sponsor": validación, logo con vista previa y confirmación
  payment-error.js    resumen en error-pago.html
assets/             logo, iconos, speakers, 404
tests/              tests de la lógica pura
```

Los módulos son scripts clásicos (no ES modules) para que el sitio funcione abriendo `index.html` directo, sin servidor ni build.

## Cómo probar

- Abrí `index.html` en el navegador.
- **Pago aprobado:** cualquier tarjeta de 16 dígitos con vencimiento futuro y CVC de 3 o 4 dígitos.
- **Pago rechazado:** tarjeta `4000 0000 0000 0002` → redirige a `error-pago.html`.
- Tests de lógica (precios, validación, formato): `node --test tests/logic.test.js`

## Placeholders

El alias de transferencia, el email de contacto, los links de redes sociales y los logos de sponsors (recuadros con iniciales) son placeholders marcados con `<!-- PLACEHOLDER -->` en `index.html`.

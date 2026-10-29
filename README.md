# Workshop Rolling Code School

Landing page del workshop **“¿Por dónde empiezo a programar?”** de Rolling Code School. El sitio presenta el evento, sus speakers y agenda, e incluye información sobre entradas, ubicación y sponsors. También cuenta con páginas de error 404 y de pago rechazado.

## Tecnologías

- **HTML5** para la estructura y el contenido.
- **CSS3** para los estilos y el diseño adaptable.
- **JavaScript vanilla** organizado en módulos para las interacciones del sitio.
- **Bootstrap 5.3.8** para componentes y utilidades de interfaz; se carga desde CDN.
- **Plus Jakarta Sans** como tipografía, servida por Google Fonts.
- **Node.js y npm** para instalar las herramientas de desarrollo.
- **http-server** para servir el sitio localmente y **Playwright** como dependencia de pruebas end-to-end.

No se necesita compilar el proyecto: es un sitio estático.

## Instalación y ejecución local

1. Cloná el repositorio y entrá en la carpeta:

   ```bash
   git clone https://github.com/pabloig2026-cpu/code-in-progress.git
   cd code-in-progress
   ```

2. Instalá las dependencias de desarrollo:

   ```bash
   npm install
   ```

3. Iniciá el servidor local:

   ```bash
   npx http-server . -p 8080
   ```

4. Abrí [http://localhost:8080](http://localhost:8080) en el navegador.

## Estructura del proyecto

```text
index.html             Página principal del workshop
pages/
  404.html             Página no encontrada
  error-pago.html      Página de pago rechazado
style/
  styles.css           Estilos de la página principal y de pago
  404.css              Estilos de la página 404
js/
  main.js              Punto de entrada que inicializa los módulos
  modules/             Funcionalidades de navegación, speakers, compra,
                       formularios, validación y otros componentes
assets/                Logos, iconos e imágenes de speakers y errores
package.json           Dependencias y scripts de desarrollo
```

## Placeholders

El alias de transferencia, el email de contacto, los enlaces a redes sociales y los logos de sponsors son datos de ejemplo pendientes de reemplazo.

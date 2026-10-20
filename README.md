
# Pastelería Mil Sabores - Frontend React y Vite

Proyecto desarrollado para la evaluación DSY1104. Consiste en una aplicación web interactiva para una pastelería artesanal, implementando catálogo de productos, carrito de compras con persistencia local, pasarela de pago simulada con control de stock, panel de administración con operaciones CRUD, autenticación basada en roles y pruebas unitarias automatizadas.

---

## Tecnologías Utilizadas

* React 18
* Vite
* React Router DOM v6
* React Bootstrap y Bootstrap 5
* Vitest y React Testing Library
* Cobertura de código con @vitest/coverage-v8
* Web Storage API (localStorage para inventario, carrito y pedidos; sessionStorage para el estado de la sesión activa)

---

## Estructura del Proyecto

pasteleria-mil-sabores/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- NavbarPasteleria.jsx
|   |   `-- ProductCard.jsx
|   |-- data/
|   |   `-- productosIniciales.js
|   |-- tests/
|   |   |-- setup.js
|   |   |-- CarritoView.test.jsx
|   |   |-- NavbarPasteleria.test.jsx
|   |   `-- ProductCard.test.jsx
|   |-- views/
|   |   |-- AdminProductosView.jsx
|   |   |-- CarritoView.jsx
|   |   |-- CheckoutView.jsx
|   |   |-- LoginView.jsx
|   |   |-- ProductoDetalleView.jsx
|   |   |-- RegistroView.jsx
|   |   `-- TiendaView.jsx
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- vite.config.js
`-- package.json

---

## Credenciales de Acceso para Pruebas

Para revisar los flujos con distintos permisos, el sistema incluye dos cuentas de prueba:

* Administrador:
  * Correo: admin@milsabores.cl
  * Clave: admin123
  * Permisos: Acceso al catálogo, carrito y al panel de administración (/admin/productos) para crear, editar o eliminar tortas.

* Cliente:
  * Correo: cliente@milsabores.cl
  * Clave: 123456
  * Permisos: Navegación por catálogo, ver detalles, agregar al carrito y realizar checkout. La ruta de administración está restringida.

También se pueden registrar cuentas nuevas desde la interfaz, las cuales quedan con rol de cliente por defecto.

---

## Instalación y Ejecución Local

1. Clonar el repositorio:
   git clone https://github.com/FatZuack/fs2_04v_g7_Francisco_Salazar_Ev2.git
   cd pasteleria-mil-sabores

2. Instalar dependencias:
   npm install

3. Iniciar el servidor local:
   npm run dev

La app quedará disponible en http://localhost:5173/

---

## Ejecución de Pruebas Unitarias

Para correr la suite de pruebas unitarias:
npm run test:run

Para generar el reporte de cobertura de código:
npm run coverage

---

## Despliegue en AWS EC2

El archivo vite.config.js está preparado para responder peticiones externas configurando el host en 0.0.0.0 y puerto 5173.

Para compilar la versión optimizada de producción:
npm run build

Los archivos estáticos generados se almacenan en la carpeta /dist.
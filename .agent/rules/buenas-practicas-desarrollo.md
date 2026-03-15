---
trigger: always_on
---

Actúa como un Tech Lead y Desarrollador Full-Stack Senior. A partir de ahora, todas tus respuestas y generación de código para el proyecto "Antigravity" (una app web de resumen de noticias con Next.js, Node.js, Express y MongoDB) deben regirse estrictamente por las siguientes **Buenas Prácticas de Desarrollo en JavaScript**.

**REGLA DE ORO:** NO utilices TypeScript en absoluto. Todo el código debe ser JavaScript moderno (ES6+).

### 1. Estructura de Servicios Independientes
El proyecto se dividirá físicamente en dos directorios principales que funcionarán como servicios totalmente independientes:
* **/backend**: Contendrá la API REST (Node.js, Express, MongoDB). Correrá en su propio puerto (ej. 3001).
* **/frontend**: Contendrá la interfaz de usuario (Next.js). Correrá en su propio puerto (ej. 3000) y consumirá la información haciendo peticiones HTTP a las rutas del backend.

### 2. Estándares de Código y Documentación (JavaScript Puro)
* **Uso de JSDoc:** Dado que no usamos TypeScript, es OBLIGATORIO documentar todas las funciones, middlewares, modelos y componentes utilizando JSDoc. Define los tipos de parámetros (`@param`), valores de retorno (`@returns`) y estructuras de objetos (`@typedef`) para mantener la predictibilidad del código.
* **Sintaxis Moderna:** Utiliza siempre `const` y `let` (nunca `var`). Prioriza la desestructuración, *template literals*, *optional chaining* (`?.`) y *nullish coalescing* (`??`).
* **Asincronía:** Usa exclusivamente `async/await`. Prohibido el uso de `.then()/.catch()` a menos que sea estrictamente necesario. Envuelve las operaciones asíncronas en bloques `try/catch`.

### 3. Arquitectura del Backend (/backend)
* **Estructura de Carpetas:** Separa las responsabilidades estrictamente (MVC/Capas):
  * `/routes`: Solo definen los endpoints y llaman a los controladores.
  * `/controllers`: Manejan `req` y `res`. Extraen los datos y llaman a los servicios.
  * `/services`: Lógica de negocio y consultas a MongoDB.
  * `/models`: Definición de esquemas de Mongoose.
  * `/middlewares`: Funciones interceptoras (autenticación, manejo de errores).
* **CORS y Comunicación:** Es fundamental configurar el paquete `cors` en Express para permitir explícitamente las peticiones entrantes desde el dominio/puerto del frontend.
* **Manejo de Errores Global:** Implementa un middleware global de manejo de errores. Nunca devuelvas el *stack trace* en producción.

### 4. Arquitectura del Frontend (/frontend)
* **App Router:** Utiliza la convención del App Router de Next.js (`/app`).
* **Consumo de API:** Configura las peticiones para que utilicen variables de entorno (ej. `process.env.NEXT_PUBLIC_API_URL`) para definir la base URL del backend. Nunca dejes URLs de APIs "hardcodeadas" (quemadas) en los componentes.
* **Separación de "Client" y "Server":** Mantén la mayor parte de la aplicación como "Server Components" para optimizar el SEO. Usa la directiva `"use client"` únicamente en componentes que requieran interactividad (modales, `useState`, botones).
* **Componentes Modulares:** Escribe componentes funcionales pequeños. Para las tarjetas de noticias, asegúrate de implementar las 3 variantes solicitadas (`FeaturedCard`, `StandardCard`, `CompactCard`) para evitar la monotonía visual.
* **Rutas Absolutas:** Configura y utiliza *Path Aliases* en `jsconfig.json` (ej. `@/components`, `@/lib`).

### 5. Flujo de Trabajo y Entregables
* **Paso a paso:** Cuando te pida crear una nueva funcionalidad, no me des todo el código de golpe. Primero explica la lógica, luego dame el código del backend y finalmente el código del frontend.
* **Código limpio:** Antes de entregar cualquier código, asegúrate de que no haya `console.log` residuales, código comentado o variables sin usar.


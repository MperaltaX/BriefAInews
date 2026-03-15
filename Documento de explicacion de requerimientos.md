Actúa como un Desarrollador Full-Stack Senior experto en el stack MERN adaptado (Next.js, Express, Node.js, MongoDB) con un fuerte enfoque en UX/UI y SEO.
Tu objetivo es desarrollar una aplicación web de resumen de noticias. A continuación, detallo la arquitectura, la base de datos y los requerimientos de la interfaz. Por favor, genera el código paso a paso, empezando por el Backend y luego el Frontend.
1. Arquitectura y Stack Tecnológico
•	Frontend: Next.js (App Router preferiblemente) para optimizar el SEO, React, Tailwind CSS para los estilos, y Framer Motion (opcional) para animaciones sutiles.
•	Backend: Node.js con Express.
•	Base de Datos: MongoDB. La base de datos se llama sistema y la colección es scrap_news_content.
•	Seguridad: Implementa protección de rutas en el backend (ej. middleware de autenticación mediante JWT o API Keys para proteger los endpoints).
2. Estructura de Datos (MongoDB)
Los documentos tienen el siguiente formato. Crea los Modelos de Mongoose y las interfaces basados en esto:
JSON
{
  "_id": { "$oid": "69b15d92f37c64d432ff4c19" },
  "id_article": 1,
  "portal": "ambito",
  "title": "El petróleo vuelve a subir...",
  "ai_title": null,
  "content": "Los precios del crudo...",
  "ai_content": null,
  "excerpt": "El petróleo vuelve a subir en medio de la escalada...",
  "ai_excerpt": null,
  "url": "https://www.ambito.com/...",
  "image_url": "https://media.ambito.com/.../petroleo.jpg",
  "category": "Energía",
  "tags": ["Petróleo", "Medio Oriente"],
  "importance": 1,
  "country": "Argentina",
  "headline": true,
  "published_time": { "$date": "2026-03-11T08:35:00.000Z" }
}
3. Lógica de Negocio y Backend
•	Crea un endpoint GET /api/news que devuelva las noticias ordenadas por published_time de forma descendente (las más nuevas primero).
•	El endpoint debe aceptar parámetros de consulta (query params) para filtrar por el campo country. Los filtros necesarios son: Mundo, Argentina, Mexico, Brasil, Estados Unidos que pertenecen al campo "country".
4. Requerimientos del Frontend (Home Page)
Construye la página principal (/) que consuma la API.
•	Filtros de País: Un menú de navegación horizontal para filtrar por Mundo, Argentina, Mexico, Brasil, Estados Unidos.
•	Formato de Fecha (Tiempo Relativo): Crea una función utilitaria que convierta published_time a un formato de tiempo relativo (ej: "Hace 2 horas", "Hace 5 minutos").
•	Manejo de Imágenes (Edge Case Crítico): Crea una función normalizadora de imágenes. El campo image_url a veces es un string normal (ej: "https://..."), pero a veces es un objeto. La función debe verificar: si es string, devolverlo; si es objeto, intentar extraer image_url.imagenes[0]. Si falla, devolver una imagen de fallback por defecto.
5. Diseño UX/UI (Prevención de Monotonía)
En el directorio existe el archivo diseño_ux.webp para tomar como referencia. Para evitar que el usuario se aburra, la grilla de noticias debe ser asimétrica o tipo "Bento Grid". Crea 3 componentes de React diferentes para las tarjetas de noticias:
1.	FeaturedCard (Noticia Principal): Ocupa más espacio (ej. 2 columnas), muestra una imagen grande, el portal, el title y el excerpt visible directamente en la tarjeta.
2.	StandardCard (Noticia Estándar): Imagen mediana arriba, título y tiempo relativo. Al hacer clic en un botón de "Leer resumen", debe abrir un Modal que muestre el excerpt.
3.	CompactCard (Noticia en Lista): Solo texto o una miniatura muy pequeña a un lado. Muestra portal, title y tiempo relativo.
Utiliza Next.js para renderizar esta página (SSR o ISR) para asegurar que el contenido y los title de las noticias sean indexables por Google.
Para empezar: Por favor, escribe primero la configuración del servidor Express y el modelo de Mongoose (Backend).

Conexión a mongo DB mongodb+srv://digital:d3partament0BI@edn.szgrd.mongodb.net/5dias_web?retryWrites=true&w=majority

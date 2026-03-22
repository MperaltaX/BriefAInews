Proyecto: Red Social Universitaria (Estilo LinkedIn)
1. Arquitectura de Almacenamiento (Docker Local)
Para mantener un entorno local y de código abierto sin depender de servicios pagos en la nube, utilizaremos MongoDB para los datos y MinIO (compatible con la API de S3) para el almacenamiento de archivos multimedia.

El archivo docker-compose.yml incluye un script de inicialización para crear el bucket de imágenes automáticamente.

YAML
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: adminroot
      MINIO_ROOT_PASSWORD: 5diasedn
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

  minio-init:
    image: minio/mc
    depends_on:
      - minio
    entrypoint: >
      /bin/sh -c "
      /usr/bin/mc config host add myminio http://minio:9000 adminroot 5diasedn;
      /usr/bin/mc mb myminio/university-network;
      /usr/bin/mc anonymous set public myminio/university-network;
      exit 0;
      "

volumes:
  mongo_data:
  minio_data:
2. Estructura del Proyecto (Monorepo)
Se recomienda mantener frontend y backend en un mismo repositorio para facilitar el desarrollo local y despliegue conjunto.

Plaintext
/university-network
├── /backend                 # Node.js + Express
│   ├── /src
│   │   ├── /config          # Conexión a MongoDB y MinIO
│   │   ├── /controllers     # Lógica de rutas (User, Post, Feed)
│   │   ├── /middlewares     # Autenticación (JWT), Multer
│   │   ├── /models          # Esquemas de Mongoose
│   │   ├── /routes          # Definición de endpoints
│   │   ├── /services        # Algoritmos y lógica de negocio
│   │   └── index.js         # Punto de entrada
│   ├── package.json
│   └── .env
│
├── /frontend                # Next.js (App Router)
│   ├── /src
│   │   ├── /app             # Rutas (/, /profile, /feed, /article/[id])
│   │   ├── /components      # UI (Navbar, PostCard, CommentSection)
│   │   ├── /hooks           # Custom hooks (useAuth, useFeed)
│   │   ├── /lib             # Configuración Axios, utilidades
│   │   └── /store           # Estado global (Zustand/Redux)
│   ├── package.json
│   └── .env.local
│
└── docker-compose.yml       # Orquestación
3. Modelos de Base de Datos (Mongoose)
Colección: Users (models/subscriber.model.js)
Este modelo consolida la información personal, el historial académico/profesional, las conexiones de red y las preferencias de la plataforma.

JavaScript
const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // null = trabajo actual
  isCurrent: { type: Boolean, default: false },
  description: { type: String }
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  graduationYear: { type: Number },
  activities: { type: String }
});

const SubscriberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  coverImage: { type: String },
  tipo: { type: String, enum: ['estudiante', 'profesional'], default: 'estudiante' },
  
  // Datos Universitarios
  currentUniversity: { type: String },
  currentCareer: { type: String },
  
  // Historial
  education: [EducationSchema],
  experience: [ExperienceSchema],
  skills: [{ type: String }],
  
  // Networking
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connectionRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connectionRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Preferencias / Suscripción 5D
  tipo_suscripcion: { type: String, default: 'FREE' },
  fecha_fin_suscripcion: { type: Date },
  preferencia_de_pago: { type: String },
  newsletter: { type: Boolean, default: true },
  
  // Datos privados
  direccion: { type: String },
  fechaNacimiento: { type: Date },
  sexo: { type: String },
  telefonos: [{ type: String }]
}, { timestamps: true });

SubscriberSchema.index({ currentUniversity: 1, currentCareer: 1 });
module.exports = mongoose.model('User', SubscriberSchema);
Colección: Posts (models/post.model.js)
Soporta estados rápidos y artículos extensos.

JavaScript
const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['STATUS', 'ARTICLE'], default: 'STATUS' },
  content: { type: String },
  images: [{ type: String }],
  title: { type: String },
  coverImage: { type: String },
  htmlContent: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sharesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });
Colección: Comments (models/comment.model.js)
Separados del Post principal para evitar el límite de 16MB de MongoDB por documento.

JavaScript
const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
Colección: Notifications (models/notification.model.js)
JavaScript
const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['LIKE', 'COMMENT', 'CONNECTION_REQUEST', 'CONNECTION_ACCEPTED'] 
  },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });
4. Lógica del Backend
Gestión de Conexiones
Se necesitan endpoints específicos para gestionar el flujo bidireccional de la red:

Enviar Solicitud: POST /api/connections/request/:userId actualiza los arrays de envío/recepción y dispara una notificación al destinatario.

Aceptar Solicitud: POST /api/connections/accept/:userId mueve los IDs a los arrays de connections en ambos usuarios y notifica la aceptación.

Rechazar/Eliminar: POST /api/connections/remove/:userId limpia los IDs de los arrays correspondientes.

Algoritmo de Sugerencias
El endpoint /api/users/suggestions utilizará el Aggregation Framework de MongoDB para priorizar usuarios. Buscará perfiles con la misma currentUniversity o currentCareer que no existan actualmente en el array connections del usuario que realiza la consulta.

El Feed Paginado
El endpoint /api/posts/feed debe soportar paginación (mediante page y limit o cursor) para no saturar el servidor. Buscará los posts de los usuarios dentro del array connections, ordenados por createdAt de forma descendente, inyectando ocasionalmente contenido popular de la misma facultad.

Subida de Archivos
Se utilizará multer (memoria) en Express para recibir la imagen, y el SDK de MinIO para subir el buffer al contenedor de Docker. Se devolverá la URL pública generada al frontend para almacenarla en MongoDB.

5. Frontend (UI/UX)
La plataforma mantendrá la estética de estilos actual. La navegación principal tendrá íconos para Inicio, Mi Red, Notificaciones (con indicador rojo) y Ajustes de Perfil.

Sección Network (Feed Principal)
Se divide en tres columnas estratégicas:

Columna Izquierda: Identidad (20-25%)
Tarjeta de Mini-Perfil con foto de portada, foto redonda, nombre completo, titular académico ("Estudiante de 5to Semestre | Ingeniería Industrial | UBA") y métrica de contactos. Debajo, atajos rápidos a "Mis artículos", "Grupos de estudio" y "Elementos guardados".

Columna Central: Creación y Consumo (50%)
Caja blanca de creación en la parte superior con un input simulado atractivo y botones de acción rápida (Foto, Video, Artículo). Debajo, el Feed: una lista de tarjetas por publicación con cabecera (autor, carrera, tiempo), cuerpo del post (o título/portada si es artículo) y pie de interacción con contadores y botones grandes para Me gusta, Comentar y Compartir. Los comentarios se despliegan en estilo acordeón.

Columna Derecha: Descubrimiento (25-30%)
Módulo de "Compañeros sugeridos" mostrando de 3 a 5 perfiles recomendados por el algoritmo con un botón de "Conectar". Módulo inferior de "Tendencias en tu Facultad" listando hashtags o noticias destacadas para dinamizar la plataforma.

Pestaña "Mi Red"
Página dedicada a la gestión de contactos. Mostrará en la parte superior un panel con las solicitudes de conexión pendientes (recibidas y enviadas). Debajo, una cuadrícula amplia con sugerencias de usuarios de la misma universidad para fomentar el crecimiento de la red.

Perfil del Usuario
1. Perfil Público (El "Muro")
Cabecera destacada con foto, nombre y titular dinámico (cargo empresarial o estatus de estudiante con intereses). Sección "Sobre mí" con etiquetas visuales de intereses. Botón de acción principal para "Conectar". Debajo, un Timeline Vertical que renderice cronológicamente los arrays de experience y education, mostrando logos de instituciones, títulos y el cálculo del tiempo transcurrido.

2. Panel Privado (Ajustes de Cuenta)
Área transaccional dividida en pestañas:

Datos Personales: Formularios para editar dirección, fecha de nacimiento, sexo y teléfonos (datos ocultos por defecto).

Suscripción 5D: Muestra el estado actual, fecha de vencimiento y preferencia de pago.

Preferencias: Control de notificaciones y un interruptor para activar/desactivar el newsletter universitario.
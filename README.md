# 🎮 Games Tracker — Frontend

Cliente web para el proyecto Games Tracker. Construido con HTML, CSS y JavaScript vanilla usando `fetch()` para consumir la API REST.

## 🔗 Links
- **Backend repo**: https://github.com/Ju4nD4nielO/Proyecto1-Backend
- **App en producción**: https://games-tracker-front2.onrender.com/

## 🛠 Tech Stack
- HTML5
- CSS3 (variables, grid, flexbox)
- JavaScript vanilla con `fetch()`
- Nginx (para Docker)

## ⚙️ Correr localmente

### Opción 1 — Live Server (VS Code)
1. Abre la carpeta del proyecto en VS Code
2. Instala la extensión **Live Server**
3. Haz clic derecho en **Open with Live Server**
4. Asegúrate de que el backend esté corriendo en `http://localhost:3000`

### Opción 2 — Docker
```bash
docker compose up --build
```
El frontend queda disponible en `http://localhost:8080`.

> El backend debe estar corriendo por separado para que la app funcione.


## 🌐 CORS
El cliente consume la API en `http://localhost:3000`. CORS está habilitado en el servidor para permitir peticiones desde cualquier origen, ya que cliente y servidor corren en puertos distintos (orígenes distintos según la política del navegador).

## ✨ Funcionalidades
- Ver todos los juegos en un grid de cards
- Agregar juegos nuevos con título, género, plataforma, estado, horas jugadas, imagen y notas
- Editar juegos existentes
- Eliminar juegos con confirmación
- Stats en tiempo real (total, playing, completed, plan to play)
- Estados: Plan to Play, Playing, Completed, On Hold, Dropped

## ✅ Challenges implementados
- JavaScript vanilla puro, sin librerías ni frameworks
- `fetch()` nativo para todas las operaciones CRUD
- Manejo de errores con mensajes toast
- Soporte para imagen via URL
- Docker con Nginx

## 💭 Reflexión
Fue desafiante trabajar con el manejo del DOM y los estados de la UI. Entender cómo funciona todo por debajo sin abstracciones fue muy valioso. Lo haría de nuevo para proyectos pequeños donde el bundle size importa, pero para algo más grande definitivamente usaría un framework.

# --- ETAPA 1: COMPILAR REACT ---
FROM node:20 as build-stage
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- ETAPA 2: SERVIDOR DJANGO ---
FROM python:3.11-slim
WORKDIR /app

# Instalar FFmpeg (Lo que le faltaba a tu herramienta)
RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6 && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn whitenoise

COPY backend/ .
# Inyectar el frontend compilado en los estáticos de Django
COPY --from=build-stage /frontend/dist /app/static_root

ENV PORT 8080
CMD ["gunicorn", "--bind", ":8080", "--workers", "2", "config.wsgi:application"]
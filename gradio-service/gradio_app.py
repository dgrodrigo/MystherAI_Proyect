# Entrypoint para Gunicorn + uvicorn workers
# Uso: gunicorn gradio_app:app -k uvicorn.workers.UvicornWorker -w 1 -b 0.0.0.0:7860
#
# Requiere en el entorno:
#   WAVESPEED_API_KEY=wsk_live_...
#   BACKEND_URL=https://tu-backend.run.app   (opcional, default localhost:8000)

from app import demo   # Importa el gr.Blocks SIN llamar .launch()

app = demo.app         # FastAPI/ASGI app que Gunicorn sirve

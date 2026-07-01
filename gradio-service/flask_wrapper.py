# Flask wrapper para Gunicorn WSGI clasico
# El jefe puede arrancar esto con:
#   gunicorn flask_wrapper:app -w 1 -b 0.0.0.0:5000
# y Nginx redirige al puerto 7860 donde corre Gradio.
#
# Variables de entorno necesarias:
#   WAVESPEED_API_KEY=wsk_live_...
#   BACKEND_URL=https://tu-backend.run.app

import os
import threading
import time
from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/health")
def health():
    return jsonify({"status": "ok", "gradio_port": 7860})


def _start_gradio():
    # Pequeña pausa para que Flask arranque primero
    time.sleep(3)
    from app import demo
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        prevent_thread_lock=True,
        quiet=True,
    )


# Gradio arranca en un hilo daemon al importar este módulo
# (Gunicorn importa el módulo, así que Gradio se inicia automáticamente)
_gradio_thread = threading.Thread(target=_start_gradio, daemon=True)
_gradio_thread.start()


if __name__ == "__main__":
    # Para desarrollo local: python flask_wrapper.py
    app.run(port=5000, debug=False, use_reloader=False)

import os
import requests
import cv2
import wavespeed
import gradio as gr
import datetime
import subprocess
import re
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
MY_KEY = "wsk_live_jotbLBG3MeaiXaTNBg5adM0tL6SeS2SAzPwDx3-sB2s" 
os.environ["WAVESPEED_API_KEY"] = MY_KEY
cl = wavespeed.Client(api_key=MY_KEY)

# Configuración de rutas
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RUTAS = {k: os.path.join(BASE_DIR, "outputs", v) for k, v in {
    "cap": "01_CAPTURAS", "est": "02_ESTILIZADOS", "vid": "03_VIDEOS_FINALES", "trans": "04_TRANSFORMACIONES"
}.items()}
for c in RUTAS.values(): os.makedirs(c, exist_ok=True)

# --- FUNCIONES DE APOYO ---
def clean_drive_url(url):
    if not url or "drive.google.com" not in str(url): return url
    match = re.search(r'(?:file\/d\/|id=|\/d\/)([-\w]{25,})', str(url))
    return f"https://drive.google.com/uc?export=download&id={match.group(1)}" if match else url

def preparar_y_subir(ruta):
    if not str(ruta).startswith("http"):
        ruta_abs = os.path.abspath(ruta) if not os.path.isabs(ruta) else ruta
        return cl.upload(ruta_abs)
    return clean_drive_url(ruta)

def llamar_api(modelo, prompt, entrada, duracion=5, imaginacion=5):
    input_ready = preparar_y_subir(entrada)
    g_scale = 1.5 + (float(imaginacion) / 10.0) * (12.0 - 1.5)
    f_strength = 0.20 + (float(imaginacion) / 10.0) * (0.80 - 0.20)
    try:
        if modelo == "estilo_img":
            res = cl.run("wavespeed-ai/z-image/turbo", {"image": input_ready, "prompt": prompt, "strength": f_strength, "guidance_scale": g_scale})
        elif modelo == "video_to_video":
            res = cl.run("wavespeed-ai/wan-2.1/v2v-720p", {"video": input_ready, "prompt": prompt, "strength": f_strength, "duration": int(duracion)})
        else:
            res = cl.run("kwaivgi/kling-v3.0-std/image-to-video", {"image": input_ready, "prompt": prompt, "duration": int(duracion)})
        out = res.get("outputs")
        return out[0] if isinstance(out, list) else out
    except Exception as e: raise gr.Error(f"API Error: {e}")

def enviar_final_web(v_id, user, resp, estilo, p_img, l_img, p_vid, l_vid, l_orig):
    payload = {
        "video_id": v_id, "usuario": user, "mateo_miguel": resp, "estilizado": estilo,
        "prompt_imagen": p_img, "imagen_link": l_img, "prompt_video": p_vid,
        "drive_link": l_vid, "video_original_link": l_orig, "tipo": "registro"
    }
    try:
        r = requests.post("http://localhost:8000/api/sheets/videos/", json=payload, timeout=10)
        return "✅ REGISTRO EXITOSO EN DASHBOARD" if r.status_code == 201 else f"❌ Error DB: {r.text}"
    except Exception as e: return f"❌ Error conexión: {e}"

# --- INTERFAZ ---
with gr.Blocks(title="WaveSpeed Pro", theme=gr.themes.Soft(primary_hue="orange")) as demo:
    # MOCHILA DE DATOS (STATES)
    s_prompt_img = gr.State(""); s_link_img = gr.State("")
    s_prompt_vid = gr.State(""); s_link_vid = gr.State("")
    s_video_orig = gr.State("")

    gr.Markdown("# 🌊 WaveSpeed Pro Workflow - Lead Console")

    with gr.Tab("1. Selector"):
        v_in = gr.Textbox(label="URL Video Original")
        v_in.change(lambda x: x, v_in, s_video_orig)
        # (Aquí irían tus funciones de snap/analizar originales)

    with gr.Tab("2. Estilo Imagen"):
        i_in2 = gr.Textbox(label="URL Imagen Base"); p_est = gr.Textbox(label="Prompt de Estilo")
        imag_est = gr.Slider(0, 10, value=4, label="🧠 Imaginación"); u_res2 = gr.Textbox(label="URL Resultado")
        with gr.Row():
            btn_gen = gr.Button("🎨 GENERAR IMAGEN", variant="primary")
            btn_to_6 = gr.Button("📥 AÑADIR DATOS A PESTAÑA 6", variant="secondary")
        
        btn_gen.click(llamar_api, [gr.State("estilo_img"), p_est, i_in2, gr.State(5), gr.State(0), imag_est], u_res2)
        # Al pulsar el botón naranja, guardamos en la mochila
        btn_to_6.click(lambda p, l: (p, l, "✅ Datos de Imagen listos para Registro"), [p_est, u_res2], [s_prompt_img, s_link_img, gr.Textbox(label="Status", value="Esperando...")])

    with gr.Tab("4. Kling v3.0"):
        u_in4 = gr.Textbox(label="URL Imagen"); p_vid = gr.Textbox(label="Prompt Movimiento")
        u_res4 = gr.Textbox(label="URL Resultado")
        with gr.Row():
            btn_gen4 = gr.Button("🎥 GENERAR VIDEO LARGO", variant="primary")
            btn_to_6_v = gr.Button("📥 AÑADIR DATOS A PESTAÑA 6", variant="secondary")
        
        btn_gen4.click(llamar_api, [gr.State("kling_v3"), p_vid, u_in4], u_res4)
        btn_to_6_v.click(lambda p, l: (p, l, "✅ Datos de Video listos para Registro"), [p_vid, u_res4], [s_prompt_vid, s_link_vid, gr.Textbox(label="Status", value="Esperando...")])

    with gr.Tab("6. REGISTRO WEB"):
        gr.Markdown("### 📋 Consolidación y Envío a Hechicer.ia")
        with gr.Row():
            miembro = gr.Textbox(label="Miembro", value="Mateo")
            v_id = gr.Textbox(label="ID del Video")
            responsable = gr.Dropdown(["Mateo", "Miguel"], label="Responsable", value="Mateo")
            estilo_final = gr.Textbox(label="Estilo", value="Anime")
        
        gr.Markdown("---")
        gr.Markdown("#### 📝 EDITAR DATOS ANTES DE SUBIR")
        with gr.Row():
            edit_p_img = gr.Textbox(label="Prompt Imagen (Editable)")
            edit_l_img = gr.Textbox(label="Link Imagen (Editable)")
        with gr.Row():
            edit_p_vid = gr.Textbox(label="Prompt Video (Editable)")
            edit_l_vid = gr.Textbox(label="Link Video Final (Editable)")
        edit_orig = gr.Textbox(label="Video Original (Censo)")

        btn_rev = gr.Button("🔍 1. CARGAR/REVISAR DATOS DE PESTAÑAS", variant="secondary")
        
        # Esta función baja los datos de la "mochila" a los cuadros editables
        def cargar_mochila(pi, li, pv, lv, lo):
            return pi, li, pv, lv, lo
        
        btn_rev.click(cargar_mochila, [s_prompt_img, s_link_img, s_prompt_vid, s_link_vid, s_video_orig], 
                      [edit_p_img, edit_l_img, edit_p_vid, edit_l_vid, edit_orig])

        btn_send = gr.Button("🚀 2. CONFIRMAR Y GUARDAR EN WEB", variant="primary")
        status_web = gr.Textbox(label="Estado del envío")
        
        # El envío final usa los campos EDITABLES, por si el usuario cambió algo
        btn_send.click(enviar_final_web, 
            [v_id, miembro, responsable, estilo_final, edit_p_img, edit_l_img, edit_p_vid, edit_l_vid, edit_orig], 
            status_web)

demo.launch(server_name="0.0.0.0", server_port=7860)

import os
import cv2
import datetime
import subprocess
from pathlib import Path

import gradio as gr
import requests
import wavespeed
from dotenv import load_dotenv

# ==========================================
# 1. CARGA DE ENTORNO Y CLIENTE WAVESPEED
# ==========================================
load_dotenv()
MY_KEY = os.getenv("WAVESPEED_API_KEY", "").strip()
if not MY_KEY:
    print("⚠️ WAVESPEED_API_KEY no está configurada en .env")
cl = wavespeed.Client(api_key=MY_KEY) if MY_KEY else None

# ==========================================
# 2. CARPETAS LOCALES
# ==========================================
BASE = "outputs"
RUTAS = {
    "cap": os.path.join(BASE, "01_CAPTURAS"),
    "est": os.path.join(BASE, "02_ESTILIZADOS"),
    "vid": os.path.join(BASE, "03_VIDEOS_FINALES"),
    "trans": os.path.join(BASE, "04_TRANSFORMACIONES"),
}
for ruta in RUTAS.values():
    os.makedirs(ruta, exist_ok=True)
os.makedirs(os.path.join(BASE, "temp"), exist_ok=True)

# ==========================================
# 3. FUNCIONES DE SOPORTE
# ==========================================

def salvar(url, tipo, prefijo, ext, nombre_usuario="", prompt="", estilo="", miembro=""):
    url_limpia = str(url).replace("[", "").replace("]", "").replace("'", "").replace('"', "").strip()
    if not url_limpia or not url_limpia.startswith("http"):
        return "⚠️ URL no válida."
    try:
        nombre = f"{nombre_usuario.strip()}.{ext}" if nombre_usuario else f"{prefijo}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.{ext}"
        ruta_final = os.path.join(RUTAS[tipo], nombre)
        res = requests.get(url_limpia, timeout=60)
        
        if res.status_code == 200:
            with open(ruta_final, 'wb') as f:
                f.write(res.content)
            
            # --- CONEXIÓN CON DJANGO ---
            # Si es un video final (tipo 'vid'), lo registramos en la web automáticamente
            if tipo == "vid":
                registrar_resultado_en_web(
                    video_id=nombre.split('.')[0], 
                    usuario=miembro or "Mateo", 
                    drive_link=url_limpia, # Aquí irá el link de Drive real en el futuro
                    prompt=prompt, 
                    estilo=estilo
                )
            return f"✅ Guardado en local y registrado en la Web."
        return f"❌ Error descarga: {res.status_code}"
    except Exception as e:
        return f"❌ Error: {str(e)}"


def analizar(path):
    if not path or not os.path.exists(path):
        return gr.update(maximum=100), "❌ Video no encontrado"
    cap = cv2.VideoCapture(path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()
    return gr.update(maximum=max(0, total - 1)), f"Frames totales: {total}"


def snap(path, idx, modo, nombre=""):
    if not path or not os.path.exists(path):
        return None, "Ruta vacía"
    cap = cv2.VideoCapture(path)
    cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        return None, "Error de lectura"
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    if modo == "Ver":
        return rgb, "Preview lista"
    # Guardar captura
    nombre_archivo = f"{nombre or 'cap'}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    ruta = os.path.join(RUTAS["cap"], nombre_archivo)
    cv2.imwrite(ruta, frame)
    return rgb, ruta


def _sec_from_mmss(t):
    if isinstance(t, (int, float)):
        return float(t)
    if ":" in str(t):
        parts = list(map(float, str(t).split(":")))
        return parts[0] * 60 + parts[1]
    return float(t)


def cortar_segmento(ruta, inicio, fin, nombre_salida):
    if not ruta or not os.path.exists(ruta):
        return "❌ Video origen no encontrado."
    inicio_s = _sec_from_mmss(inicio)
    fin_s = _sec_from_mmss(fin)
    if fin_s <= inicio_s:
        return "❌ Fin debe ser mayor que inicio."
    os.makedirs(RUTAS["vid"], exist_ok=True)
    nombre = (nombre_salida.strip() + ".mp4") if nombre_salida and nombre_salida.strip() else f"cut_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
    salida = os.path.join(RUTAS["vid"], nombre)
    cmd = ["ffmpeg", "-y", "-ss", str(inicio_s), "-to", str(fin_s), "-i", ruta, "-c", "copy", salida]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return salida
    except subprocess.CalledProcessError as e:
        return f"❌ Error ffmpeg: {e.stderr.decode('utf-8')[:400]}"


def unir_videos(lista_rutas, nombre_salida):
    if not lista_rutas or not any(lista_rutas):
        return "❌ No hay segmentos para unir."
    tmp_list = os.path.join(BASE, "temp", "concat_list.txt")
    with open(tmp_list, "w") as f:
        for p in lista_rutas:
            if p and os.path.exists(p):
                f.write(f"file '{p}'\n")
            else:
                return f"❌ Archivo no encontrado: {p}"
    nombre = (nombre_salida.strip() + ".mp4") if nombre_salida and nombre_salida.strip() else f"merged_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
    salida = os.path.join(RUTAS["vid"], nombre)
    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", tmp_list, "-c", "copy", salida]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return salida
    except subprocess.CalledProcessError as e:
        return f"❌ Error ffmpeg: {e.stderr.decode('utf-8')[:400]}"


def preparar_y_subir_imagen(ruta_local):
    """
    En Colab subías a WaveSpeed desde /content; aquí asumimos que:
    - Si es URL http, la usamos directamente
    - Si es ruta local, la leemos y la subimos con cl.upload
    """
    if ruta_local.startswith("http"):
        return ruta_local
    if not os.path.exists(ruta_local):
        raise FileNotFoundError(f"No existe el archivo: {ruta_local}")
    img = cv2.imread(ruta_local)
    if img is None:
        raise ValueError(f"No es una imagen válida: {ruta_local}")
    ruta_temp = os.path.join(BASE, "temp", "kling_upload_ready.jpg")
    cv2.imwrite(ruta_temp, img, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
    if not cl:
        raise RuntimeError("Cliente WaveSpeed no configurado (WAVESPEED_API_KEY faltante).")
    return cl.upload(ruta_temp)


def llamar_api(modelo, prompt, entrada, duracion=5, texto_referencias="", imaginacion=5):
    if not cl:
        return "❌ Cliente WaveSpeed no configurado (WAVESPEED_API_KEY)."
    if not entrada:
        return "❌ Falta origen (Ruta o URL)"
    val = str(entrada).strip().replace("[", "").replace("]", "").replace("'", "").replace('"', "")

    # Mapeo Imaginación
    g_scale = 1.5 + (float(imaginacion) / 10.0) * (12.0 - 1.5)
    f_strength = 0.20 + (float(imaginacion) / 10.0) * (0.80 - 0.20)

    urls_referencia = []
    if texto_referencias and texto_referencias.strip():
        rutas_lista = [r.strip().replace("[", "").replace("]", "").replace("'", "").replace('"', "") for r in texto_referencias.split("\n") if r.strip()]
        for ruta_img in rutas_lista:
            try:
                url_subida = preparar_y_subir_imagen(ruta_img)
                urls_referencia.append(url_subida)
            except:
                pass

    try:
        if modelo == "estilo_img":
            img_url = preparar_y_subir_imagen(val)
            payload = {
                "image": img_url,
                "prompt": prompt,
                "strength": f_strength,
                "guidance_scale": g_scale,
                "num_inference_steps": 30,
            }
            res = cl.run("wavespeed-ai/z-image/turbo", payload)
        elif modelo == "video_to_video":
            vid_url = cl.upload(val) if not val.startswith("http") else val
            payload = {
                "video": vid_url,
                "prompt": prompt,
                "strength": f_strength,
                "resolution": "720p",
                "duration": int(duracion),
                "guidance_scale": g_scale,
            }
            if urls_referencia:
                payload["ref_images"] = urls_referencia
            res = cl.run("wavespeed-ai/wan-2.1/v2v-720p", payload)
        else:  # kling_v3
            img_url_kling = preparar_y_subir_imagen(val)
            payload = {
                "image": img_url_kling,
                "prompt": prompt,
                "duration": int(duracion),
                "mode": "high_quality",
                "guidance_scale": g_scale,
            }
            if urls_referencia:
                payload["ref_images"] = urls_referencia
            res = cl.run("kwaivgi/kling-v3.0-std/image-to-video", payload)

        final_url = res.get("outputs")
        if isinstance(final_url, list):
            final_url = final_url[0]
        return final_url
    except Exception as e:
        return f"❌ Fallo API: {str(e)}"


# ==========================================
# 4. INTERFAZ GRADIO (RÉPLICA SIMPLIFICADA)
# ==========================================

with gr.Blocks(title="WaveSpeed Pro", theme=gr.themes.Soft(primary_hue="orange")) as demo:
    gr.Markdown("# 🌊 WaveSpeed Pro Workflow - Hechicer.ia")

    # TAB 1 - Selector
    with gr.Tab("1. Selector"):
        v_in = gr.Textbox(label="Ruta Video (local)")
        sli = gr.Slider(0, 100, label="Frame")
        n_cap = gr.Textbox(label="Nombre Captura")
        info = gr.Markdown()
        v_in.change(analizar, v_in, [sli, info])
        pre_f = gr.Image(label="Preview", height=300)
        res_ruta = gr.Textbox(label="Ruta capturada para Paso 2")

        btn_ver = gr.Button("🔍 Ver")
        btn_cap = gr.Button("📸 CAPTURAR", variant="primary")

        btn_ver.click(snap, [v_in, sli, gr.State("Ver"), gr.State("")], [pre_f, info])
        btn_cap.click(snap, [v_in, sli, gr.State("CAP"), n_cap], [pre_f, res_ruta])

    # TAB 2 - Estilo Imagen
    with gr.Tab("2. Estilo Imagen"):
        i_in = gr.Textbox(label="Ruta de Imagen (o ruta del Paso 1)")
        p_est = gr.Textbox(label="Prompt de Estilo")
        imag_est = gr.Slider(0, 10, value=4, step=0.1, label="🧠 Imaginación")
        u_est = gr.Textbox(label="URL Resultado")
        pre_est = gr.Image(height=300)

        btn_gen_img = gr.Button("🎨 GENERAR IMAGEN", variant="primary")
        btn_gen_img.click(
            llamar_api,
            [gr.State("estilo_img"), p_est, i_in, gr.State(5), gr.State(""), imag_est],
            u_est
        ).then(lambda x: x, u_est, pre_est)

        name_est = gr.Textbox(label="Nombre de salida (opcional)")
        out_save_est = gr.Textbox()
        btn_save_est = gr.Button("💾 GUARDAR")
        btn_save_est.click(
            salvar,
            [u_est, gr.State("est"), gr.State("estilo"), gr.State("png"), name_est],
            out_save_est
        )

    # TAB 3 - Video to Video
    with gr.Tab("3. Video-to-Video"):
        v_vid_in = gr.Textbox(label="Ruta Video local")
        p_trans = gr.Textbox(label="Prompt de Transformación")
        dur_trans = gr.Slider(5, 10, value=10, label="Duración (segundos)")
        imag_trans = gr.Slider(0, 10, value=4, step=0.1, label="🧠 Imaginación")
        ref_trans = gr.Textbox(
            label="Rutas de imágenes de referencia (una por línea)",
            lines=3
        )
        u_trans = gr.Textbox(label="URL Video Estilizado")
        pre_trans = gr.Video()

        btn_trans = gr.Button("🪄 TRANSFORMAR", variant="primary")
        btn_trans.click(
            llamar_api,
            [gr.State("video_to_video"), p_trans, v_vid_in, dur_trans, ref_trans, imag_trans],
            u_trans
        ).then(lambda x: x, u_trans, pre_trans)

        name_trans = gr.Textbox(label="Nombre de salida (opcional)")
        out_save_trans = gr.Textbox()
        btn_save_trans = gr.Button("💾 GUARDAR")
        btn_save_trans.click(
            salvar,
            [u_trans, gr.State("trans"), gr.State("trans"), gr.State("mp4"), name_trans],
            out_save_trans
        )

    # TAB 4 - Kling v3.0
    with gr.Tab("4. Kling v3.0 Standard"):
        u_in = gr.Textbox(label="Ruta original (imagen local o URL)")
        p_vid = gr.Textbox(label="Prompt de Movimiento")
        dur_kling = gr.Slider(3, 10, value=10, label="Duración (segundos)")
        imag_kling = gr.Slider(0, 10, value=5, step=0.1, label="🧠 Imaginación")
        ref_kling = gr.Textbox(
            label="Rutas de imágenes de referencia (una por línea - opcional)",
            lines=3
        )
        u_res = gr.Textbox(label="Enlace de Video Final")
        pre_vid = gr.Video()

        btn_v_fin = gr.Button("🎥 GENERAR VIDEO LARGO", variant="primary")
        btn_v_fin.click(
            llamar_api,
            [gr.State("kling_v3"), p_vid, u_in, dur_kling, ref_kling, imag_kling],
            u_res
        ).then(lambda x: x, u_res, pre_vid)

        name_kling = gr.Textbox(label="Nombre de salida (opcional)")
        out_save_kling = gr.Textbox()
        btn_save_kling = gr.Button("💾 GUARDAR FINAL")
        btn_save_kling.click(
            salvar,
            [u_res, gr.State("vid"), gr.State("final"), gr.State("mp4"), name_kling, p_vid, gr.State("Kling v3.0"), gr.State("Mateo")],
            out_save_kling
        )

    # TAB 5 - Cortar / Unir
    with gr.Tab("5. Cortar/Unir"):
        src_v = gr.Textbox(label="Ruta Video Origen")
        pre_v = gr.Video(label="Preview Origen")
        src_v.change(lambda p: p, src_v, pre_v)

        gr.Markdown("## Cortar un segmento")
        with gr.Row():
            inicio = gr.Textbox(label="Inicio (seg o mm:ss)", value="0")
            fin = gr.Textbox(label="Fin (seg o mm:ss)", value="5")
            nombre_cut = gr.Textbox(label="Nombre salida (opcional)")
        out_cut = gr.Textbox(label="Ruta generado")
        btn_cut = gr.Button("✂️ Cortar Segmento", variant="primary")
        btn_cut.click(cortar_segmento, [src_v, inicio, fin, nombre_cut], out_cut)

        gr.Markdown("## Unir videos")
        seg1 = gr.Textbox(label="Ruta Parte 1")
        seg2 = gr.Textbox(label="Ruta Parte 2 (opcional)")
        seg3 = gr.Textbox(label="Ruta Parte 3 (opcional)")
        name_merge = gr.Textbox(label="Nombre archivo unificado (opcional)")
        out_merge = gr.Textbox(label="Ruta Unificado")

        def unir_wrapper(a, b, c, name):
            inputs = [x for x in [a, b, c] if x and x.strip()]
            return unir_videos(inputs, name)

        btn_merge = gr.Button("🔗 Unir Seleccionados", variant="primary")
        btn_merge.click(unir_wrapper, [seg1, seg2, seg3, name_merge], out_merge)

        gr.Markdown("Los archivos se guardan en '03_VIDEOS_FINALES' dentro de 'outputs'.")

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)

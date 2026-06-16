import os, requests, wavespeed, gradio as gr, re
from dotenv import load_dotenv

MY_KEY = "dd196208318710edede5cd994e7c4be8d51ee994fe1e49fbdd5295b417d6a50d"
cl = wavespeed.Client(api_key=MY_KEY)

def registrar_en_web(v_id, user, link, p_img, p_vid, estilo, resp, orig):
    payload = {
        "video_id": v_id, "usuario": user, "mateo_miguel": resp, "drive_link": link,
        "prompt_imagen": p_img, "prompt_video": p_vid, "estilizado": estilo,
        "video_original_link": orig, "tipo": "registro"
    }
    r = requests.post("http://localhost:8000/api/sheets/videos/", json=payload)
    return "✅ GUARDADO EN WEB"

def llamar_api(modelo, prompt, entrada):
    try:
        # Convertir Drive a Direct Link para la IA
        url_in = entrada
        if "drive.google.com" in entrada:
            id = re.search(r'[-\w]{25,}', entrada).group(0)
            url_in = f"https://drive.google.com/uc?export=download&id={id}"
        
        if modelo == "estilo_img": res = cl.run("wavespeed-ai/z-image/turbo", {"image": url_in, "prompt": prompt})
        else: res = cl.run("kwaivgi/kling-v3.0-std/image-to-video", {"image": url_in, "prompt": prompt})
        
        return res["outputs"][0]
    except Exception as e: raise gr.Error(f"Error WaveSpeed: {e}")

with gr.Blocks(theme=gr.themes.Soft(primary_hue="orange")) as demo:
    m_p_i = gr.State(""); m_l_i = gr.State(""); m_p_v = gr.State(""); m_l_v = gr.State(""); m_o = gr.State("")
    
    with gr.Tab("1. Selector"):
        v_orig = gr.Textbox(label="Link Drive Censo"); v_orig.change(lambda x: x, v_orig, m_o)
    with gr.Tab("2. Estilo Imagen"):
        p_i = gr.Textbox(label="Prompt Letras"); btn_i = gr.Button("GENERAR")
        u_i = gr.Textbox(); pre_i = gr.Image()
        btn_i.click(llamar_api, [gr.State("estilo_img"), p_i, m_o], u_i).then(lambda p,u: (p,u), [p_i, u_i], [m_p_i, m_l_i]).then(lambda x:x, u_i, pre_i)
    with gr.Tab("4. Kling v3.0"):
        p_v = gr.Textbox(label="Prompt Movimiento"); btn_v = gr.Button("GENERAR VIDEO")
        u_v = gr.Textbox(); pre_v = gr.Video()
        btn_v.click(llamar_api, [gr.State("kling"), p_v, m_l_i], u_v).then(lambda p,u: (p,u), [p_v, u_v], [m_p_v, m_l_v]).then(lambda x:x, u_v, pre_v)
    with gr.Tab("6. REGISTRO"):
        v_id = gr.Textbox(label="ID Video"); user = gr.Textbox(label="Tu Nombre", value="Mateo")
        btn_s = gr.Button("🚀 SUBIR A WEB")
        btn_s.click(registrar_en_web, [v_id, user, m_l_v, m_p_i, m_p_v, gr.State("Anime"), gr.State("Mateo"), m_o], gr.Textbox())

demo.launch(server_name="0.0.0.0", server_port=7860)

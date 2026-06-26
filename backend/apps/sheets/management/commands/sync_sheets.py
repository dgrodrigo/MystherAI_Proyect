import csv, os
from django.core.management.base import BaseCommand
from apps.sheets.models import VideoMetadata

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        VideoMetadata.objects.all().delete()
        self.stdout.write("Limpiando y Re-importando datos reales...")

        def get_v(row, *keys):
            for k in keys:
                for rk, rv in row.items():
                    if rk and rk.lower().strip() == k.lower().strip():
                        return rv.strip()
            return ""

        # --- IMPORTAR REGISTRO ---
        registro_path = 'registro.csv'
        if os.path.exists(registro_path):
            with open(registro_path, mode='r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    v_id = get_v(row, 'Id')
                    if not v_id: continue
                    VideoMetadata.objects.create(
                        video_id=v_id, tipo='registro',
                        usuario=get_v(row, 'Miembro'),
                        mateo_miguel=get_v(row, 'Mateo/Miguel'),
                        estilizado=get_v(row, 'Estilizado'),
                        prompt_imagen=get_v(row, 'Prompt imagen'),
                        imagen_link=get_v(row, 'imagen'),
                        prompt_video=get_v(row, 'prompt video'),
                        drive_link=get_v(row, 'video'),
                        video_original_link=get_v(row, 'video orginal', 'video original'),
                        aceptado=get_v(row, 'ACEPTADO'),
                        prompt_final=get_v(row, 'Prompt Final'),
                    )
            self.stdout.write("✅ Registro importado con éxito.")
        else: self.stdout.write("❌ No se encontró registro.csv")

        # --- IMPORTAR CENSO ---
        censo_path = 'censo.csv'
        if os.path.exists(censo_path):
            with open(censo_path, mode='r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    v_id = get_v(row, 'ID DE VIDEO')
                    if not v_id: continue
                    VideoMetadata.objects.create(
                        video_id=v_id, tipo='censo',
                        usuario=get_v(row, 'usuario'),
                        id_video_equipo=get_v(row, 'ID DE VIDEO EQUIPO'),
                        drive_link=get_v(row, 'LINK'),
                        mapa=get_v(row, 'MAPA'),
                        genero=get_v(row, 'GENERO'),
                        etnia=get_v(row, 'ETNIA'),
                        duracion=get_v(row, 'DURACION'),
                        camara=get_v(row, 'CAMARA'),
                        especie=get_v(row, 'ESPECIE'),
                    )
            self.stdout.write("✅ Censo importado con éxito.")
        else: self.stdout.write("❌ No se encontró censo.csv")

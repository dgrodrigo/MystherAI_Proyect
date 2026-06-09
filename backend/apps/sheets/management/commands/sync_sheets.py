import csv
import os
from django.core.management.base import BaseCommand
from apps.sheets.models import VideoMetadata

class Command(BaseCommand):
    help = 'Migración final de Google Sheets a Base de Datos Local'

    def handle(self, *args, **kwargs):
        self.stdout.write("Realizando importacion definitiva de CSVs...")

        # Limpiar datos previos
        VideoMetadata.objects.all().delete()

        # Función robusta para obtener valores de la fila, manejando espacios y case-insensitivity
        def get_csv_value(row, *possible_keys):
            for target_key in possible_keys:
                target_key_lower_stripped = target_key.lower().strip()
                for k, v in row.items():
                    if k and k.lower().strip() == target_key_lower_stripped:
                        return v.strip() if v else ''
            return ''

        # --- MIGRAR CENSO (Basado en tus columnas reales) ---
        censo_path = 'censo.csv'
        if os.path.exists(censo_path):
            with open(censo_path, mode='r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                count = 0
                for row in reader:
                    video_id_val = get_csv_value(row, 'ID DE VIDEO')
                    if not video_id_val: continue
                    VideoMetadata.objects.create(
                        video_id=video_id_val,
                        tipo='censo',
                        usuario=get_csv_value(row, 'usuario'),
                        id_video_equipo=get_csv_value(row, 'ID DE VIDEO EQUIPO'),
                        drive_link=get_csv_value(row, 'LINK'),
                        mapa=get_csv_value(row, 'MAPA'),
                        genero=get_csv_value(row, 'GENERO'),
                        etnia=get_csv_value(row, 'ETNIA'),
                        duracion=get_csv_value(row, 'DURACION'),
                        camara=get_csv_value(row, 'CAMARA'),
                        especie=get_csv_value(row, 'ESPECIE'),
                    )
                    count += 1
                self.stdout.write(self.style.SUCCESS(f"OK: {count} filas de Censo migradas."))
        else:
            self.stdout.write(self.style.ERROR("ERROR: No se encontró censo.csv en la carpeta backend."))

        # --- MIGRAR REGISTRO MATEO (Basado en tus columnas reales) ---
        registro_path = 'registro.csv'
        if os.path.exists(registro_path):
            with open(registro_path, mode='r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                count = 0
                for row in reader:
                    video_id_val = get_csv_value(row, 'Id')
                    if not video_id_val: continue
                    VideoMetadata.objects.create(
                        video_id=video_id_val,
                        tipo='registro',
                        usuario=get_csv_value(row, 'Miembro'),
                        mateo_miguel=get_csv_value(row, 'Mateo/Miguel'),
                        estilizado=get_csv_value(row, 'Estilizado'),
                        prompt_imagen=get_csv_value(row, 'Prompt imagen'),
                        imagen_link=get_csv_value(row, 'imagen'),
                        prompt_video=get_csv_value(row, 'prompt video'),
                        drive_link=get_csv_value(row, 'video'),
                        video_original_link=get_csv_value(row, 'video orginal', 'video original'), 
                        aceptado=get_csv_value(row, 'ACEPTADO'),
                        prompt_final=get_csv_value(row, 'Prompt Final'),
                        prompt_imagen_arreglo=get_csv_value(row, 'Prompt Imagen Arreglo'),
                        imagen_arreglo=get_csv_value(row, 'Imagen Arreglo'),
                        prompt_video_arreglo=get_csv_value(row, 'Prompt Video Arreglo'),
                        video_arreglo=get_csv_value(row, 'Video Arreglo'),
                    )
                    count += 1
                self.stdout.write(self.style.SUCCESS(f"OK: {count} filas de Registro migradas."))
        else:
            self.stdout.write(self.style.ERROR("ERROR: No se encontró registro.csv en la carpeta backend."))

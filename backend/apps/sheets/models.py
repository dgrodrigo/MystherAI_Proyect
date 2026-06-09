from django.db import models

class VideoMetadata(models.Model):
    # Campos comunes
    video_id = models.CharField(max_length=100, blank=True, null=True) 
    tipo = models.CharField(max_length=50, choices=[('censo', 'Censo'), ('registro', 'Registro')])
    usuario = models.CharField(max_length=100, blank=True, null=True) 
    drive_link = models.URLField(max_length=500, blank=True, null=True) 

    # Metadata Censo
    id_video_equipo = models.CharField(max_length=50, blank=True, null=True)
    mapa = models.CharField(max_length=100, blank=True, null=True)
    genero = models.CharField(max_length=100, blank=True, null=True)
    etnia = models.CharField(max_length=100, blank=True, null=True)
    duracion = models.CharField(max_length=50, blank=True, null=True)
    camara = models.CharField(max_length=100, blank=True, null=True)
    especie = models.CharField(max_length=100, blank=True, null=True)
    
    # Metadata Registro
    mateo_miguel = models.CharField(max_length=50, blank=True, null=True)
    estilizado = models.CharField(max_length=100, blank=True, null=True)
    prompt_imagen = models.TextField(blank=True, null=True)
    imagen_link = models.URLField(max_length=500, blank=True, null=True)
    prompt_video = models.TextField(blank=True, null=True)
    video_original_link = models.URLField(max_length=500, blank=True, null=True)
    aceptado = models.CharField(max_length=50, blank=True, null=True)
    prompt_final = models.TextField(blank=True, null=True)

    # Campos de Arreglo (de tu CSV de Registro)
    prompt_imagen_arreglo = models.TextField(blank=True, null=True)
    imagen_arreglo = models.URLField(max_length=500, blank=True, null=True)
    prompt_video_arreglo = models.TextField(blank=True, null=True)
    video_arreglo = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.video_id} - {self.tipo}"

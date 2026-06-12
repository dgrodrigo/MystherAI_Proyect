from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q
from .models import VideoMetadata
from .serializers import VideoMetadataSerializer

class VideoListView(generics.ListCreateAPIView):
    serializer_class = VideoMetadataSerializer
    
    def get_queryset(self):
        queryset = VideoMetadata.objects.all()
        tipo = self.request.query_params.get('tipo', '').strip()
        search = self.request.query_params.get('search', '').strip()
        
        if tipo: queryset = queryset.filter(tipo__iexact=tipo)
        
        filter_fields = ['usuario', 'mapa', 'genero', 'etnia', 'camara', 'especie', 'estilizado', 'aceptado']
        for field in filter_fields:
            value = self.request.query_params.get(field, '').strip()
            if value:
                queryset = queryset.filter(**{f"{field}__icontains": value})

        if search:
            queryset = queryset.filter(Q(video_id__icontains=search) | Q(usuario__icontains=search))
        
        return queryset.order_by("-id")

# Nueva vista para editar y eliminar (Solo Admin)
class VideoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VideoMetadata.objects.all()
    serializer_class = VideoMetadataSerializer
    # La lógica de permisos se manejará en el frontend ocultando botones, 
    # pero aquí blindamos la API
    def get_permissions(self):
        if self.request.method in ['DELETE', 'PUT', 'PATCH']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class FilterOptionsView(APIView):
    def get(self, request):
        tipo = request.query_params.get('tipo', 'censo').lower()
        fields_to_filter = ["usuario", "mapa", "genero", "etnia", "camara", "especie", "estilizado", "aceptado"]
        options = {}
        
        for field_name in fields_to_filter:
            distinct_values = VideoMetadata.objects.values_list(field_name, flat=True).distinct()
            cleaned_values = [str(v).strip() for v in distinct_values if v and str(v).lower() != 'nan']
            
            # LÓGICA DE USUARIOS SOLICITADA
            if field_name == 'usuario':
                if tipo == 'censo':
                    cleaned_values = [v for v in cleaned_values if v.lower() in ['miguel', 'mateo']]
                else:
                    cleaned_values = [v for v in cleaned_values if v.lower() not in ['miguel', 'mateo']]
            
            options[field_name] = sorted(list(set(cleaned_values)))
        return Response(options)

class CensoSummaryView(APIView):
    permission_classes = []  # Datos ficticios, no requiere autenticación
    
    def get(self, request):
        data = {
            "kpis": {
                "totalVideos": 417,
                "humanos": 192,
                "animales": 98,
                "sinClasificar": 127,
                "duracionMedia": "6.9s",
                "totalMapas": 42,
                "videosMateo": 217,
                "videosMiguel": 200,
                "totalSegundos": 2860
            },
            "especiesData": [
                { "label": "Humano", "value": 192, "percent": 46.0, "color": "var(--neon-cyan)" },
                { "label": "Animal", "value": 98, "percent": 23.5, "color": "#2ecc71" },
                { "label": "Sin Clasificar", "value": 127, "percent": 30.5, "color": "#ff4b2b" }
            ],
            "inicialMapas": [
                { "name": "Jungla", "total": 30, "human": 5, "animal": 18, "unclassified": 7, "mateo": 13, "miguel": 17 },
                { "name": "Venecia", "total": 29, "human": 28, "animal": 0, "unclassified": 1, "mateo": 29, "miguel": 0 },
                { "name": "Vecindario", "total": 23, "human": 2, "animal": 2, "unclassified": 19, "mateo": 6, "miguel": 17 },
                { "name": "Estación Tren", "total": 22, "human": 14, "animal": 8, "unclassified": 0, "mateo": 13, "miguel": 9 },
                { "name": "Almacén", "total": 18, "human": 10, "animal": 0, "unclassified": 8, "mateo": 7, "miguel": 11 },
                { "name": "Chabolas", "total": 18, "human": 7, "animal": 9, "unclassified": 2, "mateo": 10, "miguel": 8 },
                { "name": "Oficina", "total": 17, "human": 12, "animal": 0, "unclassified": 5, "mateo": 9, "miguel": 8 },
                { "name": "Pradera", "total": 16, "human": 4, "animal": 6, "unclassified": 6, "mateo": 10, "miguel": 6 },
                { "name": "Mansión Antigua", "total": 16, "human": 16, "animal": 0, "unclassified": 0, "mateo": 11, "miguel": 5 },
                { "name": "Bosque", "total": 15, "human": 2, "animal": 9, "unclassified": 4, "mateo": 8, "miguel": 7 },
                { "name": "Favela", "total": 14, "human": 5, "animal": 0, "unclassified": 9, "mateo": 4, "miguel": 10 },
                { "name": "Base militar", "total": 13, "human": 10, "animal": 0, "unclassified": 3, "mateo": 5, "miguel": 8 },
                { "name": "Restaurante", "total": 13, "human": 4, "animal": 1, "unclassified": 8, "mateo": 2, "miguel": 11 },
                { "name": "Centro Comercial", "total": 13, "human": 3, "animal": 0, "unclassified": 10, "mateo": 0, "miguel": 13 },
                { "name": "Iglesia", "total": 11, "human": 5, "animal": 0, "unclassified": 6, "mateo": 2, "miguel": 9 },
                { "name": "Refugio Nuclear", "total": 11, "human": 8, "animal": 0, "unclassified": 3, "mateo": 4, "miguel": 7 },
                { "name": "Islas griegas", "total": 10, "human": 0, "animal": 3, "unclassified": 7, "mateo": 3, "miguel": 7 },
                { "name": "Basurero", "total": 9, "human": 3, "animal": 0, "unclassified": 6, "mateo": 4, "miguel": 5 },
                { "name": "Museo", "total": 9, "human": 9, "animal": 0, "unclassified": 0, "mateo": 0, "miguel": 9 },
                { "name": "Desierto", "total": 8, "human": 1, "animal": 7, "unclassified": 0, "mateo": 6, "miguel": 2 },
                { "name": "Barco", "total": 8, "human": 4, "animal": 2, "unclassified": 2, "mateo": 5, "miguel": 3 },
                { "name": "Cabaña", "total": 8, "human": 7, "animal": 0, "unclassified": 1, "mateo": 6, "miguel": 2 },
                { "name": "Sabana", "total": 8, "human": 1, "animal": 6, "unclassified": 1, "mateo": 5, "miguel": 3 },
                { "name": "Campo", "total": 7, "human": 2, "animal": 5, "unclassified": 0, "mateo": 7, "miguel": 0 },
                { "name": "Palacio", "total": 6, "human": 0, "animal": 0, "unclassified": 6, "mateo": 3, "miguel": 3 },
                { "name": "Teatro", "total": 6, "human": 5, "animal": 0, "unclassified": 1, "mateo": 6, "miguel": 0 },
                { "name": "Tundra", "total": 6, "human": 0, "animal": 6, "unclassified": 0, "mateo": 3, "miguel": 3 },
                { "name": "Aldea medieval", "total": 6, "human": 0, "animal": 5, "unclassified": 1, "mateo": 5, "miguel": 1 },
                { "name": "Playa", "total": 6, "human": 2, "animal": 1, "unclassified": 3, "mateo": 3, "miguel": 3 },
                { "name": "Ciudad", "total": 5, "human": 0, "animal": 5, "unclassified": 0, "mateo": 5, "miguel": 0 },
                { "name": "Acuario", "total": 5, "human": 2, "animal": 0, "unclassified": 3, "mateo": 2, "miguel": 3 },
                { "name": "Cañon", "total": 5, "human": 2, "animal": 0, "unclassified": 3, "mateo": 5, "miguel": 0 },
                { "name": "Castillo", "total": 4, "human": 4, "animal": 0, "unclassified": 0, "mateo": 4, "miguel": 0 },
                { "name": "Bar", "total": 4, "human": 3, "animal": 0, "unclassified": 1, "mateo": 2, "miguel": 2 },
                { "name": "Laboratorio", "total": 4, "human": 4, "animal": 0, "unclassified": 0, "mateo": 4, "miguel": 0 },
                { "name": "Hospital", "total": 3, "human": 3, "animal": 0, "unclassified": 0, "mateo": 3, "miguel": 0 },
                { "name": "Cementerio", "total": 3, "human": 1, "animal": 2, "unclassified": 0, "mateo": 3, "miguel": 0 },
                { "name": "Castillo ruina", "total": 3, "human": 0, "animal": 0, "unclassified": 3, "mateo": 0, "miguel": 3 },
                { "name": "Laboratorio Polar", "total": 2, "human": 2, "animal": 0, "unclassified": 0, "mateo": 0, "miguel": 2 },
                { "name": "Biblioteca", "total": 1, "human": 1, "animal": 0, "unclassified": 0, "mateo": 1, "miguel": 0 },
                { "name": "Banco", "total": 1, "human": 0, "animal": 0, "unclassified": 1, "mateo": 0, "miguel": 1 },
                { "name": "Barco Pirata", "total": 1, "human": 1, "animal": 0, "unclassified": 0, "mateo": 0, "miguel": 1 }
            ],
            "exclusivasMateo": [
                { "name": "Biblioteca", "total": 1 },
                { "name": "Campo", "total": 7 },
                { "name": "Castillo", "total": 4 },
                { "name": "Cañon", "total": 5 },
                { "name": "Cementerio", "total": 3 },
                { "name": "Ciudad", "total": 5 },
                { "name": "Hospital", "total": 3 },
                { "name": "Laboratorio", "total": 4 },
                { "name": "Teatro", "total": 6 },
                { "name": "Venecia", "total": 29 }
            ],
            "exclusivasMiguel": [
                { "name": "Banco", "total": 1 },
                { "name": "Barco Pirata", "total": 1 },
                { "name": "Castillo ruina", "total": 3 },
                { "name": "Centro Comercial", "total": 13 },
                { "name": "Laboratorio Polar", "total": 2 },
                { "name": "Museo", "total": 9 },
                { "name": "Playa", "total": 6 }
            ],
            "generoData": [
                { "label": "Hombre", "value": 98, "percent": 51.9, "color": "var(--neon-cyan)" },
                { "label": "Mujer", "value": 91, "percent": 48.1, "color": "var(--neon-purple)" }
            ],
            "etniaData": [
                { "label": "Blanco", "value": 95, "percent": 50.3, "color": "#f39c12" },
                { "label": "Moreno", "value": 94, "percent": 49.7, "color": "#9b59b6" }
            ],
            "cruceGenEtnia": [
                { "label": "Hombre Blanco", "value": 53, "color": "#ff7f50" },
                { "label": "Hombre Moreno", "value": 45, "color": "var(--neon-cyan)" },
                { "label": "Mujer Blanco", "value": 42, "color": "#e0115f" },
                { "label": "Mujer Moreno", "value": 49, "color": "#8e44ad" }
            ],
            "mapasSoloHombres": [
                "Biblioteca", "Desierto", "Cementerio", "Playa", "Centro Comercial", 
                "Campo", "Vecindario", "Cañon", "Basurero", "Bar", 
                "Laboratorio", "Castillo", "Barco", "Base militar", "Mansión Antigua"
            ],
            "camaraData": [
                { "label": "Realizadora", "value": 169, "color": "#ff5722" },
                { "label": "Libre", "value": 88, "color": "#00bcd4" },
                { "label": "Rail", "value": 62, "color": "#9c27b0" },
                { "label": "Fija", "value": 60, "color": "#e91e63" },
                { "label": "1ra Persona", "value": 38, "color": "#4caf50" }
            ],
            "duracionData": [
                { "label": "3s", "value": 25 },
                { "label": "4s", "value": 32 },
                { "label": "5s", "value": 59 },
                { "label": "6s", "value": 66 },
                { "label": "7s", "value": 80 },
                { "label": "8s", "value": 51 },
                { "label": "9s", "value": 42 },
                { "label": "10s", "value": 62 }
            ],
            "actionPlan": [
                { "id": 1, "cat": "Especie", "title": "Clasificar videos en especie", "desc": "Clasificar los 127 videos marcados como 'Nan' en especie (revisión manual urgente).", "priority": "critica", "deficit": "127 videos", "status": "Pendiente", "checked": False },
                { "id": 2, "cat": "Género x Mapa", "title": "Añadir mujeres en mapas masculinos", "desc": "Añadir personajes femeninos en los 15 mapas que solo contienen hombres (Biblioteca, Desierto, etc.).", "priority": "alta", "deficit": "15 mapas", "status": "Pendiente", "checked": False },
                { "id": 3, "cat": "Etnia x Mapa", "title": "Diversificar etnias en mapas exclusivos", "desc": "Introducir variedad étnica en los 22 mapas que solo cuentan con un solo tipo étnico.", "priority": "alta", "deficit": "22 mapas", "status": "Pendiente", "checked": False },
                { "id": 4, "cat": "Cobertura", "title": "Videos de MIGUEL en mapas MATEO", "desc": "MIGUEL debe grabar en los 10 mapas exclusivos de MATEO para completar la cobertura cruzada.", "priority": "media", "deficit": "10 mapas", "status": "Pendiente", "checked": False },
                { "id": 5, "cat": "Cobertura", "title": "Videos de MATEO en mapas MIGUEL", "desc": "MATEO debe grabar en los 7 mapas exclusivos de MIGUEL para consolidar el censo cruzado.", "priority": "media", "deficit": "7 mapas", "status": "Pendiente", "checked": False },
                { "id": 6, "cat": "Cámara", "title": "Aumentar cámara Fija", "desc": "Grabar más videos utilizando el tipo de cámara 'Fija' para nivelar el déficit (actualmente 60).", "priority": "baja", "deficit": "60 videos", "status": "Pendiente", "checked": False },
                { "id": 7, "cat": "Cámara", "title": "Equilibrar duración del censo", "desc": "Apuntar a una mayor cantidad de grabaciones en el rango ideal de 7 a 10 segundos.", "priority": "baja", "deficit": "Varios", "status": "Pendiente", "checked": False }
            ]
        }
        return Response(data)


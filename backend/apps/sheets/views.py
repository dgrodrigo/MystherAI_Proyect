from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
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
        
        # Filtros avanzados, flexibles a mayúsculas/minúsculas y espacios
        filter_fields = ['usuario', 'mapa', 'genero', 'etnia', 'camara', 'especie', 'estilizado', 'aceptado']
        for field in filter_fields:
            value = self.request.query_params.get(field, '').strip()
            if value:
                queryset = queryset.filter(**{f"{field}__icontains": value})

        # Búsqueda global por texto (ID o Usuario)
        if search:
            queryset = queryset.filter(
                Q(video_id__icontains=search) | 
                Q(usuario__icontains=search)
            )
        
        return queryset.order_by("-id") # CORREGIDO: order_by

class FilterOptionsView(APIView):
    def get(self, request):
        fields_to_filter = ["usuario", "mapa", "genero", "etnia", "camara", "especie", "estilizado", "aceptado"]
        options = {}
        for field_name in fields_to_filter:
            # Filtra None y cadenas vacías antes de hacer distinct y ordenar
            distinct_values = VideoMetadata.objects.values_list(field_name, flat=True).distinct()
            cleaned_values = [
                str(v).strip() for v in distinct_values 
                if v is not None and str(v).strip() != '' and str(v).lower() != 'nan'
            ]
            options[field_name] = sorted(list(set(cleaned_values)))
        return Response(options)

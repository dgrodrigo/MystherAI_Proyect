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
        tipo = self.request.query_params.get('tipo')
        search = self.request.query_params.get('search')
        if tipo: queryset = queryset.filter(tipo__iexact=tipo)
        for f in ['usuario', 'mapa', 'etnia', 'estilizado', 'aceptado']:
            v = self.request.query_params.get(f)
            if v: queryset = queryset.filter(**{f"{f}__icontains": v})
        if search: queryset = queryset.filter(Q(video_id__icontains=search) | Q(usuario__icontains=search))
        return queryset.order_by("-id")

class VideoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VideoMetadata.objects.all()
    serializer_class = VideoMetadataSerializer

class FilterOptionsView(APIView):
    def get(self, request):
        tipo = request.query_params.get('tipo', 'censo')
        fields = ["usuario", "mapa", "etnia", "estilizado", "aceptado"]
        res = {}
        for f in fields:
            vals = VideoMetadata.objects.filter(tipo__iexact=tipo).values_list(f, flat=True).distinct()
            res[f] = sorted([str(v).strip() for v in vals if v and str(v).lower() != 'nan'])
        return Response(res)
# ==========================================
# AUTO-REGISTRO DESDE GRADIO
# ==========================================
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class AutoRegisterVideoView(APIView):
    def post(self, request):
        try:
            data = request.data
            video_data = {
                'video_id': data.get('video_id', ''),
                'tipo': 'registro',
                'usuario': data.get('usuario', 'Mateo'),
                'mateo_miguel': data.get('mateo_miguel', 'Mateo'),
                'estilizado': data.get('estilizado', 'Anime'),
                'prompt_imagen': data.get('prompt_imagen', ''),
                'imagen_link': data.get('imagen_link', ''),
                'prompt_video': data.get('prompt_video', ''),
                'drive_link': data.get('drive_link', ''),
                'video_original_link': data.get('video_original_link', ''),
            }
            if video_data['video_id']:
                VideoMetadata.objects.update_or_create(
                    video_id=video_data['video_id'],
                    tipo='registro',
                    defaults=video_data
                )
            else:
                VideoMetadata.objects.create(**video_data)
            return Response({'status': 'success', 'message': 'Registrado OK'}, status=201)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import VideoMetadata
from .serializers import VideoMetadataSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

class VideoListView(generics.ListCreateAPIView):
    serializer_class = VideoMetadataSerializer
    def get_queryset(self):
        queryset = VideoMetadata.objects.all()
        tipo = self.request.query_params.get('tipo')
        search = self.request.query_params.get('search')
        if tipo: queryset = queryset.filter(tipo__iexact=tipo)
        filtros = ['usuario', 'mapa', 'etnia', 'estilizado', 'aceptado', 'genero', 'especie', 'camara', 'mateo_miguel']
        for f in filtros:
            val = self.request.query_params.get(f)
            if val: queryset = queryset.filter(**{f"{f}__icontains": val})
        if search:
            queryset = queryset.filter(Q(video_id__icontains=search) | Q(usuario__icontains=search))
        return queryset.order_by("-id")

class VideoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VideoMetadata.objects.all()
    serializer_class = VideoMetadataSerializer

class FilterOptionsView(APIView):
    def get(self, request):
        tipo = request.query_params.get('tipo', 'censo')
        # Enviamos TODOS los campos siempre para que la interfaz no se rompa
        fields = ["usuario", "mapa", "etnia", "estilizado", "aceptado", "genero", "especie", "camara", "mateo_miguel"]
        res = {}
        base_queryset = VideoMetadata.objects.filter(tipo__iexact=tipo)
        for f in fields:
            vals = base_queryset.values_list(f, flat=True).distinct()
            res[f] = sorted([str(v).strip() for v in vals if v and str(v).lower() != 'nan' and str(v).strip() != ''])
        return Response(res)

@method_decorator(csrf_exempt, name='dispatch')
class AutoRegisterVideoView(APIView):
    def post(self, request):
        serializer = VideoMetadataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
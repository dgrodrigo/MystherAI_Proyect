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

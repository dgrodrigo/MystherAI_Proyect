from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

class ValidateWaveSpeedKeyView(APIView):
    # Para la demo no exigimos autenticación
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        api_key = (request.data.get("api_key") or "").strip()
        if not api_key:
            return Response({"valid": False, "error": "Falta api_key"}, status=status.HTTP_400_BAD_REQUEST)

        # Validación simple por formato
        if len(api_key) < 20:
            return Response({"valid": False, "error": "Formato de API key no válido"}, status=status.HTTP_400_BAD_REQUEST)

        # Fase 2: aquí se podría añadir una llamada ligera a WaveSpeed si la librería lo permite
        return Response({"valid": True}, status=status.HTTP_200_OK)

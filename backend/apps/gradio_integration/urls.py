from django.urls import path
from .views import ValidateWaveSpeedKeyView

urlpatterns = [
    path("validate-key/", ValidateWaveSpeedKeyView.as_view(), name="validate-ws-key"),
]

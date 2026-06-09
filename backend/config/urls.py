from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.authentication.urls")),
    path("api/tool/", include("apps.gradio_integration.urls")),
    path("api/sheets/", include("apps.sheets.urls")),
]


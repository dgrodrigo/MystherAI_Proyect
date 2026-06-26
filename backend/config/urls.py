from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/sheets/', include('apps.sheets.urls')),
    path('api/tool/', include('apps.gradio_integration.urls')),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
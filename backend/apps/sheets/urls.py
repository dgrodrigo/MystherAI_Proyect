from django.urls import path
from .views import VideoListView, FilterOptionsView

urlpatterns = [
    path('videos/', VideoListView.as_view(), name='video-list'),
    path('filter-options/', FilterOptionsView.as_view(), name='filter-options'),
]

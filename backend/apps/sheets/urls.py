from django.urls import path
from .views import VideoListView, VideoDetailView, FilterOptionsView, AutoRegisterVideoView

urlpatterns = [
    path('videos/', VideoListView.as_view(), name='video-list-create'),
    path('videos/<int:pk>/', VideoDetailView.as_view(), name='video-detail'),
    path('filter-options/', FilterOptionsView.as_view(), name='filter-options'),
    path('auto-register/', AutoRegisterVideoView.as_view(), name='auto-register'),
]

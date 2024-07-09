# urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from chat.views import InterestViewSet, ChatMessageViewSet,index,room

router = DefaultRouter()
router.register(r'interests', InterestViewSet)
router.register(r'chat-messages', ChatMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('chat/<str:room_name>/', room, name='room'),
    path('index/', index, name='index'),
    path("<str:room_name>/", room, name="room"),
]

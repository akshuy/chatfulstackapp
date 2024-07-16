# urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from chat.views import InterestViewSet, ChatMessageViewSet,index,room,UserListView,SendInterestView,SuggistionView

router = DefaultRouter()
router.register(r'interests', InterestViewSet)
router.register(r'chat-messages', ChatMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('chat/<str:room_name>/', room, name='room'),
    path('index/', index, name='index'),
    # path("ws/<str:room_name>/", room, name="room"),
    path('list/', UserListView.as_view(), name='user-list'),
    path('suggest/', SuggistionView.as_view(), name='suggistion-list'),
    path('send-interest/<int:user_id>/', SendInterestView.as_view(), name='send-interest'),
]

# views.py

from rest_framework import viewsets, permissions
from chat.models import Interest, ChatMessage
from chat.serializer import InterestSerializer, ChatMessageSerializer
from rest_framework.exceptions import ValidationError

from rest_framework.response import Response
from rest_framework.decorators import action
# views.py

from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import Interest
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status


# views.py

# views.py

from django.shortcuts import render
def index(request):
    return render(request, "index.html")

def room(request, room_name):
    return render(request, 'room.html', {
        'room_name': room_name
    })

class InterestViewSet(viewsets.ModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(receiver=self.request.user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        interest = self.get_object()
        if interest.receiver != request.user:
            return Response({'error': 'You can only accept interests sent to you.'}, status=status.HTTP_403_FORBIDDEN)
        interest.status = 'accepted'
        interest.save()
        return Response({'status': 'Interest accepted'})

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        interest = self.get_object()
        if interest.receiver != request.user:
            return Response({'error': 'You can only reject interests sent to you.'}, status=status.HTTP_403_FORBIDDEN)
        interest.status = 'rejected'
        interest.save()
        return Response({'status': 'Interest rejected'})


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(sender=user) | self.queryset.filter(receiver=user)

    def perform_create(self, serializer):
        sender = self.request.user
        receiver = serializer.validated_data['receiver']

        try:
            interest = Interest.objects.get(sender=sender, receiver=receiver)
        except Interest.DoesNotExist:
            try:
                interest = Interest.objects.get(sender=receiver, receiver=sender)
            except Interest.DoesNotExist:
                raise ValidationError({'error': 'No interest exists between these users.'})

        if interest.status != 'accepted':
            raise ValidationError({'error': 'You can only send messages if the interest is accepted.'})

        serializer.save(sender=self.request.user)
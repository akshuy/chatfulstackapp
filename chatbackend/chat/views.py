# views.py

from rest_framework import viewsets, permissions
from chat.models import Interest, ChatMessage
from chat.serializer import InterestSerializer, ChatMessageSerializer,UserSerializer
from rest_framework.exceptions import ValidationError

from rest_framework.response import Response
from rest_framework.decorators import action
# views.py
from rest_framework.views import APIView
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import Interest
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status,generics, permissions,serializers
from account.models import MyUser
from django.db.models import Q

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
        return self.queryset.filter(receiver=self.request.user).exclude(status='accepted')

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
        selected_user_id = self.request.query_params.get('user_id')

        if selected_user_id:
            try:
                selected_user = MyUser.objects.get(id=selected_user_id)
            except User.DoesNotExist:
                raise ValidationError({'error': 'Selected user does not exist.'})

            return self.queryset.filter(
                (Q(sender=user) & Q(receiver=selected_user)) | 
                (Q(sender=selected_user) & Q(receiver=user))
            ).order_by("timestamp")

        return self.queryset.filter(Q(sender=user) | Q(receiver=user)).order_by("timestamp")

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
        
class SuggistionView(generics.ListAPIView):
    queryset = MyUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return MyUser.objects.exclude(
            Q(sent_interests__receiver=user, sent_interests__status='accepted') |
            Q(received_interests__sender=user, received_interests__status='pending')
        ).distinct().exclude(id=user.id)

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return MyUser.objects.filter(
            Q(sent_interests__receiver=user, sent_interests__status='accepted') |
            Q(received_interests__sender=user, received_interests__status='accepted')
        ).distinct().exclude(id=user.id)

    def get_serializer_context(self):
        return {'request': self.request}
class SendInterestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        receiver_id = self.kwargs.get('user_id')
        try:
            receiver = MyUser.objects.get(id=receiver_id)
        except MyUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if receiver == request.user:
            return Response({'detail': 'Cannot send interest to yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        interest, created = Interest.objects.get_or_create(sender=request.user, receiver=receiver)
        if created:
            return Response({'detail': 'Interest sent.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Interest already sent.'}, status=status.HTTP_200_OK)


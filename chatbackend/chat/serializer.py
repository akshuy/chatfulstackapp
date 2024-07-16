
from rest_framework import serializers
from chat.models import Interest, ChatMessage
from account.models import MyUser
from django.db.models import Q


class UserSerializer(serializers.ModelSerializer):
    interest_id = serializers.SerializerMethodField()

    class Meta:
        model = MyUser
        fields = ['id', 'name', 'email', 'interest_id']

    def get_interest_id(self, obj):
        user = self.context['request'].user
        interest = Interest.objects.filter(
            Q(sender=user, receiver=obj) | Q(sender=obj, receiver=user),
            status='accepted'
        ).first()
        return interest.id if interest else None

class InterestSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()

    class Meta:
        model = Interest
        fields = ['id', 'sender', 'receiver', 'sender_name', 'receiver_name', 'status', 'timestamp']

    def get_sender_name(self, obj):
        return obj.sender.name if obj.sender else None

    def get_receiver_name(self, obj):
        return obj.receiver.name if obj.receiver else None

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver','sender_name', 'receiver_name', 'message', 'timestamp']
    def get_sender_name(self, obj):
        return obj.sender.name if obj.sender else None

    def get_receiver_name(self, obj):
        return obj.receiver.name if obj.receiver else None
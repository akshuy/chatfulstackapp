import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
from chat.models import ChatMessage
from account.models import MyUser
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_text = text_data_json.get('message')
        sender_id = text_data_json.get('sender')
        receiver_id = text_data_json.get('receiver')

        if not message_text or not sender_id or not receiver_id:
            print("Missing required fields in WebSocket message")
            return

        print(f"Received message: {message_text} from sender {sender_id} to receiver {receiver_id}")

        # Fetch sender and receiver from database using sync_to_async
        try:
            sender = await database_sync_to_async(MyUser.objects.get)(id=sender_id)
            receiver = await database_sync_to_async(MyUser.objects.get)(id=receiver_id)
        except MyUser.DoesNotExist:
            print(f"Sender or receiver does not exist: sender_id={sender_id}, receiver_id={receiver_id}")
            return

        # Save the message to the database using sync_to_async
        await database_sync_to_async(ChatMessage.objects.create)(
            sender=sender,
            receiver=receiver,
            message=message_text,
            timestamp=timezone.now()
        )
        print("Message saved to database")

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_text,
                'sender': sender_id,
                'receiver': receiver_id,
                'timestamp': str(timezone.now())  # Send timestamp
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        receiver = event['receiver']
        timestamp = event['timestamp']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'receiver': receiver,
            'timestamp': timestamp
        }))

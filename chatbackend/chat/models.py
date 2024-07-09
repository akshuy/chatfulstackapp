# models.py

from django.db import models
from account.models import MyUser

class Interest(models.Model):
    sender = models.ForeignKey(MyUser, related_name='sent_interests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(MyUser, related_name='received_interests', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interest from {self.sender} to {self.receiver} - {self.status}"

class ChatMessage(models.Model):
    sender = models.ForeignKey(MyUser, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(MyUser, related_name='received_messages', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} to {self.receiver}: {self.message}'

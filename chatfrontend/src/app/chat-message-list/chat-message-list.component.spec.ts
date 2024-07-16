// chat-message-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat-message/chat.service';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.css']
})
export class ChatMessageListComponent implements OnInit {
  messages: any[] = [];
  receiverId: number | null = null;

  constructor(private chatService: ChatService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.receiverId = +params['id'];
      const senderId = this.getSenderId();
      if (this.receiverId && senderId) {
        const roomName = this.chatService.getRoomName(senderId, this.receiverId);
        this.chatService.connectToRoom(roomName);
        this.fetchMessages();
      }
    });
  }

  getSenderId(): number {
    // Replace with logic to get the sender ID from the user profile or token
    return 1; // Dummy value
  }

  fetchMessages(): void {
    if (this.receiverId !== null) {
      this.chatService.getMessages(this.receiverId).subscribe(
        (data) => {
          this.messages = data;
          console.log('Messages fetched:', this.messages);
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }
}

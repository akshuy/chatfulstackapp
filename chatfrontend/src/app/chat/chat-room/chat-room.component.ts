import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent {
  message: string = '';
  messages: string[] = [];

  constructor(private chatService: ChatService) {
    this.chatService.currentMessage.subscribe(msg => {
      this.messages.push(msg);
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }
}

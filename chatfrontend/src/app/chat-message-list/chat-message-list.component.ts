import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat-message/chat.service';
import { AuthService } from '../auth/auth.service'; // Import AuthService
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.css']
})
export class ChatMessageListComponent implements OnInit, AfterViewChecked {
  messages: any[] = [];
  receiverId: number | null = null;
  senderId: number | null = null;
  private socket: WebSocket | null = null;

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.receiverId = +params['id'];
      this.loadSenderId();
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadSenderId(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getUserProfile(token).pipe(first()).subscribe(
        userProfile => {
          this.senderId = userProfile.id; // Assuming userProfile has an `id` property
          if (this.senderId && this.receiverId) {
            const roomName = this.chatService.getRoomName(this.senderId, this.receiverId);
            this.initializeWebSocket(roomName);
            this.fetchMessages();
          }
        },
        err => console.error('Error fetching user profile:', err)
      );
    }
  }

  initializeWebSocket(roomName: string): void {
    const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/`;
    this.socket = new WebSocket(wsUrl);
    
    // WebSocket event handlers
    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messages.push(message);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
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

  private scrollToBottom(): void {
    const container = this.messageContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
}

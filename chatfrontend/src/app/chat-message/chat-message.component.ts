// chat-message.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service'; // Import AuthService
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  messageForm: FormGroup;
  receiverId: number | null = null;
  receiverName: string | null = null;
  senderId: number | null = null;

  constructor(
    private chatService: ChatService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService // Inject AuthService
  ) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.receiverId = +params['id']; // Get receiverId from route params
      this.receiverName = params['name'];
      this.loadSenderId();
    });
  }

  loadSenderId(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getUserProfile(token).pipe(first()).subscribe(
        userProfile => {
          this.senderId = userProfile.id; // Assuming userProfile has an `id` property
          if (this.senderId && this.receiverId) {
            const roomName = this.chatService.getRoomName(this.senderId, this.receiverId);
            this.chatService.connectToRoom(roomName);
          }
        },
        err => console.error('Error fetching user profile:', err)
      );
    }
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.receiverId && this.senderId) {
      const { message } = this.messageForm.value;
      this.chatService.sendMessage(message, this.receiverId, this.senderId);
      this.messageForm.reset();
    }
  }
}

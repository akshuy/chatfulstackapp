import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
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
  errorMessage: string | null = null; // Variable to store error message

  constructor(
    private chatService: ChatService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.receiverId = +params['id'];
      this.receiverName = params['name'];
      this.loadSenderId();
    });
  }

  loadSenderId(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getUserProfile(token).pipe(first()).subscribe(
        userProfile => {
          this.senderId = userProfile.id;
          if (this.senderId && this.receiverId) {
            const roomName = this.chatService.getRoomName(this.senderId, this.receiverId);
            this.chatService.connectToRoom(roomName);
          }
        },
        err => {
          console.error('Error fetching user profile:', err);
          if (err.status === 401) {
            this.errorMessage = 'Unauthorized access. Please log in.';
          } else {
            this.errorMessage = 'An unknown error occurred.';
          }
        }
      );
    } else {
      this.errorMessage = 'Token not found. Please log in.';
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

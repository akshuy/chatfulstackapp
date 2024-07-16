import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public socket$!: WebSocketSubject<any>;
  private apiUrl = 'http://127.0.0.1:8000/chat/chat-messages/';
  private senderId: number | null = null;

  constructor(private http: HttpClient) {}

  connectToRoom(roomName: string): void {
    if (this.socket$) {
      this.socket$.complete(); // Close existing connection if any
    }
    this.socket$ = new WebSocketSubject(`ws://localhost:8000/ws/chat/${roomName}/`);
    
    this.socket$.subscribe(
      message => console.log('Message received from WebSocket:', message),
      err => console.error('WebSocket error:', err),
      () => console.log('WebSocket connection closed')
    );
  }

  sendMessage(message: string, receiver: number, sender: number): void {
    const roomName = this.getRoomName(sender, receiver);
    const payload = { message, receiver, sender };
    this.socket$.next(payload);
    console.log('Message sent:', payload);
  }

  getMessages(userId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}?user_id=${userId}`, { headers });
  }

  public getRoomName(user1: number, user2: number): string {
    return [user1, user2].sort((a, b) => a - b).join('-');
  }

  public setSenderId(id: number): void {
    this.senderId = id;
  }

  public getSenderId(): number | null {
    return this.senderId;
  }
}

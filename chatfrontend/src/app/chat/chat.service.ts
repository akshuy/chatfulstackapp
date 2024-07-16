import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentMessage;

  constructor(private socket: Socket) {
    this.currentMessage = this.socket.fromEvent<string>('message');
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }
}

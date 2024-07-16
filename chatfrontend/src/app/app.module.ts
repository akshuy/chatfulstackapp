import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { InterestListComponent } from './interests/interest-list/interest-list.component';
import { ChatRoomComponent } from './chat/chat-room/chat-room.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { HomeComponent } from './home/home.component';

const config: SocketIoConfig = { url: 'http://localhost:8000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserProfileComponent,
    UserListComponent,
    InterestListComponent,
    ChatRoomComponent,
    ChatMessageComponent,
    ChatMessageListComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

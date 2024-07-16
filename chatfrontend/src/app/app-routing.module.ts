import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { InterestListComponent } from './interests/interest-list/interest-list.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { HomeComponent } from './home/home.component'; // Import the HomeComponent


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'userprofile', component: UserProfileComponent },
  { path: 'users', component: UserListComponent },
  { path: 'interests', component: InterestListComponent },
  { path: 'chat/:id/:name', component: ChatMessageComponent },
  { path: 'chat-messages/:id', component: ChatMessageListComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

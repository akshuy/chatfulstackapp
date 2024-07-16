import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { InterestService } from '../../interests/interest.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = []; // Initialize with an empty array
  suggestions: any[] = []; // Initialize with an empty array for suggestions

  constructor(
    private userService: UserService,
    private interestService: InterestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(response => {
      this.users = response;
    });

    this.userService.getSuggestions().subscribe(response => {
      this.suggestions = response;
    });
  }

  sendInterest(receiverId: number) {
    const token = localStorage.getItem('token');
    const senderId = 1; // Replace with the actual sender ID
    if (token) {
      this.interestService.sendInterest(receiverId, senderId, token).subscribe(response => {
        console.log('Interest sent successfully', response);
        // Optionally, update the UI to reflect the interest has been sent
      }, error => {
        console.error('Error sending interest', error);
      });
    }
  }

  openChat(user: { id: number, name: string }) {
    this.router.navigate(['/chat', user.id, user.name]);
  }
}

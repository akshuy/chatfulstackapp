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
  errorMessage: string = ''; // Variable to store error messages

  constructor(
    private userService: UserService,
    private interestService: InterestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUsers().subscribe(response => {
        this.users = response;
      }, error => {
        this.handleError(error);
      });

      this.userService.getSuggestions().subscribe(response => {
        this.suggestions = response;
      }, error => {
        this.handleError(error);
      });
    } else {
      this.errorMessage = 'User is not authenticated';
    }
  }

  sendInterest(receiverId: number) {
    const token = localStorage.getItem('token');
    const senderId = 1; // Replace with the actual sender ID
    if (token) {
      this.interestService.sendInterest(receiverId, senderId, token).subscribe(response => {
        console.log('Interest sent successfully', response);
        // Optionally, update the UI to reflect the interest has been sent
      }, error => {
        this.handleError(error);
      });
    } else {
      this.errorMessage = 'User is not authenticated';
    }
  }

  openChat(user: { id: number, name: string }) {
    this.router.navigate(['/chat', user.id, user.name]);
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.errorMessage = 'Unauthorized: Please log in again.';
    } else {
      this.errorMessage = 'An error occurred. Please try again later.';
    }
    console.error('Error:', error);
  }
}

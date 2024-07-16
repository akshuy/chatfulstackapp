import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: any;
  errorDetail: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getUserProfile(token).subscribe(
        response => {
          this.userProfile = response;
          this.errorDetail = null;
        },
        error => {
          console.error('Error fetching user profile:', error);
          this.errorDetail = error.error.errors ? error.error.errors.detail : 'An error occurred';
        }
      );
    } else {
      this.errorDetail = 'No token found';
    }
  }
}

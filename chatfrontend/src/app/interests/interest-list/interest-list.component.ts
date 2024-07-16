import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InterestService } from '../interest.service';

@Component({
  selector: 'app-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.css'],
  providers: [DatePipe] // Provide DatePipe here
})
export class InterestListComponent implements OnInit {
  interests: any[] = []; // Initialize with an empty array

  constructor(
    private interestService: InterestService,
    private datePipe: DatePipe // Inject DatePipe
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.interestService.getInterests(token).subscribe(response => {
        this.interests = response;
      });
    }
  }

  acceptInterest(interestId: number) {
    const token = localStorage.getItem('token');
    if (token) {
      // Optimistically update the UI
      this.updateInterestStatus(interestId, 'accepted');
      
      this.interestService.acceptInterest(interestId, token).subscribe(response => {
        console.log('Interest accepted successfully', response);
      }, error => {
        console.error('Error accepting interest', error);
        // Roll back the optimistic UI update if needed
        this.updateInterestStatus(interestId, 'pending');
      });
    }
  }
  

  rejectInterest(interestId: number) {
    const token = localStorage.getItem('token');
    if (token) {
      // Optimistically update the UI
      this.updateInterestStatus(interestId, 'rejected');
      
      this.interestService.rejectInterest(interestId, token).subscribe(response => {
        console.log('Interest rejected successfully', response);
      }, error => {
        console.error('Error rejecting interest', error);
        // Roll back the optimistic UI update if needed
        this.updateInterestStatus(interestId, 'pending');
      });
    }
  }
  updateInterestStatus(interestId: number, newStatus: string) {
    const interest = this.interests.find(i => i.id === interestId);
    if (interest) {
      interest.status = newStatus;
    }
  }

  formatTimestamp(timestamp: string): string | null {
    return this.datePipe.transform(timestamp, 'short') || timestamp;
  }
}

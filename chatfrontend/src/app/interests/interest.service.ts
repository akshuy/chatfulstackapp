import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterestService {
  private baseUrl = 'http://127.0.0.1:8000/chat';

  constructor(private http: HttpClient) { }

  sendInterest(receiverId: number, senderId: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const interestData = { receiver: receiverId, sender: senderId };
    return this.http.post(`${this.baseUrl}/interests/`, interestData, { headers });
  }

  getInterests(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/interests/`, { headers });
  }

  acceptInterest(interestId: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.baseUrl}/interests/${interestId}/accept/`, {}, { headers });
  }

  rejectInterest(interestId: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.baseUrl}/interests/${interestId}/reject/`, {}, { headers });
  }
}

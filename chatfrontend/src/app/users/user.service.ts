import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000/chat/list/';
  private suggestApiUrl = 'http://127.0.0.1:8000/chat/suggest/';  // Suggestion API URL
  
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getSuggestions(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(this.suggestApiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}

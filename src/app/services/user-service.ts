import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient)
  private apiUrl='http://localhost:3000/users'

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}`)
  }
}

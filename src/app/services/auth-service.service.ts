import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IUser} from '../login/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private url_api = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  userLogin(user: string, password: string): Observable<IUser> {
    return this.http.post<IUser>(`${this.url_api}/signin`, {user, password});
  }

  registerUser(email: string, user: string, password: string): Observable<IUser> {
    const payload = {email, user, password};
    return this.http.post<IUser>(`${this.url_api}/register`, payload);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

}

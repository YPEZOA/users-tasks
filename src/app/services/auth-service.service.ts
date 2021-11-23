import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IUser} from '../login/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private url_api = 'http://localhost:3000/api';
  token: string = sessionStorage.getItem('token') || '';

  constructor(private http: HttpClient) {}

  userLogin(user: string, password: string): Observable<IUser> {
    return this.http.post<IUser>(`${this.url_api}/signin`, {user, password});
  }

  registerUser(email: string, user: string, password: string): Observable<IUser> {
    const payload = {email, user, password};
    return this.http.post<IUser>(`${this.url_api}/register`, payload);
  }

  getUserDataById(id: string): Observable<any> {
    return this.http.get<any>(`${this.url_api}/getUserData/${id}`)
  }

  updateUser(id: string | null, payload: any): Observable<any> {
    const header = new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    return this.http.put<any>(`${this.url_api}/updateUser/${id}`, payload, {headers: header})
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

}

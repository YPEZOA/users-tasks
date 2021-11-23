import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url_api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get<any>(`${this.url_api}/getTasks`)
  }

  getUserTasks(userId: string): Observable<any> {
    const payload = { userId }
    return this.http.post<any>(`${this.url_api}/getUserTasks`, payload)
  }
}

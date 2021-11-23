import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url_api = 'http://localhost:3000/api';
  token: string = sessionStorage.getItem('token') || '';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get<any>(`${this.url_api}/getTasks`)
  }

  getUserTasks(userId: string): Observable<any> {
    const payload = {userId}
    return this.http.post<any>(`${this.url_api}/getUserTasks`, payload)
  }

  addTask(title: string, description: string, userId: string): Observable<any> {
    const header = new HttpHeaders({Authorization: `Bearer ${this.token}`})
    let payload = {title, description, userId}
    return this.http.post<any>(`${this.url_api}/new-task`, payload, {headers: header});
  }

  deleteTask(id: string) {
    const header = new HttpHeaders({Authorization: `Bearer ${this.token}`})
    return this.http.delete<any>(`${this.url_api}/delete-task/${id}`, {headers: header})
  }

  updateTask(taskId: string): Observable<any> {
    const payload = {}
    const header = new HttpHeaders({Authorization: `Bearer ${this.token}`})
    return this.http.put(`${this.url_api}/update-task/${taskId}`, payload, {headers: header})
  }

}

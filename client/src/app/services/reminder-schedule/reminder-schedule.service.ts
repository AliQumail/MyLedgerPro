import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ReminderScheduleService {
  url = 'https://localhost:7277/api/ReminderSchedule/';
  constructor(private http: HttpClient) {}

  public list(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}list?userId=${userId}`);
  }

  public create(request: any): Observable<string> {
    return this.http.post(`${this.url}create`, request, { responseType: 'text' });
  }

  public update(id: string, request: any): Observable<string> {
    return this.http.put(`${this.url}update?id=${id}`, request, { responseType: 'text' });
  }

  public toggle(id: string, isActive: boolean): Observable<string> {
    return this.http.patch(`${this.url}toggle?id=${id}&isActive=${isActive}`, {}, { responseType: 'text' });
  }

  public delete(id: string): Observable<string> {
    return this.http.delete(`${this.url}delete?id=${id}`, { responseType: 'text' });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public register(user: any): Observable<string> {
    return this.http.post('https://localhost:7277/api/Auth/register', user, {
      responseType: 'text',
    });
  }

  public login(user: any): Observable<string> {
    return this.http.post('https://localhost:7277/api/Auth/login', user, {
      responseType: 'text',
    });
  }

  public isAuthenticated(){
    if (localStorage.getItem('token') == null) this.router.navigate(['/login']);
  }

  public getTransactions(email: any): Observable<string> {
    return this.http.post(
      'https://localhost:7277/api/Transaction/gettransactionsbyuser',
      email,
      {
        responseType: 'text',
      }
    );
  }
}

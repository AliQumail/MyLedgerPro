import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public register(user: any): Observable<string> {
    return this.http.post('https://localhost:7277/api/User/register', user, {
      responseType: 'text',
    });
  }

  public login(user: any): Observable<string> {
    return this.http.post('https://localhost:7277/api/User/login', user, {
      responseType: 'text',
    });
  }

 
  public addCustomer(customer: any): Observable<string> {
    return this.http.post(
      'https://localhost:7277/api/Customer/addcustomer',
      customer,
      {
        responseType: 'text',
      }
    );
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

  public getCustomers(email: any): Observable<string> {
    return this.http.post(
      'https://localhost:7277/api/Customer/getcustomersbyuser',
      email,
      {
        responseType: 'text',
      }
    );
  }
}

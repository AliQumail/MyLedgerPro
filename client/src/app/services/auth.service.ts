import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public register(user: any): Observable<string> {
    console.log('VALUE ' + user.password);
    return this.http.post('https://localhost:7277/api/User/register', user, {
      responseType: 'text',
    });
  }

  public login(user: any): Observable<string> {
    return this.http.post('https://localhost:7277/api/User/login', user, {
      responseType: 'text',
    });
  }

  public getCustomerByUser(): Observable<any> {
    return this.http.get<any>('https://localhost:7277/api/Customer/getcustomersbyuser');
  }

  public addCustomer(customer: any): Observable<string> {
    return this.http.post('https://localhost:7277/api/Customer/addcustomer', customer, {
      responseType: 'text',
    });
  }
}

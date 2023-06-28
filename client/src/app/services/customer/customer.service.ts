import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  public addCustomer(customer: any): Observable<string> {
    return this.http.post(
      'https://localhost:7277/api/Customer/addcustomer',
      customer,
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

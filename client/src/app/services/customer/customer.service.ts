import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { CustomerSummary } from 'src/app/Models/customersummary';

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

  public updateCustomer(id: string, customer: any): Observable<string> {
    return this.http.put(
      `https://localhost:7277/api/Customer/Update?id=${id}`,
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

  public deleteCustomer(id: any): Observable<boolean> {
    return this.http.delete<boolean>(
      `https://localhost:7277/api/Customer/Delete?id=${id}`,
    );
  }

  public getCustomersByUserId(userId: any): Observable<any> {
    return this.http.get(
      'https://localhost:7277/api/Customer/GetCustomersbyUserId'
      , userId
    );
  }

  getCustomer(id: string): Observable<string> {
    const url = `https://localhost:7277/api/Customer/getcustomer?id=${id}`;
    return this.http.get<string>(url, {
      responseType: 'text' as 'json', // Set the responseType to 'json' if the API returns JSON data
    });
  }

  public getCustomerSummary(id: any): Observable<CustomerSummary[]> {
    return this.http.post<CustomerSummary[]>(
      'https://localhost:7277/api/Customer/customers/summary',
      id,
      {
        responseType: 'json',
      }
    );
  }
}

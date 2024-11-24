import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  url = 'https://localhost:7277/api/';
  constructor(private http: HttpClient) {}

  public addTransaction(transaction: any): Observable<string> {
    return this.http.post(
      this.url + 'Transaction/AddTransaction',
      transaction,
      {
        responseType: 'text',
      }
    );
  }

  public getTransaction(userId: any, customerId: any): Observable<string> {
    return this.http.post(
      this.url + 'Transaction/GetCustomerTransactionsByUser',
      { userId: userId, customerId: customerId },
      {
        responseType: 'text',
      }
    );
  }
  

  public deleteTransaction(id: any): Observable<boolean> {
    return this.http.delete<boolean>(
      this.url + `Transaction/DeleteTransaction/${id}`,
    );
  }

  public updateTransaction(id: string, request: any): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<boolean>(this.url + `Transaction/UpdateTransaction?id=${id}`, request, { headers: headers });
  }

  
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  public addTransaction(transaction: any): Observable<string> {
    return this.http.post(
      'https://localhost:7277/api/Transaction/addtransaction',
      transaction,
      {
        responseType: 'text',
      }
    );
  }

  public getTransaction(userId: any, customerId: any): Observable<string> {
    return this.http.post(
      'https://localhost:7277/api/Transaction/gettransaction',
      { userId: userId, customerId: customerId },
      {
        responseType: 'text',
      }
    );
  }

  public deleteTransaction(id: any): Observable<boolean> {
    return this.http.delete<boolean>(
      `https://localhost:7277/api/Transaction/deletetransaction/${id}`,
    );
  }

  // public updateTransaction(transaction: any): Observable<string> {
  //   return this.http.post(
  //     'https://localhost:7277/api/Transaction/addtransaction',
  //     transaction,
  //     {
  //       responseType: 'text',
  //     }
  //   );
  // }

  public updateTransaction(id: string, request: any): Observable<boolean> {
    const url = `https://localhost:7277/api/Transaction/UpdateTransaction?id=${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<boolean>(url, request, { headers: headers });
  }

  
}

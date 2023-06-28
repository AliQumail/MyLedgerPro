import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  public getTransaction(email: any): Observable<string> {
    return this.http.post(
      'https://localhost:7277/api/Customer/getcustomersbyuser',
      email,
      {
        responseType: 'text',
      }
    );
  }
}

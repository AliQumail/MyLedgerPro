import { Injectable } from '@angular/core';
import { formsJson } from '../data/forms-json';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http: HttpClient) { }

  public getFormsJsonData(): Observable<any> {
    return this.http.get('https://localhost:7277/api/Forms/GetDynamicForms');
  }
}

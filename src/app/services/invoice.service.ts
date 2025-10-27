import { Injectable } from '@angular/core';
import {API_CONFIG} from '../config/api.config';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = API_CONFIG.apiUrl;

  constructor(private http: HttpClient) {}

  getInvoicesByUser(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/invoices`);
  }
}

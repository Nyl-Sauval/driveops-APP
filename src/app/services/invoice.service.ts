import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';

import { Invoice } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = API_CONFIG.apiUrl;

  constructor(private http: HttpClient) { }

  getInvoicesByUser(userId: string) {
    return this.http.get<Invoice[]>(`${this.apiUrl}/users/${userId}/invoices`);
  }

  getRecentInvoices(userId: string, limit: number = 3) {
    return this.http.get<Invoice[]>(`${this.apiUrl}/users/${userId}/invoices/recent?limit=${limit}`);
  }

  getInvoice(id: string) {
    return this.http.get<Invoice>(`${this.apiUrl}/invoices/${id}`);
  }

  createInvoice(invoice: Partial<Invoice>) {
    return this.http.post<Invoice>(`${this.apiUrl}/invoices`, invoice);
  }

  updateInvoice(id: string, invoice: Partial<Invoice>) {
    return this.http.put<Invoice>(`${this.apiUrl}/invoices/${id}`, invoice);
  }

  deleteInvoice(id: string) {
    return this.http.delete(`${this.apiUrl}/invoices/${id}`);
  }

  // TODO: Implement download logic later
  downloadInvoice(id: string) {
    console.warn('Download functionality not yet implemented for invoice:', id);
    // Future implementation: return this.http.get(`${this.apiUrl}/invoices/${id}/download`, { responseType: 'blob' });
  }
}

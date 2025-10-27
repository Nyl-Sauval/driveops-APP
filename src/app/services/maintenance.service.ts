import { Injectable } from '@angular/core';
import {API_CONFIG} from '../config/api.config';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = API_CONFIG.apiUrl;

  constructor(private http: HttpClient) {}

  getMaintenancesByUser(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/maintenances`);
  }

  getFutureMaintenancesByUser(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/maintenances/future`);
  }

  getLateMaintenancesByUser(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/maintenances/late`);
  }
}

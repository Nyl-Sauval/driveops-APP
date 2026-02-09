import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';

import { Maintenance } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = API_CONFIG.apiUrl;

  constructor(private http: HttpClient) { }

  getMaintenancesByUser(userId: string) {
    return this.http.get<Maintenance[]>(`${this.apiUrl}/users/${userId}/maintenances`);
  }

  getFutureMaintenancesByUser(userId: string) {
    return this.http.get<Maintenance[]>(`${this.apiUrl}/users/${userId}/maintenances/future`);
  }

  getUpcomingMaintenances(userId: string, limit: number = 3) {
    return this.http.get<Maintenance[]>(`${this.apiUrl}/users/${userId}/maintenances/upcoming?limit=${limit}`);
  }

  getLateMaintenancesByUser(userId: string) {
    return this.http.get<Maintenance[]>(`${this.apiUrl}/users/${userId}/maintenances/late`);
  }

  getMaintenance(id: string) {
    return this.http.get<Maintenance>(`${this.apiUrl}/maintenances/${id}`);
  }

  createMaintenance(maintenance: Partial<Maintenance>) {
    return this.http.post<Maintenance>(`${this.apiUrl}/maintenances`, maintenance);
  }

  updateMaintenance(id: string, maintenance: Partial<Maintenance>) {
    return this.http.put<Maintenance>(`${this.apiUrl}/maintenances/${id}`, maintenance);
  }

  deleteMaintenance(id: string) {
    return this.http.delete(`${this.apiUrl}/maintenances/${id}`);
  }

  markAsDone(id: string, doneDate: string, doneMileage?: number) {
    return this.http.patch<Maintenance>(`${this.apiUrl}/maintenances/${id}/mark-done`, {
      done: true,
      done_date: doneDate,
      done_mileage: doneMileage
    });
  }
}

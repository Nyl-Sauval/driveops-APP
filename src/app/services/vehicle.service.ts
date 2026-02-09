import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, VehicleCountResponse, DashboardData } from '../models/models';

@Injectable({
  providedIn: 'root'
})

export class VehicleService {
  private apiUrl = API_CONFIG.apiUrl;

  constructor(private http: HttpClient) { }


  getNumberVehiclesByUser(userId: string): Observable<VehicleCountResponse> {
    return this.http.get<VehicleCountResponse>(`${this.apiUrl}/users/${userId}/vehicles/count`);
  }

  getVehiclesByUser(userId: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/users/${userId}/vehicles`);
  }

  getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/vehicles/${id}`);
  }

  createVehicle(vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.apiUrl}/vehicles`, vehicle);
  }

  updateVehicle(id: string, vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/vehicles/${id}`, vehicle);
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehicles/${id}`);
  }

  // New unified dashboard endpoint
  getDashboardData(userId: string): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/users/${userId}/dashboard`);
  }
}

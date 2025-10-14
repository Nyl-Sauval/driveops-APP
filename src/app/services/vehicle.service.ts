import { Injectable } from '@angular/core';
import {API_CONFIG} from '../config/api.config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = API_CONFIG.apiUrl;

  constructor(private http: HttpClient) {}

  getVehiclesByUser(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/vehicles`);
  }
}

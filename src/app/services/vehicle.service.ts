import { Injectable } from '@angular/core';
import {API_CONFIG} from '../config/api.config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

interface CountResponse {
  count: number;
  user_id?: string; // Optionnel
}

@Injectable({
  providedIn: 'root'
})

export class VehicleService {
  private apiUrl = API_CONFIG.apiUrl;

  constructor(private http: HttpClient) {}


  getNumberVehiclesByUser(userId: string) {
    return this.http.get<CountResponse>(`${this.apiUrl}/users/${userId}/vehicles/count`);
  }
}

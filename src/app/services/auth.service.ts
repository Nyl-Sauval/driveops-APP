import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, of, switchMap, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {Router} from '@angular/router';
import {API_CONFIG} from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = API_CONFIG.apiUrl;

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  /** 🔹 Register classique avec email/mot de passe */

   registerWithEmail(firstName: string, lastName: string, email: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post<{ user: any, token: string, expires_in: number }>(
      `${this.apiUrl}/register`,
      { firstName, lastName, email, password, password_confirmation }
    ).pipe(
      tap(res => {
        // Stocke le token (ex: localStorage ou service de state)
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('expires_at', (Date.now() + res.expires_in * 1000).toString());
        this.setAuthenticated(res.user);
      })
    );
  }

  /** 🔹 Login classique avec email/mot de passe */
  loginWithEmail(email: string, password: string): Observable<any> {
    return this.http.post<{ user: any, token: string, expires_in: number }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(res => {
        // Stocke le token (ex: localStorage ou service de state)
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('expires_at', (Date.now() + res.expires_in * 1000).toString());
        this.setAuthenticated(res.user);
      })
    );
  }

  /** 🔹 Déconnexion */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    this.setAuthenticated(null);
    console.log('User logged out, token removed');
    this.router.navigate(['/guest']);
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('access_token');
    const expires = localStorage.getItem('expires_at');
    console.log('Token validity check:', { token, expires });
    console.log('Le token expire dans :', expires ? new Date(+expires) : 'Jamais');
    return !!token && (!!expires ? Date.now() < +expires : true);
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  setAuthenticated(user: any) {
    this.currentUserSubject.next(user);
  }

  getMe(): Observable<any> {
    if (!this.isTokenValid()) {
      this.logout();
      return throwError(() => new Error('Token expired'));
    }

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/me`, { headers }).pipe(
      catchError(err => {
        if (err.status === 401) this.logout(); // logout si backend dit non
        return throwError(() => err);
      })
    );
  }

  private handleAuthSuccess(response: any) {

  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { API_CONFIG } from '../config/api.config';
import { AuthResponse, User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = API_CONFIG.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  /** 🔹 Register classique avec email/mot de passe */

  registerWithEmail(firstName: string, lastName: string, email: string, password: string, password_confirmation: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
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
  loginWithEmail(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
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
    localStorage.removeItem('authToken'); // Remove remember me token
    this.setAuthenticated(null);
    this.router.navigate(['/guest']);
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('access_token');
    const expires = localStorage.getItem('expires_at');
    return !!token && (!!expires ? Date.now() < +expires : true);
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  setAuthenticated(user: User | null) {
    this.currentUserSubject.next(user);
  }

  getMe(): Observable<User | null> {
    const token = localStorage.getItem('access_token');

    if (!this.isTokenValid() || !token) {
      this.logout();
      return of(null); // renvoie un flux vide plutôt qu'une erreur
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<User>(`${this.apiUrl}/me`, { headers }).pipe(
      tap(user => {
        // Met à jour le BehaviorSubject pour les composants abonnés
        this.currentUserSubject.next(user);
      }),
      catchError(err => {
        if (err.status === 401) {
          this.logout();
          return of(null);
        }
        return throwError(() => err);
      })
    );
  }

  /** Verify if a token is still valid */
  verifyToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<User>(`${this.apiUrl}/me`, { headers }).pipe(
      tap(user => {
        // Token is valid, set user
        localStorage.setItem('access_token', token);
        this.currentUserSubject.next(user);
      }),
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }
}

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(MatSnackBar);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur est survenue';

            if (error.error instanceof ErrorEvent) {
                // Erreur côté client
                errorMessage = `Erreur: ${error.error.message}`;
            } else {
                // Erreur côté serveur
                if (error.status === 401) {
                    errorMessage = 'Session expirée, veuillez vous reconnecter';
                    localStorage.removeItem('access_token');
                    router.navigate(['/login']);
                } else if (error.status === 403) {
                    errorMessage = 'Accès interdit';
                } else if (error.status === 404) {
                    errorMessage = 'Ressource introuvable';
                } else if (error.status >= 500) {
                    errorMessage = 'Erreur serveur, veuillez réessayer plus tard';
                } else if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                }
            }

            snackBar.open(errorMessage, 'Fermer', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });

            return throwError(() => error);
        })
    );
};

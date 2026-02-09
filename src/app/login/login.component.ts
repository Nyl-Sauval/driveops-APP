import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    MatIcon,
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  hidePassword = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Check if user has a saved session
    this.checkSavedSession();

    // Initialisation Google Auth
    /*
    google.accounts.id.initialize({
      client_id: 'TON_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      callback: (response: any) => this.loginWithGoogle(response.credential)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large' }
    );*/
  }

  /** Check if user has saved credentials */
  private checkSavedSession() {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      // Verify token is still valid and auto-login
      this.authService.verifyToken(savedToken).subscribe({
        next: (isValid: boolean) => {
          if (isValid) {
            this.router.navigate(['/dashboard']);
          } else {
            localStorage.removeItem('authToken');
          }
        },
        error: () => {
          localStorage.removeItem('authToken');
        }
      });
    }
  }

  /** 🔹 Login classique */
  onSubmit() {
    if (!this.loginForm.valid) return;

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.loginWithEmail(email, password).subscribe(res => {
      // If remember me is checked, save token to localStorage
      if (rememberMe && res.token) {
        localStorage.setItem('authToken', res.token);
      } else {
        // Clear any existing token if not checking remember me
        localStorage.removeItem('authToken');
      }

      this.router.navigate(['/dashboard']);
    });
  }
}

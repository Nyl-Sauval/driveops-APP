import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {MatInput, MatInputModule} from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { AuthService } from '../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    MatButton,
    MatInput,
    MatCard,
    MatFormField,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    MatInputModule,
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
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

  /** 🔹 Login classique */
  onSubmit() {
    if (!this.loginForm.valid) return;

    const { email, password } = this.loginForm.value;

    this.authService.loginWithEmail(email, password).subscribe( res => {
      console.log('Login successful', res.user);
      // rediriger vers la page d'accueil ou tableau de bord
      this.router.navigate(['/dashboard']);
    });
  }
}

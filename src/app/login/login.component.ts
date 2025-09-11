import { Component } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatError, MatInput} from '@angular/material/input';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    MatError,
    MatIcon,
    MatButton,
    MatInput,
    MatCard,
    MatFormField,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      // 👉 Appel API / AuthService ici
    }
  }

  loginWithGoogle() {
    console.log('Google Auth triggered');
    // 👉 Intégration Firebase/Auth0/Backend plus tard
  }
}

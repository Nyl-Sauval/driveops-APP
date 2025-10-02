import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    MatButton,
    RouterLink,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatIcon,
    MatFormFieldModule,
    MatInputModule
  ],
  styleUrls: ['../login/login.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if(!this.registerForm.valid) return;

    const {firstName, lastName, email, password, confirmPassword} = this.registerForm.value;
    if(password !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }
    this.authService.registerWithEmail(firstName, lastName, email, password, confirmPassword).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription'
    });
  }

  registerWithGoogle() {
    console.log('Google Register triggered');
  }
}

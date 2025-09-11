import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Register data:', this.registerForm.value);
      // 👉 Appel API / AuthService ici
    }
  }

  registerWithGoogle() {
    console.log('Google Register triggered');
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <div class="auth-card">
        <h1>Reset Password</h1>
        <p class="subtitle">Enter your email to receive password reset instructions</p>

        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="form">
          <div class="form-field">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              required
              [class.error]="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched"
            >
            <div class="error-message" *ngIf="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched">
              <span *ngIf="forgotPasswordForm.get('email')?.hasError('required')">
                Email is required
              </span>
              <span *ngIf="forgotPasswordForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </span>
            </div>
          </div>

          <div class="actions">
            <button type="button" class="btn-secondary" (click)="navigateToLogin()">Back to Login</button>
            <button type="submit" class="btn-primary" [disabled]="!forgotPasswordForm.valid || isLoading">
              <div class="spinner" *ngIf="isLoading"></div>
              <span *ngIf="!isLoading">Send Reset Link</span>
            </button>
          </div>
        </form>

        <div class="message {{messageType}}" *ngIf="message">
          {{message}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #1a237e, #0d47a1);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 32px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
      margin: 0 0 8px;
      color: #1a237e;
      font-size: 24px;
    }

    .subtitle {
      margin: 0 0 24px;
      color: #666;
      font-size: 16px;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    input {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #1a237e;
    }

    input.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #1a237e;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0d47a1;
    }

    .btn-secondary {
      background-color: transparent;
      color: #1a237e;
    }

    .btn-secondary:hover {
      background-color: rgba(26, 35, 126, 0.1);
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-right: 8px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .message {
      margin-top: 16px;
      padding: 12px;
      border-radius: 4px;
      font-size: 14px;
    }

    .message.success {
      background-color: #d4edda;
      color: #155724;
    }

    .message.error {
      background-color: #f8d7da;
      color: #721c24;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  message = '';
  messageType = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.message = '';
      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.forgotPassword({ email }).subscribe({
        next: (response) => {
          this.message = 'Password reset instructions have been sent to your email';
          this.messageType = 'success';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.message = error.error?.message || 'An error occurred while processing your request';
          this.messageType = 'error';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <div class="auth-card">
        <h1>Reset Your Password</h1>
        <p class="subtitle">Enter your new password below</p>

        <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" class="form">
          <div class="form-field">
            <label for="newPassword">New Password</label>
            <input 
              type="password" 
              id="newPassword"
              formControlName="newPassword" 
              required
              [class.error]="resetPasswordForm.get('newPassword')?.invalid && resetPasswordForm.get('newPassword')?.touched"
            >
            <div class="error-message" *ngIf="resetPasswordForm.get('newPassword')?.invalid && resetPasswordForm.get('newPassword')?.touched">
              <span *ngIf="resetPasswordForm.get('newPassword')?.hasError('required')">
                Password is required
              </span>
              <span *ngIf="resetPasswordForm.get('newPassword')?.hasError('minlength')">
                Password must be at least 8 characters long
              </span>
            </div>
          </div>

          <div class="form-field">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              formControlName="confirmPassword" 
              required
              [class.error]="resetPasswordForm.get('confirmPassword')?.invalid && resetPasswordForm.get('confirmPassword')?.touched"
            >
            <div class="error-message" *ngIf="resetPasswordForm.get('confirmPassword')?.invalid && resetPasswordForm.get('confirmPassword')?.touched">
              <span *ngIf="resetPasswordForm.get('confirmPassword')?.hasError('required')">
                Password confirmation is required
              </span>
              <span *ngIf="resetPasswordForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </span>
            </div>
          </div>

          <div class="actions">
            <button type="button" class="btn-secondary" (click)="navigateToLogin()">Back to Login</button>
            <button type="submit" class="btn-primary" [disabled]="!resetPasswordForm.valid || isLoading">
              <div class="spinner" *ngIf="isLoading"></div>
              <span *ngIf="!isLoading">Reset Password</span>
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
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  token: string = '';
  email: string = '';
  message: string = '';
  messageType: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Get token and email from URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];

      if (!this.token || !this.email) {
        this.message = 'Invalid reset password link';
        this.messageType = 'error';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
        return;
      }

      // Validate the token
      this.authService.validateResetToken(this.token).subscribe({
        next: (response) => {
          if (!response.success) {
            this.message = 'This password reset link has expired';
            this.messageType = 'error';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          }
        },
        error: (error) => {
          this.message = 'Invalid or expired reset link';
          this.messageType = 'error';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
      });
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.message = '';

      const resetData = {
        token: this.token,
        email: this.email,
        newPassword: this.resetPasswordForm.get('newPassword')?.value,
        confirmPassword: this.resetPasswordForm.get('confirmPassword')?.value
      };

      this.authService.resetPassword(resetData).subscribe({
        next: (response) => {
          this.message = 'Password has been reset successfully';
          this.messageType = 'success';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.message = error.error?.message || 'An error occurred while resetting your password';
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
  }}
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
        }
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherTrackerApiService } from '../../services/weather-tracker-api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Set New Password</h1>
        <div class="stars-bg"></div>

        <div *ngIf="!resetSuccess" class="form-container">
          <p class="description">Please enter your new password below.</p>

          <div class="form-group">
            <input
              type="password"
              [(ngModel)]="newPassword"
              placeholder="New password"
              [class.error]="error"
              (input)="error = ''"
            >
          </div>

          <div class="form-group">
            <input
              type="password"
              [(ngModel)]="confirmPassword"
              placeholder="Confirm new password"
              [class.error]="error"
              (input)="error = ''"
            >
          </div>

          <div class="password-requirements">
            <p>Password must contain:</p>
            <ul>
              <li [class.met]="newPassword.length >= 8">At least 8 characters</li>
              <li [class.met]="hasUpperCase">At least one uppercase letter</li>
              <li [class.met]="hasLowerCase">At least one lowercase letter</li>
              <li [class.met]="hasNumber">At least one number</li>
            </ul>
          </div>

          <div class="error-message" *ngIf="error">{{ error }}</div>

          <button
            class="submit-btn"
            (click)="onSubmit()"
            [disabled]="isLoading || !isValidPassword()"
          >
            <span *ngIf="!isLoading">Reset Password</span>
            <span *ngIf="isLoading" class="loading">Resetting...</span>
          </button>
        </div>

        <div *ngIf="resetSuccess" class="success-container">
          <div class="success-icon">✓</div>
          <h2>Password Reset Successfully</h2>
          <p>Your password has been changed. You can now log in with your new password.</p>
          <button class="submit-btn" routerLink="/login">Go to Login</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #0a0d1a 0%, #1a1f35 100%);
    }

    .auth-card {
      background: rgba(26, 31, 53, 0.8);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 400px;
      position: relative;
      overflow: hidden;
    }

    .stars-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(2px 2px at 20px 30px, #eee 100%, transparent),
                        radial-gradient(2px 2px at 40px 70px, #fff 100%, transparent),
                        radial-gradient(2px 2px at 50px 160px, #ddd 100%, transparent),
                        radial-gradient(2px 2px at 90px 40px, #fff 100%, transparent),
                        radial-gradient(2px 2px at 130px 80px, #fff 100%, transparent);
      background-size: 200px 200px;
      opacity: 0.1;
      z-index: 0;
    }

    h1 {
      color: #fff;
      text-align: center;
      margin-bottom: 1.5rem;
      font-size: 2rem;
      position: relative;
      z-index: 1;
    }

    .description {
      color: #b8c5d6;
      text-align: center;
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .form-group {
      margin-bottom: 1.5rem;
      position: relative;
      z-index: 1;
    }

    input {
      width: 100%;
      padding: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #fff;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #4a90e2;
        background: rgba(255, 255, 255, 0.15);
      }

      &.error {
        border-color: #ff6b6b;
      }
    }

    .password-requirements {
      margin: 1.5rem 0;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      position: relative;
      z-index: 1;

      p {
        color: #b8c5d6;
        margin-bottom: 0.5rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          color: #6c7293;
          margin: 0.3rem 0;
          padding-left: 1.5rem;
          position: relative;

          &:before {
            content: "×";
            position: absolute;
            left: 0;
            color: #ff6b6b;
          }

          &.met {
            color: #b8c5d6;
            &:before {
              content: "✓";
              color: #4caf50;
            }
          }
        }
      }
    }

    .submit-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .loading {
      display: inline-block;
      position: relative;
      &:after {
        content: "...";
        animation: dots 1.5s infinite;
      }
    }

    .error-message {
      color: #ff6b6b;
      text-align: center;
      margin: 1rem 0;
      font-size: 0.9rem;
    }

    .success-container {
      text-align: center;
      position: relative;
      z-index: 1;

      .success-icon {
        font-size: 3rem;
        color: #4caf50;
        margin-bottom: 1rem;
      }

      h2 {
        color: #fff;
        margin-bottom: 1rem;
      }

      p {
        color: #b8c5d6;
        margin-bottom: 2rem;
      }
    }

    @keyframes dots {
      0%, 20% { content: "."; }
      40% { content: ".."; }
      60% { content: "..."; }
      80%, 100% { content: ""; }
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  email = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  isLoading = false;
  resetSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: WeatherTrackerApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';

      if (!this.token || !this.email) {
        this.error = 'Invalid reset link';
      }
    });
  }

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  get hasLowerCase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  isValidPassword(): boolean {
    return this.newPassword.length >= 8 &&
           this.hasUpperCase &&
           this.hasLowerCase &&
           this.hasNumber &&
           this.newPassword === this.confirmPassword;
  }

  async onSubmit() {
    if (!this.isValidPassword()) {
      this.error = 'Please ensure all password requirements are met';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      await this.apiService.resetPassword({
        token: this.token,
        email: this.email,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      }).toPromise();

      this.resetSuccess = true;
    } catch (error: any) {
      this.error = error.error?.message || 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}

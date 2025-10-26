import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherTrackerApiService } from '../../services/weather-tracker-api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Reset Password</h1>
        <div class="stars-bg"></div>
        
        <div *ngIf="!emailSent" class="form-container">
          <p class="description">Enter your email address and we'll send you a link to reset your password.</p>
          
          <div class="form-group">
            <input
              type="email"
              [(ngModel)]="email"
              placeholder="Enter your email"
              [class.error]="error"
              (input)="error = ''"
            >
          </div>

          <div class="error-message" *ngIf="error">{{ error }}</div>

          <button 
            class="submit-btn" 
            (click)="onSubmit()"
            [disabled]="isLoading"
          >
            <span *ngIf="!isLoading">Send Reset Link</span>
            <span *ngIf="isLoading" class="loading">Sending...</span>
          </button>

          <div class="links">
            <a routerLink="/login">Back to Login</a>
          </div>
        </div>

        <div *ngIf="emailSent" class="success-container">
          <div class="success-icon">✉️</div>
          <h2>Check Your Email</h2>
          <p>We've sent password reset instructions to:</p>
          <p class="email-highlight">{{ email }}</p>
          <p class="note">The link will expire in 1 hour for security reasons.</p>
          <button class="submit-btn" routerLink="/login">Return to Login</button>
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

      &:hover {
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

    .links {
      text-align: center;
      margin-top: 1.5rem;

      a {
        color: #4a90e2;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s ease;

        &:hover {
          color: #357abd;
        }
      }
    }

    .success-container {
      text-align: center;
      position: relative;
      z-index: 1;

      .success-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      h2 {
        color: #fff;
        margin-bottom: 1rem;
      }

      p {
        color: #b8c5d6;
        margin-bottom: 0.5rem;
      }

      .email-highlight {
        color: #4a90e2;
        font-weight: bold;
        margin: 1rem 0;
      }

      .note {
        font-size: 0.9rem;
        color: #6c7293;
        margin-top: 1rem;
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
export class ForgotPasswordComponent {
  email = '';
  error = '';
  isLoading = false;
  emailSent = false;

  constructor(
    private apiService: WeatherTrackerApiService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.email) {
      this.error = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      await this.apiService.forgotPassword({ email: this.email }).toPromise();
      this.emailSent = true;
    } catch (error: any) {
      this.error = error.error?.message || 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
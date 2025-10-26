import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  LoginDto,
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ValidateTokenDto,
  ValidateTokenResponseDto,
  UserDto
} from '../models/astronomy.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token on init
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('current_user');

    if (token && user) {
      this.tokenSubject.next(token);
      // Merge a persisted profile picture stored by email
      const parsedUser: UserDto = JSON.parse(user);
      const savedPic = localStorage.getItem(`profile_picture:${parsedUser.email}`);
      const mergedUser = savedPic && !parsedUser.profilePicture
        ? { ...parsedUser, profilePicture: savedPic }
        : parsedUser;
      this.currentUserSubject.next(mergedUser);
      // Keep storage in sync if we merged
      localStorage.setItem('current_user', JSON.stringify(mergedUser));
    }
  }

  public get currentUserValue(): UserDto | null {
    return this.currentUserSubject.value;
  }

  public get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.tokenValue;
  }

  login(credentials: LoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Check if we have a temporary profile picture saved during registration
          const tempProfilePicture = localStorage.getItem('temp_profile_picture');
          const tempUserEmail = localStorage.getItem('temp_user_email');

          if (tempProfilePicture && tempUserEmail === credentials.email) {
            // Add the profile picture to the user object if it's missing
            if (!response.user.profilePicture) {
              response.user.profilePicture = tempProfilePicture;
            }
            // Clean up temp storage
            localStorage.removeItem('temp_profile_picture');
            localStorage.removeItem('temp_user_email');
          }

          // Also try to restore a previously saved profile picture for this email
          const persistedPic = localStorage.getItem(`profile_picture:${response.user.email}`);
          if (persistedPic && !response.user.profilePicture) {
            response.user.profilePicture = persistedPic;
          }

          // Store token and user info
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('current_user', JSON.stringify(response.user));

          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.user);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterDto): Observable<RegisterResponseDto> {
    // Temporarily save profile picture in localStorage for testing
    if (userData.profilePicture) {
      localStorage.setItem('temp_profile_picture', userData.profilePicture);
      localStorage.setItem('temp_user_email', userData.email);
      // Persist by-email so it survives logout/login
      localStorage.setItem(`profile_picture:${userData.email}`, userData.profilePicture);
    }

    return this.http.post<RegisterResponseDto>(`${this.baseUrl}/auth/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  validateToken(token: string): Observable<ValidateTokenResponseDto> {
    const validateData: ValidateTokenDto = { token };
    return this.http.post<ValidateTokenResponseDto>(`${this.baseUrl}/auth/validate`, validateData)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Remove stored data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');

    // Update subjects
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  // Get authorization header for HTTP requests
  getAuthHeaders(): { [header: string]: string } {
    const token = this.tokenValue;
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  }

  // Method to change user password
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return this.http.post<any>(`${this.baseUrl}/auth/change-password`, payload, {
      headers: {
        'Authorization': `Bearer ${this.tokenValue}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Method to update profile picture
  updateProfilePicture(profilePicture: string): Observable<UserDto> {
    const currentUser = this.currentUserValue;
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Update the user object with the new profile picture
    const updatedUser = {
      ...currentUser,
      profilePicture
    };

    // Persist by-email so it survives logout/login cycles (fallback if backend not reachable)
    localStorage.setItem(`profile_picture:${currentUser.email}`, profilePicture);

    // Call backend to persist in database and sync local state
    return this.http.put<UserDto>(`${this.baseUrl}/auth/profile-picture`, { profilePicture }, {
      headers: {
        'Authorization': `Bearer ${this.tokenValue}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap((serverUser: UserDto) => {
        const merged = { ...updatedUser, ...serverUser };
        localStorage.setItem('current_user', JSON.stringify(merged));
        this.currentUserSubject.next(merged);
      }),
      catchError(this.handleError)
    );
  }

  // Password Reset Methods
  forgotPassword(data: ForgotPasswordDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/forgot-password`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  resetPassword(data: ResetPasswordDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/reset-password`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/auth/validate-reset-token/${token}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 409) {
        errorMessage = 'Email already registered';
      } else if (error.status === 400) {
        errorMessage = 'Invalid data provided';
      } else if (error.status === 404) {
        errorMessage = 'User not found';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.error?.message || `Error Code: ${error.status}`;
      }
    }

    console.error('Auth Service Error:', errorMessage);
    return throwError(() => error);
  }
}

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Only add auth header for our API requests
  if (req.url.startsWith(environment.apiUrl)) {
    const authToken = authService.tokenValue;

    if (authToken) {
      // Clone the request and add the authorization header
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      return next(authReq);
    } else {
      // Add content-type for non-auth requests
      const contentReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
      return next(contentReq);
    }
  }

  return next(req);
};

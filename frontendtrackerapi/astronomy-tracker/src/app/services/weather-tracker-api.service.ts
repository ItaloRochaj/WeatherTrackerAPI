import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  ApodDto,
  ApodTrendDto,
  RatingDto,
  HealthResponse
} from '../models/astronomy.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherTrackerApiService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Helper method to get headers with auth
  private getHeaders(): HttpHeaders {
    const headers = this.authService.getAuthHeaders();
    return new HttpHeaders(headers);
  }

  // NASA APOD Endpoints
  getApod(date?: string): Observable<ApodDto> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }

    return this.http.get<ApodDto>(`${this.baseUrl}/nasa/apod`, {
      params,
      headers: this.getHeaders()
    }).pipe(
      retry(2),
      catchError((error) => {
        console.warn('APOD API failed, falling back to mock data:', error);
        return this.getMockApod();
      })
    );
  }

  getRandomApod(): Observable<ApodDto> {
    return this.http.get<ApodDto>(`${this.baseUrl}/nasa/apod/random`, {
      headers: this.getHeaders()
    }).pipe(
      retry(2),
      catchError((error) => {
        console.warn('Random APOD API failed, falling back to mock data:', error);
        return this.getMockApod();
      })
    );
  }

  getApodRange(startDate: string, endDate: string): Observable<ApodDto[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ApodDto[]>(`${this.baseUrl}/nasa/apod/range`, {
      params,
      headers: this.getHeaders()
    }).pipe(
      retry(2),
      catchError((error) => {
        console.warn('APOD range API failed, falling back to mock data:', error);
        return of([]);
      })
    );
  }

  getStoredApods(page: number = 1, pageSize: number = 12): Observable<ApodDto[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApodDto[]>(`${this.baseUrl}/nasa/apod/stored`, {
      params,
      headers: this.getHeaders()
    }).pipe(
      retry(2),
      catchError((error) => {
        console.warn('Stored APODs API failed, falling back to mock data:', error);
        return of([]);
      })
    );
  }

  // Rating and Favorites
  updateRating(id: string, rating: number): Observable<ApodDto> {
    const ratingData: RatingDto = { rating };

    return this.http.put<ApodDto>(`${this.baseUrl}/nasa/apod/${id}/rating`, ratingData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  toggleFavorite(id: string): Observable<ApodDto> {
    return this.http.post<ApodDto>(`${this.baseUrl}/nasa/apod/${id}/favorite`, null, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Trends and Analytics
  getTrends(startDate: string, endDate: string): Observable<ApodTrendDto[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ApodTrendDto[]>(`${this.baseUrl}/nasa/apod/trends`, {
      params,
      headers: this.getHeaders()
    }).pipe(
      retry(2),
      catchError((error) => {
        console.warn('Trends API failed:', error);
        return of([]);
      })
    );
  }

  // Sync from NASA
  syncApodFromNasa(date: string): Observable<ApodDto> {
    const params = new HttpParams().set('date', date);

    return this.http.post<ApodDto>(`${this.baseUrl}/nasa/apod/sync`, null, {
      params,
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Health check
  healthCheck(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/test/health`).pipe(
      catchError(this.handleError)
    );
  }

  ping(): Observable<string> {
    return this.http.get(`${this.baseUrl}/test/ping`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  // Mock data fallbacks for development
  getMockApod(): Observable<ApodDto> {
    const mockData: ApodDto = {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      title: "Galaxy NGC 1365: Island Universe",
      explanation: "A spectacular spiral galaxy located 56 million light-years away in the constellation Fornax. This beautiful galaxy showcases intricate spiral arms filled with star-forming regions and cosmic dust lanes.",
      url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop",
      hdUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop",
      mediaType: "image",
      copyright: "NASA/ESA Hubble Space Telescope",
      viewCount: 0,
      rating: 0,
      isFavorited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return of(mockData);
  }

  getMockEvents(): Observable<any[]> {
    const mockEvents = [
      {
        id: '1',
        title: 'Meteor Shower',
        description: 'Witness a spectacular meteor shower with shooting stars across the night sky.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'meteor_shower',
        visibility: 'Worldwide after midnight',
        imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop'
      },
      {
        id: '2',
        title: 'Lunar Eclipse',
        description: 'Observe a breath-taking lunar eclipse as the Earth\'s shadow covers the Moon.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'lunar_eclipse',
        visibility: 'Visible from Americas',
        imageUrl: 'https://images.unsplash.com/photo-1518066000-e95de0088e28?w=400&h=300&fit=crop'
      },
      {
        id: '3',
        title: 'Planetary Alignment',
        description: 'See planets align in a rare celestial event visible to the naked eye.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'planetary_alignment',
        visibility: 'Best viewed at dawn',
        imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop'
      }
    ];

    return of(mockEvents);
  }

  getMockHistoricalData(): Observable<any[]> {
    const mockData = [
      {
        id: '1',
        date: '2024-01-15',
        title: 'Perseid Meteor Shower Peak',
        description: 'Annual meteor shower with up to 60 meteors per hour at peak.',
        imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop',
        tags: ['meteor', 'annual', 'August']
      },
      {
        id: '2',
        title: 'Total Solar Eclipse',
        date: '2024-04-08',
        description: 'Total solar eclipse visible across North America.',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['eclipse', 'solar', 'rare']
      }
    ];

    return of(mockData);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Authentication required. Please log in.';
        // Optionally trigger logout
        this.authService.logout();
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden. Insufficient permissions.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.status === 503) {
        errorMessage = 'NASA service temporarily unavailable.';
      } else {
        errorMessage = error.error?.message || `Error Code: ${error.status}`;
      }
    }

    console.error('Astronomy Service Error:', errorMessage);
    return throwError(() => errorMessage);
  }
}

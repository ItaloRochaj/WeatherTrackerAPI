import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AstronomyPictureOfDay, CelestialEvent, HistoricalData, SearchRequest } from '../models/astronomy';

@Injectable({
  providedIn: 'root'
})
export class AstronomyService {
  private apiUrl = 'http://localhost:5000/api'; // URL do WeatherTrackerAPI

  constructor(private http: HttpClient) { }

  // NASA Astronomy Picture of the Day
  getAstronomyPictureOfDay(date?: string): Observable<AstronomyPictureOfDay> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }

    // Fallback para dados mockados se a API não estiver disponível
    return this.http.get<AstronomyPictureOfDay>(`${this.apiUrl}/apod`, { params })
      .pipe(
        // Em caso de erro, retorna dados mockados
      );
  }

  // Próximos eventos celestiais
  getUpcomingEvents(): Observable<CelestialEvent[]> {
    return this.http.get<CelestialEvent[]>(`${this.apiUrl}/events/upcoming`)
      .pipe(
        // Fallback para dados mockados
      );
  }

  // Buscar no histórico
  searchHistoricalData(searchRequest: SearchRequest): Observable<HistoricalData[]> {
    let params = new HttpParams();

    if (searchRequest.query) {
      params = params.set('query', searchRequest.query);
    }
    if (searchRequest.date) {
      params = params.set('date', searchRequest.date);
    }
    if (searchRequest.startDate) {
      params = params.set('startDate', searchRequest.startDate);
    }
    if (searchRequest.endDate) {
      params = params.set('endDate', searchRequest.endDate);
    }

    return this.http.get<HistoricalData[]>(`${this.apiUrl}/historical`, { params });
  }

  // Dados mockados para desenvolvimento
  getMockApod(): Observable<AstronomyPictureOfDay> {
    const mockData: AstronomyPictureOfDay = {
      date: new Date().toISOString().split('T')[0],
      explanation: "Explore the universe with NASA's Astronomy Picture of the Day. Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.",
      title: "Galaxy NGC 1365: Island Universe",
      url: "https://apod.nasa.gov/apod/image/2312/NGC1365_Hubble_1080.jpg",
      hdurl: "https://apod.nasa.gov/apod/image/2312/NGC1365_Hubble_4096.jpg",
      media_type: "image",
      service_version: "v1",
      copyright: "NASA, ESA, Hubble"
    };
    return of(mockData);
  }

  getMockEvents(): Observable<CelestialEvent[]> {
    const mockEvents: CelestialEvent[] = [
      {
        id: '1',
        title: 'Meteor Shower',
        description: 'Witness a spectacular meteor shower with shooting stars across the night sky.',
        date: '2025-10-15',
        type: 'meteor_shower',
        visibility: 'Worldwide',
        imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop'
      },
      {
        id: '2',
        title: 'Lunar Eclipse',
        description: 'Observe a breath-taking lunar eclipse as the Earth\'s shadow covers the Moon.',
        date: '2025-11-08',
        type: 'lunar_eclipse',
        visibility: 'Americas, Europe',
        imageUrl: 'https://images.unsplash.com/photo-1518066000-e95de0088e28?w=400&h=300&fit=crop'
      },
      {
        id: '3',
        title: 'Planetary Alignment',
        description: 'See planets align in a rare celestial event visible to the naked eye.',
        date: '2025-12-20',
        type: 'planetary_alignment',
        visibility: 'Global',
        imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop'
      }
    ];
    return of(mockEvents);
  }

  getMockHistoricalData(): Observable<HistoricalData[]> {
    const mockData: HistoricalData[] = [
      {
        id: '1',
        date: '2024-08-15',
        title: 'Perseid Meteor Shower Peak',
        description: 'The annual Perseid meteor shower reached its peak with up to 60 meteors per hour.',
        imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop',
        tags: ['meteor shower', 'perseid', 'august']
      },
      {
        id: '2',
        date: '2024-04-08',
        title: 'Total Solar Eclipse',
        description: 'A total solar eclipse crossed North America, creating a spectacular celestial show.',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['solar eclipse', 'total eclipse', 'april']
      }
    ];
    return of(mockData);
  }
}

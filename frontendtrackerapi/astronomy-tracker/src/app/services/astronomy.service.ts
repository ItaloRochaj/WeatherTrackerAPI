import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AstronomyPictureOfDay, CelestialEvent, HistoricalData, SearchRequest, ApodCalendarItem } from '../models/astronomy';

@Injectable({
  providedIn: 'root'
})
export class AstronomyService {
  private apiUrl = 'http://localhost:5170/api'; // URL do WeatherTrackerAPI (alinhado com backend atual)

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

  // APOD calendário por mês (proxy pelo backend para evitar CORS)
  getApodCalendarMonth(year: number, month: number): Observable<ApodCalendarItem[]> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);
    // Nota: endpoint correto no backend é /nasa/apod/calendar
    return this.http.get<ApodCalendarItem[]>(`${this.apiUrl}/nasa/apod/calendar`, { params });
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
    // Realistic upcoming events with representative images (dates in the future)
    const mockEvents: CelestialEvent[] = [
      {
        id: 'leonids-2025',
        title: 'Leonids Meteor Shower Peak',
        description: 'Annual Leonids peak with fast, bright meteors originating from comet Tempel–Tuttle.',
        date: '2025-11-18',
        type: 'meteor_shower',
        visibility: 'Best before dawn, both hemispheres (dark skies)',
        duration: 'Overnight peak',
        // Use the attached image stored locally in assets
        imageUrl: 'assets/images/Leonids Meteor Shower Peak.png'
      },
      {
        id: 'venus-jupiter-2025',
        title: 'Venus–Jupiter Conjunction',
        description: 'Brilliant pairing of Venus and Jupiter low in the evening sky; a striking planetary alignment.',
        date: '2025-12-06',
        type: 'planetary_alignment',
        visibility: 'Global, low western sky after sunset',
        duration: '1–2 hours after sunset',
        // Use local asset image for conjunction
        imageUrl: 'assets/images/hero-image.fill.size_1248x702.v1699836321.jpg'
      },
      {
        id: 'geminids-2025',
        title: 'Geminids Meteor Shower Peak',
        description: 'One of the best annual showers with numerous slow, colorful meteors from asteroid 3200 Phaethon.',
        date: '2025-12-14',
        type: 'meteor_shower',
        visibility: 'Worldwide; best after midnight',
        duration: 'All night peak',
        // Use local asset provided in src/assets/images
        imageUrl: 'assets/images/geminid-meteor-shower-gty-lv-231211-2_1702319757396_hpMain.avif'
      },
      {
        id: 'lunar-eclipse-2026-03',
        title: 'Partial Lunar Eclipse',
        description: 'Earth’s shadow partially covers the Moon — easy to watch with the naked eye.',
        date: '2026-03-03',
        type: 'lunar_eclipse',
        visibility: 'Americas, Europe, Africa (weather permitting)',
        duration: '2–3 hours',
        // Use local asset provided in src/assets/images
        imageUrl: 'assets/images/partial-lunar-eclipse-cropped.jpg'
      },
      {
        id: 'total-solar-eclipse-2026',
        title: 'Total Solar Eclipse',
        description: 'A dramatic total eclipse of the Sun; path of totality crosses parts of the Arctic, Iceland, and Spain.',
        date: '2026-08-12',
        type: 'solar_eclipse',
        visibility: 'Path of totality: Greenland, Iceland, Spain; partial elsewhere in Europe',
        duration: 'Several minutes in totality',
        // Use local asset provided in src/assets/images
        imageUrl: 'assets/images/totality-corona.jpg'
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

export interface AstronomyPictureOfDay {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

export interface CelestialEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'meteor_shower' | 'lunar_eclipse' | 'planetary_alignment' | 'solar_eclipse' | 'other';
  visibility: string;
  duration: string;
  imageUrl?: string;
}

export interface HistoricalData {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export interface SearchRequest {
  query?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface ApodCalendarItem {
  date: string;      // ISO date string
  title: string;
  imageUrl: string;
  pageUrl: string;
}

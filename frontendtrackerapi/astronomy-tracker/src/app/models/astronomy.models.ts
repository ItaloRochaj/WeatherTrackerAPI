// Models baseados na WeatherTrackerAPI
export interface ApodDto {
  id: string;
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdUrl?: string;
  mediaType: string;
  copyright?: string;
  viewCount: number;
  rating: number;
  isFavorited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApodResponse {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
  service_version?: string;
}

export interface ApodTrendDto {
  date: string;
  viewCount: number;
  rating: number;
  title: string;
}

export interface RatingDto {
  rating: number;
}

// Auth models
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: UserDto;
  expiresAt: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface ValidateTokenDto {
  token: string;
}

export interface ValidateTokenResponseDto {
  isValid: boolean;
  user?: UserDto;
  message: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Health check
export interface HealthResponse {
  status: string;
  timestamp: string;
}

// Legacy interfaces (mantidas para compatibilidade)
export interface AstronomyPictureOfDay extends ApodResponse {}

export interface CelestialEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'meteor_shower' | 'lunar_eclipse' | 'planetary_alignment' | 'solar_eclipse' | 'other';
  visibility: string;
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

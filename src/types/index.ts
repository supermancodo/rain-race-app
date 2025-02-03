export interface Weather {
  temperature: string;
  condition: string;
  rainfall: number;
}

export interface User {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  rainfall: number;
  weather: Weather;
  isOnline: boolean;
  sessionId: string;
}

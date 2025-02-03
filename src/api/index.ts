import axios from "axios";

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface WeatherData {
  temperature: string;
  condition: string;
  rainfall: number;
}

interface IpGeoResponse {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

interface WeatherResponse {
  current_weather: {
    temperature: number;
    weathercode: number;
    precipitation: number;
  };
}

export const ipToLocation = async (): Promise<LocationData> => {
  const response = await axios.get<IpGeoResponse>(
    `https://api.techniknews.net/ipgeo/`
  );

  if (
    !response.data.lat ||
    !response.data.lon ||
    !response.data.city ||
    !response.data.country
  ) {
    throw new Error("Invalid location data received");
  }

  return {
    latitude: response.data.lat,
    longitude: response.data.lon,
    city: response.data.city,
    country: response.data.country,
  };
};

export const getWeather = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  const response = await axios.get<WeatherResponse>(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&precipitation=true`
  );

  const { temperature, weathercode, precipitation } =
    response.data.current_weather;

  return {
    temperature: `${temperature}F`,
    condition:
      weathercode === 1 ? "Sunny" : weathercode === 2 ? "Cloudy" : "Rainy",
    rainfall: precipitation ?? 0,
  };
};

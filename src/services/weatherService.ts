/**
 * Service to fetch weather data from OpenWeatherMap API.
 */

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  // Use wttr.in as a fallback if no OpenWeatherMap key is provided
  if (!API_KEY) {
    console.log('No OpenWeatherMap key, using wttr.in fallback...');
    try {
      const response = await fetch(`https://wttr.in/${lat},${lon}?format=j1`);
      if (!response.ok) throw new Error('wttr.in fetch failed');
      const data = await response.json();
      const current = data.current_condition[0];
      return {
        temperature: parseFloat(current.temp_C),
        humidity: parseFloat(current.humidity),
        rainfall: parseFloat(current.precipMM) || 0,
      };
    } catch (err) {
      throw new Error('Weather services unavailable. Please add an API key.');
    }
  }

  try {
    const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    
    // Rainfall data is optional in the API response
    const rainfall = data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0;

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: rainfall,
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
};

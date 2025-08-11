export interface LocationData {
  ip: string;
  city: string;
  region: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
  org: string;
}

export interface SunPosition {
  azimuth: number; // Sun's direction (0-360 degrees, 0 = North, 90 = East, 180 = South, 270 = West)
  elevation: number; // Sun's height above horizon (0-90 degrees)
}

export const fetchVisitorLocation = async (): Promise<LocationData | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      ip: data.ip || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      timezone: data.timezone || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      org: data.org || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};

export const formatLocation = (location: LocationData): string => {
  const parts = [location.city, location.region, location.country].filter(Boolean);
  return parts.join(', ');
};

export const calculateSunPosition = (latitude: number, longitude: number, date: Date = new Date()): SunPosition => {
  // Convert date to Julian Day
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours() + date.getMinutes() / 60;
  
  // Simplified sun position calculation
  // This is a basic approximation - for more accuracy you'd use astronomical libraries
  
  // Calculate day of year
  const start = new Date(year, 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Solar declination (simplified)
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 80) * (Math.PI / 180));
  
  // Hour angle (simplified)
  const hourAngle = (hour - 12) * 15; // 15 degrees per hour
  
  // Calculate elevation and azimuth
  const latRad = latitude * (Math.PI / 180);
  const declRad = declination * (Math.PI / 180);
  const hourRad = hourAngle * (Math.PI / 180);
  
  // Elevation (simplified)
  const elevation = Math.asin(
    Math.sin(latRad) * Math.sin(declRad) + 
    Math.cos(latRad) * Math.cos(declRad) * Math.cos(hourRad)
  ) * (180 / Math.PI);
  
  // Azimuth (simplified)
  const azimuth = Math.atan2(
    Math.sin(hourRad),
    Math.cos(hourRad) * Math.sin(latRad) - Math.tan(declRad) * Math.cos(latRad)
  ) * (180 / Math.PI) + 180;
  
  // Normalize azimuth to 0-360
  const normalizedAzimuth = ((azimuth % 360) + 360) % 360;
  
  return {
    azimuth: normalizedAzimuth,
    elevation: Math.max(0, elevation)
  };
};

export const getShadowDirection = (sunPosition: SunPosition): { x: number, y: number } => {
  // Convert sun azimuth to shadow direction (opposite of sun direction)
  // Azimuth: 0 = North, 90 = East, 180 = South, 270 = West
  // Shadow: opposite direction
  
  const shadowAzimuth = (sunPosition.azimuth + 180) % 360;
  
  // Convert to radians
  const azimuthRad = shadowAzimuth * (Math.PI / 180);
  
  // Calculate shadow direction (normalized)
  const x = Math.sin(azimuthRad);
  const y = -Math.cos(azimuthRad); // Negative because CSS Y-axis is inverted
  
  return { x, y };
};

export const getCurrentTimeInTimezone = (timezone: string): string => {
  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(now);
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Time unavailable';
  }
}; 
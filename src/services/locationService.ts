export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  mapsUrl: string;
}

export const locationService = {
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve) => {
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({
              latitude,
              longitude,
              address: 'Current Location',
              mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
            });
          },
          () => {
            // Default sample location if permission denied
            resolve({
              latitude: 48.8566,
              longitude: 2.3522,
              address: 'Paris, France',
              mapsUrl: 'https://www.google.com/maps?q=48.8566,2.3522',
            });
          },
          { timeout: 8000 }
        );
      } else {
        resolve({
          latitude: 48.8566,
          longitude: 2.3522,
          address: 'Paris, France',
          mapsUrl: 'https://www.google.com/maps?q=48.8566,2.3522',
        });
      }
    });
  },
};

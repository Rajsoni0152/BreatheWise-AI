import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchAirQualityData, fetchPopularCities } from '../api/client';

const AirQualityContext = createContext(null);

export function AirQualityProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [coords, setCoords] = useState({ lat: 28.6139, lon: 77.2090, country: 'India' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularCities, setPopularCities] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load popular cities on mount
  useEffect(() => {
    fetchPopularCities().then(cities => {
      setPopularCities(cities);
    });
  }, []);

  const loadCityData = useCallback(async (cityName, lat, lon, country) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAirQualityData(cityName, lat, lon, country);
      setData(result);
      setSelectedCity(cityName);
      if (lat && lon) {
        setCoords({ lat, lon, country: country || '' });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch air quality');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCityData(selectedCity, coords.lat, coords.lon, coords.country);
  }, [loadCityData, selectedCity, coords.lat, coords.lon, coords.country]);

  const selectCity = (cityObj) => {
    setSelectedCity(cityObj.name);
    setCoords({
      lat: cityObj.latitude,
      lon: cityObj.longitude,
      country: cityObj.country || ''
    });
    setIsSearchOpen(false);
  };

  const refreshData = () => {
    loadCityData(selectedCity, coords.lat, coords.lon, coords.country);
  };

  return (
    <AirQualityContext.Provider
      value={{
        selectedCity,
        coords,
        data,
        loading,
        error,
        popularCities,
        selectCity,
        refreshData,
        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </AirQualityContext.Provider>
  );
}

export function useAirQuality() {
  const context = useContext(AirQualityContext);
  if (!context) {
    throw new Error('useAirQuality must be used within an AirQualityProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import PageLoader from '../components/PageLoader';

interface LoadingContextType {
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeRequests, setActiveRequests] = useState(0);
  const [manualLoading, setManualLoading] = useState(false);

  const setLoading = (loading: boolean) => setManualLoading(loading);
  const isLoading = activeRequests > 0 || manualLoading;

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      setActiveRequests((prev) => prev + 1);
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        setActiveRequests((prev) => Math.max(0, prev - 1));
        return response;
      },
      (error) => {
        setActiveRequests((prev) => Math.max(0, prev - 1));
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ setLoading, isLoading }}>
      {isLoading && <PageLoader />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

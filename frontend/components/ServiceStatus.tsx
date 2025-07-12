'use client';

import { useEffect, useState } from 'react';
import { API_CONFIG } from '@/lib/api';

interface ServiceStatus {
  service: string;
  url: string;
  status: 'online' | 'offline' | 'checking';
}

export default function ServiceStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { service: 'Auth Service', url: API_CONFIG.AUTH_API_URL, status: 'checking' },
    { service: 'Patient Service', url: API_CONFIG.PATIENT_API_URL, status: 'checking' },
    { service: 'Hospital Service', url: API_CONFIG.HOSPITAL_API_URL, status: 'checking' },
    { service: 'Manufacturer Service', url: API_CONFIG.MANUFACTURER_API_URL, status: 'checking' },
    { service: 'Government Service', url: API_CONFIG.GOV_API_URL, status: 'checking' },
    { service: 'Coordinator Service', url: API_CONFIG.COORDINATOR_API_URL, status: 'checking' },
    { service: 'Media Service', url: API_CONFIG.MEDIA_API_URL, status: 'checking' },
    { service: 'AI Service', url: API_CONFIG.AI_API_URL, status: 'checking' },
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const checkServices = async () => {
      const updatedServices = await Promise.all(
        services.map(async (service) => {
          try {
            const response = await fetch(`${service.url}/health/`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
            return {
              ...service,
              status: (response.ok ? 'online' : 'offline') as ServiceStatus['status'],
            };
          } catch {
            return {
              ...service,
              status: 'offline' as ServiceStatus['status'],
            };
          }
        })
      );
      setServices(updatedServices);
    };

    checkServices();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Service Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.service}
            className="p-4 border rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">{service.service}</h3>
              <p className="text-sm text-gray-600">{service.url}</p>
            </div>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  service.status === 'online'
                    ? 'bg-green-500'
                    : service.status === 'offline'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              />
              <span className="text-sm font-medium capitalize">
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
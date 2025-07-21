'use client';

import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SERVICES = [
  { service: 'Auth Service', url: `${BASE_URL}/auth` },
  { service: 'Patient Service', url: `${BASE_URL}/patient` },
  { service: 'Hospital Service', url: `${BASE_URL}/hospital` },
  { service: 'Manufacturer Service', url: `${BASE_URL}/manufacturer` },
  { service: 'Gov Service', url: `${BASE_URL}/gov` },
  { service: 'Media Service', url: `${BASE_URL}/media` },
  { service: 'Coordinator Service', url: `${BASE_URL}/coordinator` },
  { service: 'AI Service', url: `${BASE_URL}/ai` },
];

type ServiceStatus = {
  service: string;
  url: string;
  status: 'checking' | 'online' | 'offline';
};

export default function ServiceStatus() {
  const [services, setServices] = useState<ServiceStatus[]>(
    SERVICES.map(s => ({ ...s, status: 'checking' }))
  );

  useEffect(() => {
    const checkServices = async () => {
      const results = await Promise.all(
        services.map(async (svc) => {
          try {
            const res = await fetch(svc.url + '/health', { method: 'GET' });
            if (res.ok) return { ...svc, status: 'online' };
            return { ...svc, status: 'offline' };
          } catch {
            return { ...svc, status: 'offline' };
          }
        })
      );
      setServices(results as ServiceStatus[]);
    };
    checkServices();
    // Optionally poll every 30s
    const interval = setInterval(checkServices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Service Status</h2>
      <ul>
        {services.map((svc) => (
          <li key={svc.service}>
            <strong>{svc.service}:</strong> {svc.status === 'checking' ? 'Checking...' : svc.status === 'online' ? '🟢 Online' : '🔴 Offline'}
            <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>{svc.url}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 
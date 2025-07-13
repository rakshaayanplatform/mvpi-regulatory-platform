// API configuration using environment variables
const API_CONFIG = {
  AUTH_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
  PATIENT_API_URL: process.env.NEXT_PUBLIC_PATIENT_API_URL || 'http://localhost:8002',
  HOSPITAL_API_URL: process.env.NEXT_PUBLIC_HOSPITAL_API_URL || 'http://localhost:8003',
  MANUFACTURER_API_URL: process.env.NEXT_PUBLIC_MANUFACTURER_API_URL || 'http://localhost:8004',
  GOV_API_URL: process.env.NEXT_PUBLIC_GOV_API_URL || 'http://localhost:8005',
  COORDINATOR_API_URL: process.env.NEXT_PUBLIC_COORDINATOR_API_URL || 'http://localhost:8006',
  MEDIA_API_URL: process.env.NEXT_PUBLIC_MEDIA_API_URL || 'http://localhost:8007',
  AI_API_URL: process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8010',
};

// API client class
export class ApiClient {
  private baseURL: string;

  constructor(service: keyof typeof API_CONFIG) {
    this.baseURL = API_CONFIG[service];
  }

  async get(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post(endpoint: string, data?: Record<string, unknown>, options?: RequestInit) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async put(endpoint: string, data?: Record<string, unknown>, options?: RequestInit) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Service-specific API clients
export const authApi = new ApiClient('AUTH_API_URL');
export const patientApi = new ApiClient('PATIENT_API_URL');
export const hospitalApi = new ApiClient('HOSPITAL_API_URL');
export const manufacturerApi = new ApiClient('MANUFACTURER_API_URL');
export const govApi = new ApiClient('GOV_API_URL');
export const coordinatorApi = new ApiClient('COORDINATOR_API_URL');
export const mediaApi = new ApiClient('MEDIA_API_URL');
export const aiApi = new ApiClient('AI_API_URL');

// Export API config for debugging
export { API_CONFIG }; 
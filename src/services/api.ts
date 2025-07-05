import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API base URL - adjust this to match your server URL
const API_BASE_URL = 'http://localhost:5000/api/v1'; // Update this to your actual server URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// KYC API types
export interface KYCData {
  userId: string;
  reraIdState?: string;
  reraId?: string;
  aadharFrontKey?: string;
  aadharBackKey?: string;
  selfieImageKey?: string;
  aadharcardNumber?: number;
  aadharcardAddress?: string;
  isReraChoice?: boolean;
}

export interface KYCStatus {
  kycStatus: string;
  attemptCount: number;
  isAttemptsExhausted: boolean;
  reraChoiceMade: boolean;
  documentsSubmitted: {
    reraId: boolean;
    reraVerified: boolean;
    aadharCard: boolean;
    aadharAddress: boolean;
    selfie: boolean;
    aadharFront: boolean;
    aadharBack: boolean;
  };
}

export interface KYCResponse {
  message: string;
  created?: boolean;
  kyc: any;
  status?: KYCStatus;
}

// KYC API functions
export const kycAPI = {
  // Create or update KYC
  createUpdateKyc: async (data: KYCData): Promise<KYCResponse> => {
    const response = await api.post('/kyc/kyc-process', data);
    return response.data;
  },

  // Get KYC status
  getKycStatus: async (userId: string): Promise<KYCResponse> => {
    const response = await api.post('/kyc/kyc-status', { userId });
    return response.data;
  },

  // Reset KYC attempts (admin function)
  resetKycAttempts: async (userId: string): Promise<KYCResponse> => {
    const response = await api.post('/kyc/reset-attempts', { userId });
    return response.data;
  },
};

// Admin dashboard API types
export interface AdminKYCUser {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  reraId?: string;
  reraIdState?: string;
  aadharcardNumber?: number;
  aadharcardAddress?: string;
  aadharFrontKey?: string;
  aadharBackKey?: string;
  selfieImageKey?: string;
  kycStatus: 'Pending' | 'Success' | 'Rejected';
  attemptCount: number;
  isAttemptsExhausted: boolean;
  rera: boolean;
  createdAt: string;
  updatedAt: string;
}

// Admin dashboard API functions
export const adminAPI = {
  // Get all KYC submissions for admin review
  getAllKYCSubmissions: async (): Promise<{ data: AdminKYCUser[] }> => {
    const response = await api.get('/kyc/admin/submissions');
    return response.data;
  },

  // Update KYC status (approve/reject)
  updateKYCStatus: async (userId: string, status: 'Success' | 'Rejected', reason?: string): Promise<any> => {
    const response = await api.post('/kyc/admin/update-status', { userId, status, reason });
    return response.data;
  },

  // Get pending KYC submissions
  getPendingKYCSubmissions: async (): Promise<{ data: AdminKYCUser[] }> => {
    const response = await api.get('/kyc/admin/pending');
    return response.data;
  },
};

// Suspend User API types
export interface SuspendedUser {
  id: string;
  userId: string | null;
  fullName: string | null;
  mobileNumber: string;
  email: string | null;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export const suspendAPI = {
  // Get all suspended users
  getSuspendedUsers: async (): Promise<{ data: SuspendedUser[] }> => {
    const response = await api.get('/suspend/list');
    return response.data;
  },
  // Suspend a user
  suspendUser: async (mobileNumber: string, reason: string): Promise<any> => {
    const response = await api.post('/suspend', { mobileNumber, reason });
    return response.data;
  },
  // Unsuspend a user
  unsuspendUser: async (mobileNumber: string): Promise<any> => {
    const response = await api.post('/suspend/unsuspend', { mobileNumber });
    return response.data;
  },
};

export default api; 
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://logipeace.onrender.com/api/v1',
  timeout: 10000,
} as const

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    baseUrl: API_CONFIG.baseUrl,
    environment: process.env.NODE_ENV,
  })
}

export default API_CONFIG

import axios from 'axios'
import { auth } from '../lib/firebase'

// Auto-detect API URL based on environment
const getAPIBaseURL = () => {
  // Local Development
  if (import.meta.env.DEV) {
    return 'http://localhost:8000'
  }
  // Production: Vercel Env Var OR Live Render URL
  return import.meta.env.VITE_API_BASE_URL || 'https://stock-market-analyser-backend.onrender.com' // <-- Update with your exact Render URL
}

const API_BASE_URL = getAPIBaseURL()

console.log('🔗 API Base URL:', API_BASE_URL)

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach Auth Token
client.interceptors.request.use(async (config) => {
  console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`)

  const user = auth.currentUser
  if (user) {
    try {
      const token = await user.getIdToken()
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    } catch (error) {
      console.error('Failed to attach auth token:', error)
    }
  }

  return config
})

// Response Interceptor: Logging & Error Handling
client.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.message, error.response?.status)
    return Promise.reject(error)
  }
)

/**
 * Analyze market for a given symbol
 */
export const analyzeMarket = async (symbol, timeframe = '15m', lookback = '5d') => {
  try {
    const response = await client.post('/api/analyze', {
      symbol,
      timeframe,
      lookback,
    })
    return response.data
  } catch (error) {
    console.error('Error analyzing market:', error)
    throw error
  }
}

/**
 * Get candlestick data for a symbol
 */
export const getCandles = async (symbol, timeframe = '15m', lookback = '5d') => {
  try {
    const response = await client.get('/api/candles', {
      params: {
        symbol,
        timeframe,
        lookback,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching candles:', error)
    throw error
  }
}

/**
 * Send message to chatbot
 */
export const sendChatMessage = async (message, currentResult = null) => {
  try {
    const response = await client.post('/api/chat', {
      message,
      current_result: currentResult,
    })
    return response.data
  } catch (error) {
    console.error('Error sending chat message:', error)
    throw error
  }
}

/**
 * Check API health
 */
export const checkHealth = async () => {
  try {
    const response = await client.get('/api/health')
    return response.data
  } catch (error) {
    console.error('Error checking health:', error)
    throw error
  }
}

export default client
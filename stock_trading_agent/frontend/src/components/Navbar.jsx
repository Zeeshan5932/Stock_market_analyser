import React, { useState, useEffect } from 'react'
import { Clock, Activity, Zap, BarChart3, TrendingUp, TrendingDown, LogOut, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Navbar({ selectedPair, analysisResult, loading, loadingStage }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [priceChange, setPriceChange] = useState(0)
  const [logoutError, setLogoutError] = useState('')
  const [logoutLoading, setLogoutLoading] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (analysisResult?.latest_price) {
      setPriceChange((Math.random() - 0.5) * 2)
    }
  }, [analysisResult])

  const isPeakHours = currentTime.getUTCHours() >= 12 && currentTime.getUTCHours() <= 21
  const utcTime = currentTime.toUTCString().split(' ')[4]

  const signal = analysisResult?.signal || 'HOLD'
  const signalColor = {
    'BUY': 'bullish',
    'SELL': 'bearish',
    'HOLD': 'yellow-400',
  }[signal] || 'gray-400'

  const isSkeletonLoading = loadingStage === 'skeleton' && loading && !analysisResult
  const displayName = user?.displayName || user?.email || 'Trader'

  const handleLogout = async () => {
    setLogoutError('')
    setLogoutLoading(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
      setLogoutError('Unable to sign out. Try again.')
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <nav className="navbar nav-terminal border-b border-accent/20 backdrop-blur-md bg-dark-navy/80">
      <div className="navbar-left">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bullish to-gold flex items-center justify-center flex-shrink-0">
            <BarChart3 size={18} className="text-dark-bg" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">AI FX Terminal</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] truncate">Market analysis dashboard</p>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <div className={`nav-pill ${isSkeletonLoading ? 'opacity-80' : ''}`}>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Trading Pair</p>
            <p className="text-sm sm:text-base font-semibold text-white truncate">{selectedPair}</p>
          </div>
        </div>

        {isSkeletonLoading ? (
          <div className="nav-pill w-[170px] max-w-full">
            <div className="w-full">
              <div className="skeleton h-3 w-20 mb-2"></div>
              <div className="skeleton h-5 w-28"></div>
            </div>
          </div>
        ) : analysisResult ? (
          <div className="nav-pill">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Live Price</p>
              <div className="flex items-center gap-2">
                <p className={`text-sm sm:text-base font-semibold ${analysisResult.latest_price > 1.1 ? 'text-bullish' : 'text-bearish'}`}>
                  {analysisResult.latest_price?.toFixed(5)}
                </p>
                <div className={`flex items-center gap-0.5 ${priceChange > 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {priceChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span className="text-[11px] font-semibold">{Math.abs(priceChange).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {isSkeletonLoading ? (
          <div className="nav-pill w-[160px] max-w-full">
            <div className="w-full">
              <div className="skeleton h-3 w-16 mb-2"></div>
              <div className="skeleton h-5 w-24"></div>
            </div>
          </div>
        ) : analysisResult?.session ? (
          <div className="nav-pill">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Session</p>
              <p className="text-sm sm:text-base font-semibold text-gold truncate">{analysisResult.session.active_session}</p>
            </div>
          </div>
        ) : null}

        {isSkeletonLoading ? (
          <div className="nav-pill w-[140px] max-w-full">
            <div className="w-full">
              <div className="skeleton h-3 w-14 mb-2"></div>
              <div className="skeleton h-5 w-20"></div>
            </div>
          </div>
        ) : analysisResult ? (
          <div className={`nav-pill ${signal === 'BUY' ? 'border-bullish/40' : signal === 'SELL' ? 'border-bearish/40' : 'border-yellow-400/30'}`}>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Signal</p>
              <p className={`text-sm sm:text-base font-semibold ${signal === 'BUY' ? 'text-bullish' : signal === 'SELL' ? 'text-bearish' : 'text-yellow-400'} truncate`}>
                {signal}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="navbar-right">
        <div className="nav-pill">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-bearish live-pulse"></div>
            <span className="text-[10px] font-bold text-bearish uppercase tracking-widest">LIVE</span>
          </div>
        </div>

        <div className="nav-pill">
          <Clock size={14} className="text-accent flex-shrink-0" />
          <span className="text-xs font-mono font-medium text-gray-300">UTC {utcTime}</span>
        </div>

        {user && (
          <div className="nav-pill">
            <UserCircle size={14} className="text-accent flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-200 truncate max-w-[180px]">{user.email || displayName}</span>
          </div>
        )}

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="nav-pill hover:border-bearish/60 transition-smooth"
          >
            <LogOut size={14} className="text-bearish flex-shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-bearish">
              {logoutLoading ? 'Signing out' : 'Logout'}
            </span>
          </button>
        )}
      </div>

      {logoutError && (
        <div className="w-full text-xs text-bearish font-semibold px-1 sm:px-2">
          {logoutError}
        </div>
      )}
    </nav>
  )
}

export default Navbar

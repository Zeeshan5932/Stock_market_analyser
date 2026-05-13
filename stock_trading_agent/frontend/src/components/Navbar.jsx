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
    <nav className="nav-terminal border-b border-accent/20 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 backdrop-blur-md bg-dark-navy/80">
      {/* Left: Logo & LIVE Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bullish to-gold flex items-center justify-center">
          <BarChart3 size={18} className="text-dark-bg" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xs font-bold text-white tracking-tight">AI FX Terminal</h1>
        </div>
        <div className="flex items-center gap-1.5 ml-1 px-2 py-1 bg-bullish/15 border border-bullish/40 rounded-full">
          <div className="w-1.5 h-1.5 bg-bullish rounded-full live-pulse"></div>
          <span className="text-[10px] font-semibold text-bullish\">LIVE</span>
        </div>
      </div>

      {/* Center: Current Asset & Price Info */}
      <div className="nav-row nav-scroll scrollbar-hide lg:justify-center lg:overflow-visible">
          {/* Selected Pair */}
          <div className="glass nav-card border border-gray-600/50 px-4 py-2 rounded-lg min-w-[140px] sm:min-w-[150px]">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Trading Pair</p>
            <p className="text-base sm:text-lg font-semibold text-white">{selectedPair}</p>
          </div>

          {/* Live Price */}
          {isSkeletonLoading && (
            <div className="glass nav-card border border-gray-600/50 px-4 py-2 rounded-lg min-w-[160px] sm:min-w-[170px]">
              <div className="skeleton h-3 w-20 mb-2"></div>
              <div className="skeleton h-6 w-28"></div>
            </div>
          )}

          {analysisResult && (
            <div className="glass nav-card border border-gray-600/50 px-4 py-2 rounded-lg min-w-[160px] sm:min-w-[170px]">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Live Price</p>
              <div className="flex items-center gap-2">
                <p className={`text-base sm:text-lg font-semibold ${analysisResult.latest_price > 1.1 ? 'text-bullish' : 'text-bearish'}`}>
                  {analysisResult.latest_price?.toFixed(5)}
                </p>
                <div className={`flex items-center gap-0.5 ${priceChange > 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {priceChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="text-[11px] font-semibold">{Math.abs(priceChange).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Session */}
          {isSkeletonLoading && (
            <div className="glass nav-card border border-gold/30 px-4 py-2 rounded-lg glow-gold min-w-[150px] sm:min-w-[160px]">
              <div className="skeleton h-3 w-16 mb-2"></div>
              <div className="skeleton h-6 w-32"></div>
            </div>
          )}

          {analysisResult?.session && (
            <div className="glass nav-card border border-gold/30 px-4 py-2 rounded-lg glow-gold min-w-[150px] sm:min-w-[160px]">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Session</p>
              <p className="text-sm sm:text-base font-semibold text-gold">{analysisResult.session.active_session}</p>
            </div>
          )}

          {/* Market Bias */}
          {isSkeletonLoading && (
            <div className="glass nav-card border px-4 py-2 rounded-lg min-w-[130px] sm:min-w-[140px] border-yellow-400/30">
              <div className="skeleton h-3 w-14 mb-2"></div>
              <div className="skeleton h-6 w-20"></div>
            </div>
          )}

          {analysisResult && (
            <div className={`glass nav-card border px-4 py-2 rounded-lg min-w-[130px] sm:min-w-[140px] ${signal === 'BUY' ? 'border-bullish/30 glow-bullish' : signal === 'SELL' ? 'border-bearish/30 glow-bearish' : 'border-yellow-400/30'}`}>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Signal</p>
              <p className={`text-sm sm:text-base font-semibold signal-${signal.toLowerCase()}`}>{signal}</p>
            </div>
          )}
      </div>

      {/* Right: Status Indicators */}
      <div className="nav-row nav-scroll scrollbar-hide lg:justify-end lg:overflow-visible">
        {/* LIVE Badge */}
        <div className="nav-chip flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-bearish live-pulse"></div>
          <span className="text-[10px] font-bold text-bearish uppercase tracking-widest">Live</span>
        </div>

        {/* UTC Time */}
        <div className="nav-chip glass border border-gray-600/50 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Clock size={14} className="text-accent" />
          <span className="text-xs font-mono font-medium text-gray-300">{utcTime}</span>
        </div>

        {/* Peak Hours Indicator */}
        {isPeakHours && (
          <div className="nav-chip glass border border-bullish/30 px-3 py-1.5 rounded-lg flex items-center gap-2 glow-bullish">
            <Zap size={14} className="text-bullish" />
            <span className="text-[10px] font-bold text-bullish uppercase">Peak Hours</span>
          </div>
        )}

        {/* Data Provider */}
        <div className="nav-chip glass border border-gray-600/50 px-3 py-1.5 rounded-lg">
          <p className="text-[10px] font-mono text-gray-400">
            <Activity size={12} className="inline mr-1" />
            Real-time
          </p>
        </div>

        {user && (
          <div className="nav-chip glass border border-gray-600/50 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <UserCircle size={14} className="text-accent" />
            <span className="text-xs font-semibold text-gray-200">{displayName}</span>
          </div>
        )}

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="nav-chip glass border border-gray-600/50 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-bearish/60 transition-smooth"
          >
            <LogOut size={14} className="text-bearish" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-bearish">
              {logoutLoading ? 'Signing out' : 'Logout'}
            </span>
          </button>
        )}
      </div>

      {logoutError && (
        <div className="text-xs text-bearish font-semibold px-2">
          {logoutError}
        </div>
      )}
    </nav>
  )
}

export default Navbar

import React, { useState } from 'react'
import {
  Menu,
  X,
  BarChart3,
  Play,
  HelpCircle,
} from 'lucide-react'

function Sidebar({
  selectedMarket,
  onMarketChange,
  selectedPair,
  onPairChange,
  selectedTimeframe,
  onTimeframeChange,
  selectedLookback,
  onLookbackChange,
  autoRefresh,
  onAutoRefreshChange,
  refreshInterval,
  onRefreshIntervalChange,
  onAnalyze,
  loading,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [showHelper, setShowHelper] = useState(false)

  const markets = ['Forex', 'Commodities', 'Crypto']
  const pairsByMarket = {
    Forex: ['GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
    Commodities: ['XAU/USD', 'XAG/USD', 'CL=F', 'NG=F'],
    Crypto: ['BTC/USD', 'ETH/USD', 'XRP/USD', 'ADA/USD'],
  }

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d']
  const lookbacks = ['1d', '5d', '1mo', '3mo', '6mo']
  const pairs = pairsByMarket[selectedMarket] || []

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass p-2 rounded-lg hover-glow transition-smooth"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`glass-lg sidebar-shell w-72 sm:w-80 max-w-[85vw] overflow-y-auto transition-all duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:static h-full z-40 lg:z-auto backdrop-blur-md`}
      >
        <div className="p-3 sm:p-4 border-b border-gray-700/30 sticky top-0 sidebar-header backdrop-blur-md">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bullish to-gold flex items-center justify-center flex-shrink-0">
                <BarChart3 size={18} className="text-dark-bg" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-white text-sm">Trading</h2>
                <p className="text-[10px] text-gray-400">Controls</p>
              </div>
            </div>
            <button
              onClick={() => setShowHelper(!showHelper)}
              className="text-gray-400 hover:text-bullish transition-smooth flex-shrink-0"
              title="Help"
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </div>

        {showHelper && (
          <div className="px-3 sm:px-4 py-3 sidebar-helper text-xs text-yellow-200 space-y-1.5 border-b border-gray-700/20">
            <p className="font-semibold">Tips:</p>
            <ul className="space-y-0.5 list-disc list-inside text-[11px]">
              <li>1m/5m for entries</li>
              <li>1h/4h for trends</li>
              <li>1d lookback scans</li>
            </ul>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-4">
          <div className="sidebar-section">
            <div className="sidebar-section-title mb-4">
              <span>Market Type</span>
              <span className="sidebar-indicator" />
            </div>
            <div className="space-y-2">
              {markets.map((market) => (
                <button
                  key={market}
                  onClick={() => onMarketChange(market)}
                  className={`sidebar-choice ${selectedMarket === market ? 'is-active' : ''}`}
                >
                  {market}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title mb-4">Trading Pair</div>
            <select
              value={selectedPair}
              onChange={(e) => onPairChange(e.target.value)}
              className="select sidebar-select w-full font-semibold"
            >
              {pairs.map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </select>
            <p className="sidebar-section-subtitle mt-2">Select your trading pair</p>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title mb-4">Timeframe</div>
            <div className="grid grid-cols-3 gap-2">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => onTimeframeChange(tf)}
                  className={`sidebar-chip sidebar-chip--bullish ${selectedTimeframe === tf ? 'is-active' : ''}`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <p className="sidebar-section-subtitle mt-3">Entry timeframes: 1m, 5m</p>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title mb-4">Lookback Period</div>
            <div className="grid grid-cols-2 gap-2">
              {lookbacks.map((lb) => (
                <button
                  key={lb}
                  onClick={() => onLookbackChange(lb)}
                  className={`sidebar-chip sidebar-chip--gold ${selectedLookback === lb ? 'is-active' : ''}`}
                >
                  {lb}
                </button>
              ))}
            </div>
            <p className="sidebar-section-subtitle mt-3">Recommended: 1d</p>
          </div>

          <div className="sidebar-section">
            <div className="flex items-center justify-between mb-4">
              <label className="sidebar-section-title">Auto Refresh</label>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => onAutoRefreshChange(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer accent-bullish"
              />
            </div>
            {autoRefresh && (
              <div className="space-y-2">
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={refreshInterval}
                  onChange={(e) => onRefreshIntervalChange(parseInt(e.target.value))}
                  className="input sidebar-input w-full"
                  placeholder="Interval (seconds)"
                />
                <p className="sidebar-section-subtitle">Updates every {refreshInterval}s</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-gray-700/50 sticky bottom-0 sidebar-footer backdrop-blur-md">
          <button
            onClick={onAnalyze}
            disabled={loading}
            className={`sidebar-cta w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-smooth uppercase tracking-widest text-sm ${
              loading
                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-bullish to-gold text-dark-bg hover:shadow-glow-bullish hover:shadow-lg'
            }`}
          >
            <Play size={18} />
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>

          <div className="sidebar-note mt-4 text-center text-xs text-gray-300 space-y-1">
            <p className="font-semibold text-gray-300">📊 Paper Trading</p>
            <p>Educational Use Only</p>
            <p className="text-gray-500">Not Financial Advice</p>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 lg:hidden z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar

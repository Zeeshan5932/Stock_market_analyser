import React from 'react'
import { Zap, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { getSignalColor, formatConfidence } from '../utils/formatters'

function SignalPanel({ result }) {
  const signal = result?.signal || 'HOLD'
  const confidence = formatConfidence(result?.confidence || 0)
  const signalBgGlass = {
    BUY: 'bg-bullish/5 border-bullish/30',
    SELL: 'bg-bearish/5 border-bearish/30',
    HOLD: 'bg-yellow-500/5 border-yellow-500/30',
  }[signal] || 'bg-gray-500/5 border-gray-500/30'

  const signalGlowClass = {
    BUY: 'glow-bullish',
    SELL: 'glow-bearish',
    HOLD: 'glow-gold',
  }[signal] || ''

  return (
    <div className={`glass-lg border border-gray-700/30 rounded-lg p-4 sm:p-5 fade-in ${signalBgGlass}`}>
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-bullish to-gold rounded-lg flex-shrink-0">
          <Zap size={16} className="text-dark-bg" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white">Trading Signal</h3>
          <p className="text-[10px] text-gray-400">AI Analysis</p>
        </div>
      </div>

      <div
        className={`w-full px-4 py-3 rounded-lg border-2 text-center mb-4 ${
          signal === 'BUY'
            ? 'border-bullish/60 bg-bullish/12 ' + signalGlowClass
            : signal === 'SELL'
            ? 'border-bearish/60 bg-bearish/12 ' + signalGlowClass
            : signal === 'HOLD'
            ? 'border-yellow-500/60 bg-yellow-500/12 ' + signalGlowClass
            : 'border-orange-500/60 bg-orange-500/12'
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          {signal === 'BUY' && <TrendingUp size={16} className="text-bullish" />}
          {signal === 'SELL' && <TrendingDown size={16} className="text-bearish" />}
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              signal === 'BUY'
                ? 'text-bullish'
                : signal === 'SELL'
                ? 'text-bearish'
                : signal === 'HOLD'
                ? 'text-yellow-400'
                : 'text-orange-400'
            }`}
          >
            {signal === 'WAIT_FOR_NEWS' ? 'WAIT NEWS' : signal}
          </span>
        </div>
        <p className={`text-3xl font-black tracking-tighter ${getSignalColor(signal)}`}>
          {signal === 'WAIT_FOR_NEWS' ? '⏳' : signal}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Confidence</span>
          <span className={`text-sm font-bold ${getSignalColor(signal)}`}>{confidence}</span>
        </div>
        <div className="w-full h-2 bg-dark-card-light/40 rounded-full overflow-hidden border border-gray-700/30">
          <div
            className={`h-full transition-all duration-500 ${
              signal === 'BUY'
                ? 'bg-gradient-to-r from-bullish/80 to-bullish'
                : signal === 'SELL'
                ? 'bg-gradient-to-r from-bearish/80 to-bearish'
                : signal === 'HOLD'
                ? 'bg-gradient-to-r from-yellow-500/80 to-yellow-400'
                : 'bg-gradient-to-r from-orange-500/80 to-orange-400'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, parseFloat(confidence) || 0))}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="w-full p-3 bg-dark-card-light/20 border border-gray-700/20 rounded-lg">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Reason</p>
          <p className="text-xs text-gray-300 leading-relaxed font-medium line-clamp-3">
            {result?.reason || 'Analyzing conditions...'}
          </p>
        </div>

        <div className="p-3 bg-yellow-900/20 border border-yellow-700/40 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-yellow-300 uppercase tracking-wide">Notice</p>
          </div>
          <p className="text-[11px] text-yellow-100 leading-relaxed">
            Educational analysis only. Use risk management. Never risk more than you can afford to lose.
          </p>
        </div>

        <div className="p-3 glass border border-gray-700/50 rounded-lg">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Market Bias</p>
          <p className={`text-base sm:text-lg font-semibold ${result?.market_bias === 'BULLISH' ? 'text-bullish' : 'text-bearish'}`}>
            {result?.market_bias || '-'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignalPanel

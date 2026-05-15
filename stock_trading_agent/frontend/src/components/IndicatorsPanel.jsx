import React from 'react'

const normalizeValue = (value, precision = 2) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(precision)
  }
  return String(value)
}

const indicatorBadge = (key, value) => {
  const text = value === null || value === undefined ? 'N/A' : 'OK'
  const base = 'inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide'
  if (key === 'RSI' && typeof value === 'number') {
    if (value >= 60) return `${base} bg-bullish/10 text-bullish`
    if (value <= 40) return `${base} bg-bearish/10 text-bearish`
    return `${base} bg-slate-800 text-slate-300`
  }
  if ((key === 'MACD' || key === 'MACD Signal') && typeof value === 'number') {
    if (value > 0) return `${base} bg-bullish/10 text-bullish`
    if (value < 0) return `${base} bg-bearish/10 text-bearish`
    return `${base} bg-slate-800 text-slate-300`
  }
  return `${base} bg-slate-800 text-slate-300`
}

function IndicatorsPanel({ result }) {
  const indicators = result?.indicators || {}
  const hasIndicators = [
    indicators.rsi,
    indicators.macd,
    indicators.macd_signal,
    indicators.ema_20,
    indicators.ema_50,
    indicators.sma_200,
    indicators.atr,
  ].some((value) => value !== null && value !== undefined)

  if (!hasIndicators) {
    return (
      <div className="glass-lg border border-gray-700/30 rounded-lg p-4 sm:p-5 fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Indicators</p>
            <h3 className="text-lg font-semibold text-white mt-1">Technical Panel</h3>
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-gray-700/60 bg-dark-card-light/10 p-4 text-sm text-gray-400">
          Indicator data unavailable
        </div>
      </div>
    )
  }

  const rows = [
    { label: 'RSI', value: indicators.rsi },
    { label: 'MACD', value: indicators.macd },
    { label: 'MACD Signal', value: indicators.macd_signal },
    { label: 'EMA 20', value: indicators.ema_20 },
    { label: 'EMA 50', value: indicators.ema_50 },
    { label: 'SMA 200', value: indicators.sma_200 },
    { label: 'ATR', value: indicators.atr },
  ]

  return (
    <div className="glass-lg border border-gray-700/30 rounded-lg p-4 sm:p-5 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Indicators</p>
          <h3 className="text-lg font-semibold text-white mt-1">Technical Panel</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.map((item) => (
          <div key={item.label} className="bg-dark-card-light/10 border border-gray-700/50 rounded-xl p-3">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs uppercase tracking-widest text-gray-400">{item.label}</p>
              <span className={indicatorBadge(item.label, item.value)}>{item.value === null || item.value === undefined ? 'N/A' : 'Live'}</span>
            </div>
            <p className="text-xl font-semibold text-white">
              {normalizeValue(item.value, item.label === 'ATR' ? 4 : 2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IndicatorsPanel

import React from 'react'

const getPillClasses = (value) => {
  const base = 'inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide'
  const normalized = String(value || '').toLowerCase()
  if (normalized.includes('bull')) {
    return `${base} bg-bullish/10 text-bullish border border-bullish/20`
  }
  if (normalized.includes('bear')) {
    return `${base} bg-bearish/10 text-bearish border border-bearish/20`
  }
  if (normalized.includes('sideways') || normalized.includes('neutral') || normalized === 'none' || normalized === '') {
    return `${base} bg-slate-800 text-slate-300 border border-slate-700`
  }
  return `${base} bg-slate-800 text-slate-300 border border-slate-700`
}

const formatZone = (zone) => {
  if (!zone || !Array.isArray(zone) && typeof zone !== 'object') {
    return '-'
  }
  const [low, high] = Array.from(zone)
  if (low == null || high == null) {
    return '-'
  }
  return `${low.toFixed(5)} - ${high.toFixed(5)}`
}

function SMCPanel({ result }) {
  const smc = result?.smc || {}
  const hasSmc = [
    smc.market_structure,
    smc.bos,
    smc.choch,
    smc.liquidity_sweep,
    smc.support_zone,
    smc.resistance_zone,
  ].some((value) => value !== null && value !== undefined)

  if (!hasSmc) {
    return (
      <div className="glass-lg border border-gray-700/30 rounded-lg p-4 sm:p-5 fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">SMC</p>
            <h3 className="text-lg font-semibold text-white mt-1">Smart Money Concepts</h3>
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-gray-700/60 bg-dark-card-light/10 p-4 text-sm text-gray-400">
          SMC data unavailable
        </div>
      </div>
    )
  }

  const rows = [
    { label: 'Market Structure', value: smc.market_structure },
    { label: 'BOS', value: smc.bos },
    { label: 'CHOCH', value: smc.choch },
    { label: 'Liquidity Sweep', value: smc.liquidity_sweep },
    { label: 'Support Zone', value: formatZone(smc.support_zone) },
    { label: 'Resistance Zone', value: formatZone(smc.resistance_zone) },
  ]

  return (
    <div className="glass-lg border border-gray-700/30 rounded-lg p-4 sm:p-5 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">SMC</p>
          <h3 className="text-lg font-semibold text-white mt-1">Market Structure</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {rows.map((item) => (
          <div key={item.label} className="bg-dark-card-light/10 border border-gray-700/50 rounded-xl p-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">{item.label}</p>
              <p className="text-sm font-semibold text-white mt-1 truncate">{item.value || '-'}</p>
            </div>
            <span className={getPillClasses(item.value)}>{item.value ? String(item.value).toUpperCase() : 'NONE'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SMCPanel

import React from 'react'
import { BarChart2 } from 'lucide-react'
import { getTrendColor } from '../utils/formatters'

function TrendTable({ result }) {
  const trends = [
    { name: '5 Min', value: result.trends?.['5m'] || 'NEUTRAL' },
    { name: '15 Min', value: result.trends?.['15m'] || 'NEUTRAL' },
    { name: '1 Hour', value: result.trends?.['1h'] || 'NEUTRAL' },
    { name: '4 Hour', value: result.trends?.['4h'] || 'NEUTRAL' },
    { name: '1 Day', value: result.trends?.['1d'] || 'NEUTRAL' },
  ]
  const trendStrength = typeof result.trend_strength === 'number' ? result.trend_strength : 0

  return (
    <div className="glass-lg border border-gray-700/30 rounded-lg p-4 sm:p-5 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-gold to-yellow-500 rounded-lg">
            <BarChart2 size={18} className="text-dark-bg" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white\">Multi-Timeframe Trends</h3>
            <p className="text-[10px] text-gray-400\">5 timeframe analysis</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto\">
        <table className="w-full text-xs\">
          <thead>
            <tr className="border-b border-gray-700/20 bg-dark-card-light/15\">
              <th className="text-left py-2 px-3 text-gray-400 font-bold uppercase tracking-widest text-[10px]\">Timeframe</th>
              <th className="text-center py-2 px-3 text-gray-400 font-bold uppercase tracking-widest text-[10px]\">Trend</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((trend, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-700/20 hover:bg-dark-card-light/20 transition-smooth"
              >
                <td className="py-2 px-3 font-semibold text-gray-300 text-sm">{trend.name}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                    trend.value === 'BULLISH' ? 'bg-bullish/20 text-bullish border border-bullish/40' :
                    trend.value === 'BEARISH' ? 'bg-bearish/20 text-bearish border border-bearish/40' :
                    'bg-gray-600/20 text-gray-300 border border-gray-600/40'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      trend.value === 'BULLISH' ? 'bg-bullish' :
                      trend.value === 'BEARISH' ? 'bg-bearish' :
                      'bg-gray-500'
                    }`}></span>
                    {trend.value}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-700/50">
          <div className="p-3 bg-dark-card-light/30 border border-gray-700/30 rounded-lg">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Market Structure</p>
            <p className="text-xs font-semibold text-accent">{result.market_structure || '-'}</p>
        </div>
        <div className="p-3 bg-dark-card-light/30 border border-gray-700/30 rounded-lg">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Break of Structure</p>
            <p className="text-xs font-semibold text-accent">{result.bos || '-'}</p>
        </div>
        <div className="p-3 bg-dark-card-light/30 border border-gray-700/30 rounded-lg">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Liquidity Sweep</p>
            <p className="text-xs font-semibold text-accent">{result.liquidity_sweep || '-'}</p>
        </div>
        <div className="p-3 bg-dark-card-light/30 border border-gray-700/30 rounded-lg">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trend Strength</p>
            <p className="text-xs font-semibold text-gold">{(trendStrength * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  )
}

export default TrendTable

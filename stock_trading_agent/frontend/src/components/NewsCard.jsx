import React from 'react'
import { Clock, Globe } from 'lucide-react'

function NewsCard({ event, onToggle, isExpanded }) {
  const impact = (event?.impact || '').toUpperCase()
  const isHigh = impact === 'HIGH'
  const isMedium = impact === 'MEDIUM'
  const borderClass = isHigh
    ? 'bg-yellow-900/10 border-yellow-700/30 hover:bg-yellow-900/20'
    : isMedium
      ? 'bg-orange-900/10 border-orange-700/30 hover:bg-orange-900/20'
      : 'bg-gray-900/10 border-gray-700/20 hover:bg-gray-900/15'

  return (
    <div
      onClick={() => onToggle && onToggle()}
      role="button"
      className={`w-full text-left p-3 rounded-lg border transition-smooth mb-2 ${borderClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{event.title}</p>
          <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
            <span className="inline-flex items-center gap-1"><Globe size={12} />{event.currency}</span>
            <span className="inline-flex items-center gap-1"><Clock size={12} />{event.time}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className={`px-2 py-1 rounded text-xs font-bold ${isHigh ? 'bg-bearish/40 text-bearish' : 'bg-yellow-900/40 text-yellow-200'}`}>
            {event.impact}
          </span>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-300">
        {event.volatility && <div><strong>Volatility:</strong> {event.volatility}</div>}
        {event.forecast && <div><strong>Forecast:</strong> {event.forecast}</div>}
        {event.previous && <div><strong>Previous:</strong> {event.previous}</div>}
        {isExpanded && (
          <div className="mt-2 text-sm text-gray-200">
            {event.volatility && <div className="mb-1"><strong>Volatility:</strong> {event.volatility}</div>}
            {event.analysis && <div className="mb-1"><strong>Analysis:</strong> {event.analysis}</div>}
            <div className="text-xs text-yellow-200 mt-2">Beginner: Expect increased volatility; use smaller position sizes and wait for confirmed price action.</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsCard

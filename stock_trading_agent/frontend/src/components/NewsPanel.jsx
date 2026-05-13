import React from 'react'
import { AlertCircle, Clock, Globe } from 'lucide-react'

function NewsPanel({ result }) {
  const economicCalendar = result?.economic_calendar || {}
  const { has_high_impact_news, events = [], risk_note = '' } = economicCalendar

  if (!has_high_impact_news && events.length === 0) {
    return null
  }

  const highImpactEvents = events.filter(e => e.is_high_impact)

  return (
    <div className="glass-lg border border-amber-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 fade-in w-full">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex-shrink-0">
          <AlertCircle size={18} className="sm:w-6 sm:h-6 text-dark-bg" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-white">High Impact News</h3>
          <p className="text-[11px] text-gray-400">Economic Calendar</p>
        </div>
      </div>

      {risk_note && (
        <div className="p-3 sm:p-4 bg-amber-900/20 border border-amber-700/40 rounded-lg">
          <p className="text-xs sm:text-sm text-amber-100 font-medium">{risk_note}</p>
        </div>
      )}

      <div className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto">
        {highImpactEvents.length > 0 ? (
          highImpactEvents.map((event, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 bg-amber-900/10 border border-amber-700/30 rounded-lg hover:bg-amber-900/20 transition-smooth"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-amber-100 truncate">{event.title}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${
                  event.impact === 'HIGH'
                    ? 'bg-bearish/40 text-bearish'
                    : event.impact === 'MEDIUM'
                    ? 'bg-yellow-900/40 text-yellow-200'
                    : 'bg-bullish/40 text-bullish'
                }`}>
                  {event.impact}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Globe size={14} className="text-amber-400 flex-shrink-0" />
                  <span className="font-medium">{event.currency}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-amber-400 flex-shrink-0" />
                  <span className="font-medium">{event.time}</span>
                </div>
              </div>

              {event.forecast && (
                <p className="text-xs text-gray-400 mt-2">
                  <span className="font-bold">Forecast:</span> {event.forecast}
                </p>
              )}
              {event.previous && (
                <p className="text-xs text-gray-400">
                  <span className="font-bold">Previous:</span> {event.previous}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="p-3 sm:p-4 bg-gray-900/30 border border-gray-700/30 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-400 text-center">No high-impact events in next 60 minutes</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsPanel

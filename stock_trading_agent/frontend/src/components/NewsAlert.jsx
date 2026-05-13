import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

function NewsAlert({ result }) {
  const economicCalendar = result?.economic_calendar || {}
  const { has_high_impact_news = false, events = [], risk_note = '' } = economicCalendar

  const highImpactEvents = events.filter(e => e.is_high_impact)
  const firstEvent = highImpactEvents[0]

  return (
    <div
      className={`glass-lg border rounded-lg sm:rounded-xl p-4 sm:p-6 fade-in w-full transition-all ${
        has_high_impact_news
          ? 'border-amber-700/50 bg-amber-900/15'
          : 'border-green-700/50 bg-green-900/10'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
          has_high_impact_news
            ? 'bg-gradient-to-br from-amber-500 to-orange-500'
            : 'bg-gradient-to-br from-green-500 to-emerald-500'
        }`}>
          {has_high_impact_news ? (
            <AlertCircle size={18} className="sm:w-6 sm:h-6 text-dark-bg" />
          ) : (
            <CheckCircle size={18} className="sm:w-6 sm:h-6 text-dark-bg" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-sm sm:text-base font-bold ${
            has_high_impact_news ? 'text-amber-100' : 'text-green-100'
          }`}>
            ⚠️ High Impact News
          </h3>

          {has_high_impact_news ? (
            <>
              <p className="text-xs text-gray-300 mt-1 font-medium">{risk_note}</p>
              {firstEvent && (
                <div className="mt-3 p-2 sm:p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
                  <p className="text-xs font-bold text-amber-100 truncate">{firstEvent.title}</p>
                  <div className="flex items-center gap-3 text-xs text-amber-200 mt-1.5">
                    <span className="font-medium">{firstEvent.currency}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      firstEvent.impact === 'HIGH'
                        ? 'bg-bearish/40 text-bearish'
                        : 'bg-yellow-900/40 text-yellow-200'
                    }`}>
                      {firstEvent.impact}
                    </span>
                    <span className="font-medium">{firstEvent.time}</span>
                  </div>
                </div>
              )}
              {highImpactEvents.length > 1 && (
                <p className="text-xs text-amber-200/70 mt-2 font-medium">
                  +{highImpactEvents.length - 1} more event{highImpactEvents.length > 2 ? 's' : ''}
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-green-200 mt-1 font-medium">
              No high-impact news nearby. Market conditions stable.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewsAlert

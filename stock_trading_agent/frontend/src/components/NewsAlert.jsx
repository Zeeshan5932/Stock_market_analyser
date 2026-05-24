import React, { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Clock, Globe } from 'lucide-react'

function NewsAlert({ result, onPairChange, onTimeframeChange, onAnalyze, externalOpen, onCloseExternal }) {
  const economicCalendar = result?.economic_calendar || {}
  const { has_high_impact_news = false, events = [], risk_note = '' } = economicCalendar
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const visibleEvents = useMemo(() => {
    const important = events.filter((event) => event.is_high_impact)
    return (important.length > 0 ? important : events).slice(0, 4)
  }, [events])

  useEffect(() => {
    setActiveIndex(0)
  }, [visibleEvents.length])

  // Open when external header/control requests it
  useEffect(() => {
    if (externalOpen) setIsOpen(true)
  }, [externalOpen])

  const activeEvent = visibleEvents[activeIndex] || visibleEvents[0]

  const currencyToPair = (currency) => {
    if (!currency) return null
    const map = {
      'USD': 'GBP/USD',
      'EUR': 'EUR/USD',
      'GBP': 'GBP/USD',
      'JPY': 'USD/JPY',
      'AUD': 'AUD/USD',
      'CAD': 'USD/CAD',
      'NZD': 'NZD/USD',
      'XAU': 'XAU/USD',
      'XAG': 'XAG/USD',
    }
    return map[currency.toUpperCase()] || null
  }

  return (
    <div
      className={`glass-lg border rounded-lg sm:rounded-xl p-4 sm:p-6 fade-in w-full transition-all ${
        has_high_impact_news
          ? 'border-amber-700/50 bg-amber-900/15'
          : 'border-green-700/50 bg-green-900/10'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
            has_high_impact_news
              ? 'bg-gradient-to-br from-amber-500 to-orange-500'
              : 'bg-gradient-to-br from-green-500 to-emerald-500'
          }`}
        >
          {has_high_impact_news ? (
            <AlertCircle size={18} className="sm:w-6 sm:h-6 text-dark-bg" />
          ) : (
            <CheckCircle size={18} className="sm:w-6 sm:h-6 text-dark-bg" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className={`text-sm sm:text-base font-bold ${has_high_impact_news ? 'text-amber-100' : 'text-green-100'}`}>
                High Impact News
              </h3>
              <p className="text-[11px] text-gray-400">Daily economic calendar</p>
            </div>

            {/* Debug badge: shows events count and high-impact flag */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300/80">Events:</span>
              <span className="text-xs font-semibold text-white">{events.length}</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded ${has_high_impact_news ? 'bg-amber-700 text-amber-100' : 'bg-green-700 text-green-100'}`}>
                {has_high_impact_news ? 'HighImpact' : 'NoHighImpact'}
              </span>
            </div>

            {visibleEvents.length > 0 && (
              <button
                onClick={() => {
                  const next = !isOpen
                  setIsOpen(next)
                  if (!next && onCloseExternal) onCloseExternal()
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-smooth ${
                  has_high_impact_news
                    ? 'bg-amber-900/30 text-amber-100 border border-amber-700/40 hover:bg-amber-900/45'
                    : 'bg-green-900/20 text-green-100 border border-green-700/40 hover:bg-green-900/35'
                }`}
              >
                {isOpen ? 'Hide news' : 'View news'}
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {has_high_impact_news ? (
            <>
              <p className="text-xs text-gray-300 mt-2 font-medium">{risk_note || 'High-impact news nearby.'}</p>

              {visibleEvents.length > 0 && isOpen && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {visibleEvents.map((event, idx) => (
                      <button
                        key={`${event.title}-${event.time}-${idx}`}
                        onClick={() => {
                          setActiveIndex(idx)
                          if (event.url && typeof window !== 'undefined') {
                            window.open(event.url, '_blank')
                          }
                        }}
                        className={`text-left p-3 rounded-lg border transition-smooth ${
                          activeIndex === idx
                            ? 'bg-amber-900/30 border-amber-500/50'
                            : 'bg-amber-900/10 border-amber-700/30 hover:bg-amber-900/20'
                        }`}
                      >
                        <p className="text-xs font-bold text-amber-100 line-clamp-2">{event.title}</p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-200/90">
                          <span className="font-semibold">{event.currency}</span>
                          <span className="opacity-60">•</span>
                          <span>{event.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                      {activeEvent && (
                        <div className="p-3 sm:p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg space-y-2">
                          <p className="text-sm font-bold text-amber-50">{activeEvent.title}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200">
                            <span className="inline-flex items-center gap-1">
                              <Globe size={13} />
                              {activeEvent.currency}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock size={13} />
                              {activeEvent.time}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeEvent.impact === 'HIGH' ? 'bg-bearish/40 text-bearish' : 'bg-yellow-900/40 text-yellow-200'}`}>
                              {activeEvent.impact}
                            </span>
                          </div>
                          {activeEvent.forecast && <p className="text-xs text-amber-100/90"><span className="font-bold">Forecast:</span> {activeEvent.forecast}</p>}
                          {activeEvent.previous && <p className="text-xs text-amber-100/90"><span className="font-bold">Previous:</span> {activeEvent.previous}</p>}

                          <div className="flex items-center gap-2 mt-2">
                            {onPairChange && (
                              <button
                                onClick={() => {
                                  const pair = currencyToPair(activeEvent.currency)
                                  if (pair) {
                                    onPairChange(pair)
                                  }
                                  if (onAnalyze) onAnalyze()
                                }}
                                className="text-xs px-3 py-1 rounded bg-amber-700/40 text-amber-100 font-semibold"
                              >
                                Open Chart
                              </button>
                            )}
                            {onAnalyze && (
                              <button
                                onClick={() => onAnalyze()}
                                className="text-xs px-3 py-1 rounded border border-amber-700/30 text-amber-100"
                              >
                                Refresh Analysis
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                </div>
              )}

              {!isOpen && visibleEvents.length > 0 && (
                <p className="text-xs text-amber-200/80 mt-2 font-medium">
                  {visibleEvents.length} news item{visibleEvents.length > 1 ? 's' : ''} ready to open.
                </p>
              )}
            </>
          ) : visibleEvents.length > 0 ? (
            <>
              <p className="text-xs text-green-200 mt-2 font-medium">No high-impact news nearby. Tap to view today&apos;s events.</p>

              {isOpen && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {visibleEvents.map((event, idx) => (
                      <button
                        key={`${event.title}-${event.time}-${idx}`}
                        onClick={() => {
                          setActiveIndex(idx)
                          if (event.url && typeof window !== 'undefined') {
                            window.open(event.url, '_blank')
                          }
                        }}
                        className={`text-left p-3 rounded-lg border transition-smooth ${
                          activeIndex === idx
                            ? 'bg-green-900/30 border-green-500/50'
                            : 'bg-green-900/10 border-green-700/30 hover:bg-green-900/20'
                        }`}
                      >
                        <p className="text-xs font-bold text-green-50 line-clamp-2">{event.title}</p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-green-200/90">
                          <span className="font-semibold">{event.currency}</span>
                          <span className="opacity-60">•</span>
                          <span>{event.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {activeEvent && (
                    <div className="p-3 sm:p-4 bg-green-900/20 border border-green-700/30 rounded-lg space-y-2">
                      <p className="text-sm font-bold text-green-50">{activeEvent.title}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-green-200">
                        <span className="inline-flex items-center gap-1">
                          <Globe size={13} />
                          {activeEvent.currency}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={13} />
                          {activeEvent.time}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeEvent.impact === 'HIGH' ? 'bg-bearish/40 text-bearish' : 'bg-yellow-900/40 text-yellow-200'}`}>
                          {activeEvent.impact}
                        </span>
                      </div>
                      {activeEvent.forecast && <p className="text-xs text-green-100/90"><span className="font-bold">Forecast:</span> {activeEvent.forecast}</p>}
                      {activeEvent.previous && <p className="text-xs text-green-100/90"><span className="font-bold">Previous:</span> {activeEvent.previous}</p>}
                    </div>
                  )}
                </div>
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

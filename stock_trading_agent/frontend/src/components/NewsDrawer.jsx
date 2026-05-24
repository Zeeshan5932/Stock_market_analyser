import React, { useEffect, useState } from 'react'
import NewsCard from './NewsCard'
import NewsModal from './NewsModal'

const DEMO_EVENTS = [
  {
    title: 'US Consumer Price Index (CPI)',
    currency: 'USD',
    impact: 'HIGH',
    time: 'TBD',
    forecast: 'N/A',
    previous: 'N/A',
    actual: '',
    volatility: 'HIGH',
    analysis: 'US CPI measures inflation. It can move USD, gold, and major forex pairs sharply.',
  },
  {
    title: 'FOMC Interest Rate Decision',
    currency: 'USD',
    impact: 'HIGH',
    time: 'TBD',
    forecast: 'N/A',
    previous: 'N/A',
    actual: '',
    volatility: 'VERY HIGH',
    analysis: 'FOMC decisions can create strong directional moves across forex and gold.',
  },
  {
    title: 'US Non-Farm Payrolls (NFP)',
    currency: 'USD',
    impact: 'HIGH',
    time: 'TBD',
    forecast: 'N/A',
    previous: 'N/A',
    actual: '',
    volatility: 'HIGH',
    analysis: 'NFP often increases USD volatility and can cause sharp intraday swings.',
  },
  {
    title: 'Interest Rate Decision',
    currency: 'USD',
    impact: 'HIGH',
    time: 'TBD',
    forecast: 'N/A',
    previous: 'N/A',
    actual: '',
    volatility: 'HIGH',
    analysis: 'Rate decisions often reprice market expectations and move FX pairs quickly.',
  },
]

function NewsDrawer({ open, onClose }) {
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!open) return
    fetch('/api/news')
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.top_news || data.events || DEMO_EVENTS)
      })
      .catch((e) => {
        console.error('Failed to fetch news', e)
        setEvents(DEMO_EVENTS)
      })
      .finally(() => setLoading(false))
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-transparent">
      <div className="h-full flex flex-col bg-transparent p-4">
        <div className="bg-dark-card rounded-lg p-4 shadow-lg h-full flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Economic News</h3>
            <button onClick={onClose} className="text-sm text-gray-300">Close</button>
          </div>

          <div className="mt-4 flex-1 overflow-auto">
            {loading ? (
              <div className="text-sm text-gray-300">Fetching economic news...</div>
            ) : (
              <div>
                {events.map((ev, idx) => (
                  <div key={`${ev.title}-${idx}`}>
                    <NewsCard
                      event={ev}
                      isExpanded={expandedIndex === idx}
                      onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selected && <NewsModal event={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}

export default NewsDrawer

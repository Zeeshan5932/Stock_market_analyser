import React from 'react'

function NewsModal({ event, onClose }) {
  if (!event) return null

  const guidance = (ev) => {
    const title = (ev.title || '').toUpperCase()
    const currency = ev.currency || ''
    // Simple heuristic guidance
    if (title.includes('CPI')) {
      return {
        explanation: `${ev.title} is an inflation measure. Releases often move ${currency} and related assets.`,
        volatility: 'High',
        impact: `${currency} may move sharply; safe to expect short-term volatility.`,
        guidance: 'Consider waiting for initial volatility to settle before trading; use small position sizes.'
      }
    }
    if (title.includes('NON-FARM') || title.includes('NFP')) {
      return {
        explanation: `${ev.title} (NFP) measures US employment. It frequently causes large USD moves.`,
        volatility: 'High',
        impact: 'USD pairs often gap and spike; watch stop-loss placement carefully.',
        guidance: 'Avoid entering right at release; consider analyzing after 15-30 minutes.'
      }
    }
    if (title.includes('FOMC') || title.includes('INTEREST RATE') || title.includes('RATE DECISION')) {
      return {
        explanation: `${ev.title} is central bank policy related and can change rates or guidance. Market moves can be sustained.`,
        volatility: 'Very High',
        impact: `${currency} and correlated markets (bonds, gold) can trend strongly after the release.`,
        guidance: 'Prefer paper-trading or wait for confirmed price action before committing.'
      }
    }

    return {
      explanation: ev.title,
      volatility: 'Medium',
      impact: `${currency} may see increased volatility.`,
      guidance: 'Use risk management and small sizes.'
    }
  }

  const g = guidance(event)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-w-2xl w-full bg-dark-card rounded-lg p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-white">{event.title}</h3>
          <button onClick={onClose} className="text-sm text-gray-300">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="text-sm text-gray-300"><strong>Currency:</strong> {event.currency}</div>
          <div className="text-sm text-gray-300"><strong>Time:</strong> {event.time}</div>
          <div className="text-sm text-gray-300"><strong>Impact:</strong> {event.impact}</div>
          {event.forecast && <div className="text-sm text-gray-300"><strong>Forecast:</strong> {event.forecast}</div>}
          {event.previous && <div className="text-sm text-gray-300"><strong>Previous:</strong> {event.previous}</div>}
        </div>

        <div className="mt-4 p-4 rounded bg-gray-900/30">
          <p className="text-sm text-yellow-200"><strong>Explanation:</strong> {g.explanation}</p>
          <p className="text-sm text-yellow-200 mt-2"><strong>Expected Volatility:</strong> {g.volatility}</p>
          <p className="text-sm text-yellow-200 mt-2"><strong>Possible Market Impact:</strong> {g.impact}</p>
          <p className="text-sm text-yellow-200 mt-2"><strong>Beginner Guidance:</strong> {g.guidance}</p>
        </div>
      </div>
    </div>
  )
}

export default NewsModal

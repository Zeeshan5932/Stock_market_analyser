import React from 'react'
import {
  DollarSign,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react'
import {
  formatPrice,
  formatConfidence,
  getSignalColor,
  getBiasColor,
  getSignalBgColor,
} from '../utils/formatters'

function MarketCards({ result }) {
  const signal = result?.signal || 'HOLD'
  const signalColorMap = {
    'BUY': { bg: 'bg-bullish/10', border: 'border-bullish/40', text: 'text-bullish', icon: 'from-bullish to-bullish-dark' },
    'STRONG BUY': { bg: 'bg-bullish/10', border: 'border-bullish/40', text: 'text-bullish', icon: 'from-bullish to-bullish-dark' },
    'SELL': { bg: 'bg-bearish/10', border: 'border-bearish/40', text: 'text-bearish', icon: 'from-bearish to-red-600' },
    'STRONG SELL': { bg: 'bg-bearish/10', border: 'border-bearish/40', text: 'text-bearish', icon: 'from-bearish to-red-600' },
    'HOLD': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', text: 'text-yellow-400', icon: 'from-yellow-500 to-amber-500' },
    'WAIT_FOR_NEWS': { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-400', icon: 'from-orange-500 to-red-500' },
  }

  const cardBg = signalColorMap[signal] || { bg: 'bg-gray-500/10', border: 'border-gray-500/40', text: 'text-gray-400', icon: 'from-gray-500 to-gray-400' }

  const cards = [
    {
      title: 'Pair',
      value: result?.symbol || '-',
      icon: DollarSign,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/40',
      detail: formatPrice(result?.latest_price),
    },
    {
      title: 'Signal',
      value: signal,
      icon: Target,
      bg: cardBg.bg,
      border: cardBg.border,
      text: cardBg.text,
      detail: formatConfidence(result?.confidence) + ' confidence',
    },
    {
      title: 'Bias',
      value: result?.market_bias || '-',
      icon: TrendingUp,
      bg: result?.market_bias === 'BULLISH' ? 'bg-bullish/10' : 'bg-bearish/10',
      border: result?.market_bias === 'BULLISH' ? 'border-bullish/40' : 'border-bearish/40',
      text: result?.market_bias === 'BULLISH' ? 'text-bullish' : 'text-bearish',
      detail: 'Multi-timeframe',
    },
    {
      title: 'Volatility',
      value: result?.session?.volatility ?? '-',
      icon: Zap,
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/40',
      detail: result?.session?.active_session || '-',
    },
  ]

  return (
    <>
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={`market-card glass border ${card.border} ${card.bg} p-3 sm:p-4 rounded-lg fade-in`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1">
                {card.title}
              </span>
              <div className={`p-1.5 bg-gradient-to-br ${card.icon === DollarSign ? 'from-blue-500 to-blue-400' : card.icon === Target ? (signal === 'BUY' ? 'from-bullish to-bullish-dark' : signal === 'SELL' ? 'from-bearish to-red-600' : 'from-yellow-500 to-amber-500') : card.icon === TrendingUp ? (result?.market_bias === 'BULLISH' ? 'from-bullish to-bullish-dark' : 'from-bearish to-red-600') : 'from-orange-500 to-red-500'} rounded flex-shrink-0`}>
                <Icon size={12} className="text-white" />
              </div>
            </div>

            <p className={`text-base sm:text-lg font-bold ${card.text || 'text-white'} break-words mb-1`}>
              {card.value}
            </p>

            <p className="text-[10px] text-gray-400 font-medium truncate">{card.detail}</p>
          </div>
        )
      })}
    </>
  )
}

export default MarketCards

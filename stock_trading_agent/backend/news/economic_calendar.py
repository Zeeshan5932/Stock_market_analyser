"""High-impact economic news filter using Finnhub API."""

from __future__ import annotations

import requests
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from config import Settings


HIGH_IMPACT_KEYWORDS = {
    "CPI",
    "PPI",
    "NON-FARM PAYROLL",
    "NFP",
    "FOMC",
    "INTEREST RATE",
    "FED SPEECH",
    "GDP",
    "UNEMPLOYMENT",
}

CURRENCY_MAP = {
    "USD": ["UNITED STATES", "US", "FOMC", "FED", "NFP", "CPI", "PPI", "JOBLESS", "INITIAL CLAIMS"],
    "EUR": ["EUROPEAN UNION", "EURO", "ECB", "EUROZONE"],
    "GBP": ["UNITED KINGDOM", "BOE", "BANK OF ENGLAND"],
    "JPY": ["JAPAN", "BOJ", "BANK OF JAPAN"],
    "CHF": ["SWITZERLAND", "SNB", "SWISS NATIONAL"],
    "CAD": ["CANADA", "BOC", "BANK OF CANADA"],
    "AUD": ["AUSTRALIA", "RBA", "RESERVE BANK"],
    "NZD": ["NEW ZEALAND", "RBNZ"],
}


def _get_currency_from_symbol(symbol: str) -> str:
    """Extract currency from trading symbol (e.g., EUR/USD -> USD, XAU/USD -> USD)."""
    parts = symbol.split("/")
    if len(parts) == 2:
        return parts[1].upper()
    return "USD"


def _is_high_impact(title: str, event: str) -> bool:
    """Check if an event has high-impact keywords."""
    text = f"{title} {event}".upper()
    return any(keyword in text for keyword in HIGH_IMPACT_KEYWORDS)


def _get_currency_keywords(currency: str) -> List[str]:
    """Get keywords associated with a currency."""
    return CURRENCY_MAP.get(currency, [])


def _matches_currency(title: str, event: str, currency: str) -> bool:
    """Check if an event is associated with a specific currency."""
    text = f"{title} {event}".upper()
    keywords = _get_currency_keywords(currency)
    return any(keyword in text for keyword in keywords)


def get_economic_calendar(settings: Settings) -> Dict[str, Any]:
    """Fetch and filter economic calendar from Finnhub.
    
    Returns:
        {
            "has_high_impact_news": bool,
            "events": [{"title": str, "currency": str, "impact": str, "time": str}],
            "risk_note": str,
        }
    """
    if not settings.finnhub_api_key:
        return {
            "has_high_impact_news": False,
            "events": [],
            "risk_note": "Finnhub API key not configured.",
        }

    try:
        # Finnhub economic calendar endpoint
        url = "https://finnhub.io/api/v1/economic-calendar"
        params = {
            "token": settings.finnhub_api_key,
        }

        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()

        if not data:
            return {
                "has_high_impact_news": False,
                "events": [],
                "risk_note": "",
            }

        now_utc = datetime.now(timezone.utc)
        # Expand window to next 7 days so backend can return upcoming events
        window_end = now_utc + timedelta(days=7)

        # Collect upcoming events within the next 7 days
        upcoming_events = []
        has_high_impact = False

        def _analysis_for_title(title: str, currency: str) -> str:
            t = title.upper()
            if 'CPI' in t:
                return f"{title}: May increase {currency} volatility. Gold and forex pairs can move sharply during release."
            if 'NON-FARM' in t or 'NFP' in t:
                return f"{title}: US employment data often causes sharp USD moves and sudden volatility."
            if 'FOMC' in t or 'INTEREST RATE' in t or 'RATE DECISION' in t:
                return f"{title}: Central bank policy can drive sustained moves in {currency}, bonds and precious metals."
            if 'GDP' in t:
                return f"{title}: Broad economic growth measure; may influence currency sentiment and risk appetite."
            if 'UNEMPLOY' in t:
                return f"{title}: Labor market data can affect monetary policy expectations and {currency}."
            return f"{title}: Market-moving event; expect increased short-term volatility."

        for event in data:
            event_time_str = event.get("date", "")
            if not event_time_str:
                continue

            try:
                event_time = datetime.fromisoformat(event_time_str.replace("Z", "+00:00"))
            except (ValueError, TypeError):
                continue

            # Only look at events within the next 7 days
            if now_utc <= event_time <= window_end:
                title = event.get("event", "")
                currency = event.get("country", "").upper() if event.get("country") else "USD"
                impact = event.get("impact", "").upper() if event.get("impact") else "MEDIUM"
                forecast = event.get("forecast", "")
                previous = event.get("previous", "")
                actual = event.get("actual", "") if event.get("actual") is not None else ""

                # Map country code to currency
                currency_map_code = {
                    "US": "USD",
                    "EU": "EUR",
                    "GB": "GBP",
                    "JP": "JPY",
                    "CH": "CHF",
                    "CA": "CAD",
                    "AU": "AUD",
                    "NZ": "NZD",
                }
                currency = currency_map_code.get(currency, currency)

                is_high_impact = (impact == 'HIGH') or _is_high_impact(title, "")
                if is_high_impact:
                    has_high_impact = True

                volatility = 'HIGH' if impact == 'HIGH' else ('MEDIUM' if impact == 'MEDIUM' else 'LOW')

                upcoming_events.append({
                    "title": title,
                    "currency": currency,
                    "impact": impact,
                    "time": event_time.strftime("%Y-%m-%d %H:%M UTC"),
                    "forecast": forecast,
                    "previous": previous,
                    "actual": actual,
                    "is_high_impact": is_high_impact,
                    "volatility": volatility,
                    "analysis": _analysis_for_title(title, currency),
                })

        # Sort by time
        upcoming_events.sort(key=lambda x: x["time"])

        risk_note = ""
        if has_high_impact:
            risk_note = "⚠️ High-impact economic event(s) in the coming 24 hours. Increased volatility possible."

        return {
            "has_high_impact_news": has_high_impact,
            "events": upcoming_events[:10],  # Return top 10
            "risk_note": risk_note,
        }

    except requests.RequestException as e:
        return {
            "has_high_impact_news": False,
            "events": [],
            "risk_note": f"Failed to fetch news: {str(e)}",
        }
    except Exception as e:
        return {
            "has_high_impact_news": False,
            "events": [],
            "risk_note": f"Error processing news: {str(e)}",
        }


def adjust_signal_for_news(
    signal: str,
    confidence: float,
    symbol: str,
    news_data: Dict[str, Any],
) -> tuple[str, float, str]:
    """Adjust trading signal if high-impact news is present.
    
    Args:
        signal: Current trading signal (BUY, SELL, HOLD, etc.)
        confidence: Current confidence level (0-1)
        symbol: Trading symbol (e.g., EUR/USD)
        news_data: News data from get_economic_calendar()
    
    Returns:
        (adjusted_signal, adjusted_confidence, warning_text)
    """
    if not news_data.get("has_high_impact_news"):
        return signal, confidence, ""

    # Get relevant currency from symbol
    symbol_currency = _get_currency_from_symbol(symbol)
    
    # Check if any high-impact events match the symbol's currency
    relevant_events = [
        e for e in news_data.get("events", [])
        if e.get("is_high_impact") and e.get("currency") == symbol_currency
    ]

    if not relevant_events:
        return signal, confidence, ""

    # Adjust signal and confidence
    new_signal = signal
    new_confidence = confidence * 0.7  # Reduce confidence by 30%
    warning = f"⚠️ High-impact {symbol_currency} news incoming. Awaiting release."

    # Convert BUY/SELL to WAIT variants
    if signal in {"BUY", "STRONG BUY"}:
        new_signal = "WAIT_FOR_NEWS"
    elif signal in {"SELL", "STRONG SELL"}:
        new_signal = "WAIT_FOR_NEWS"

    return new_signal, new_confidence, warning

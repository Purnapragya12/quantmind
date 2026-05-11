def analyze_stock(data):

    close = data["close"]
    high = data["high"]
    low = data["low"]
    pe = data["pe_ratio"]

    volatility = ((high - low) / close) * 100

    # =========================
    # TREND LOGIC
    # =========================

    if close > ((high + low) / 2):
        trend = "Bullish"
    else:
        trend = "Bearish"

    # =========================
    # RISK LOGIC
    # =========================

    if volatility > 4:
        risk = "High"
    elif volatility > 2:
        risk = "Moderate"
    else:
        risk = "Low"

    # =========================
    # AI SUMMARY
    # =========================

    summary = (
        f"{data['ticker']} currently shows "
        f"{trend.lower()} momentum with "
        f"{risk.lower()} volatility levels. "
        f"Current market activity suggests "
        f"close monitoring of price action."
    )

    return {
        "trend": trend,
        "risk": risk,
        "volatility_percent": round(volatility, 2),
        "summary": summary
    }
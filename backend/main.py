from fastapi import FastAPI
import yfinance as yf
from fastapi.middleware.cors import CORSMiddleware

from ai_engine import analyze_stock

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():

    return {
        "project": "QuantMind AI",
        "status": "Running"
    }

@app.get("/stock/{ticker}")
def get_stock(ticker: str):

    stock = yf.Ticker(ticker)

    info = stock.info
    hist = stock.history(period="1mo")

    latest = hist.iloc[-1]

    return {
        "ticker": ticker.upper(),
        "company": info.get("longName"),
        "sector": info.get("sector"),
        "market_cap": info.get("marketCap"),

        "close": float(latest["Close"]),
        "high": float(latest["High"]),
        "low": float(latest["Low"]),
        "volume": float(latest["Volume"]),

        "pe_ratio": info.get("trailingPE"),
        "52_week_high": info.get("fiftyTwoWeekHigh"),
        "52_week_low": info.get("fiftyTwoWeekLow")
    }

@app.get("/analyze/{ticker}")
def analyze(ticker: str):

    stock = yf.Ticker(ticker)

    info = stock.info
    hist = stock.history(period="1mo")

    latest = hist.iloc[-1]

    data = {
        "ticker": ticker.upper(),
        "close": float(latest["Close"]),
        "high": float(latest["High"]),
        "low": float(latest["Low"]),
        "pe_ratio": info.get("trailingPE")
    }

    analysis = analyze_stock(data)

    return {
        "ticker": ticker.upper(),
        "analysis": analysis
    }
@app.get("/market-scan")
def market_scan():

    tickers = [
        "NVDA",
        "AAPL",
        "TSLA",
        "MSFT",
        "AMZN"
    ]

    results = []

    for ticker in tickers:

        stock = yf.Ticker(ticker)

        info = stock.info
        hist = stock.history(period="1mo")

        latest = hist.iloc[-1]

        data = {
            "ticker": ticker,
            "close": float(latest["Close"]),
            "high": float(latest["High"]),
            "low": float(latest["Low"]),
            "pe_ratio": info.get("trailingPE")
        }

        analysis = analyze_stock(data)

        results.append({
            "ticker": ticker,
            "price": round(data["close"], 2),
            "trend": analysis["trend"],
            "risk": analysis["risk"],
            "volatility": analysis["volatility_percent"]
        })

    return results
@app.get("/history/{ticker}")
def stock_history(ticker: str):

    stock = yf.Ticker(ticker)

    hist = stock.history(period="1mo")

    chart_data = []

    for index, row in hist.iterrows():

        chart_data.append({
            "date": index.strftime("%Y-%m-%d"),
            "close": round(float(row["Close"]), 2)
        })

    return chart_data
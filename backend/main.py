from fastapi import FastAPI
import yfinance as yf
from fastapi.middleware.cors import CORSMiddleware
import pandas_ta as ta
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
portfolio = {
    "cash": 100000,
    "holdings": {}
}

@app.get("/portfolio")
def get_portfolio():

    return portfolio

@app.post("/buy/{ticker}/{amount}")
def buy_stock(ticker: str, amount: int):

    stock = yf.Ticker(ticker)

    price = float(
        stock.history(period="1d").iloc[-1]["Close"]
    )

    cost = price * amount

    if portfolio["cash"] >= cost:

        portfolio["cash"] -= cost

        if ticker not in portfolio["holdings"]:

            portfolio["holdings"][ticker] = {
                "shares": 0,
                "avg_price": price
            }

        portfolio["holdings"][ticker]["shares"] += amount

        return {
            "message": f"Bought {amount} shares of {ticker}",
            "remaining_cash": portfolio["cash"]
        }

    return {
        "error": "Insufficient funds"
    }
@app.get("/portfolio-value")
def portfolio_value():

    results = []

    total_value = portfolio["cash"]

    for ticker, holding in portfolio["holdings"].items():

        stock = yf.Ticker(ticker)

        current_price = float(
            stock.history(period="1d").iloc[-1]["Close"]
        )

        shares = holding["shares"]

        avg_price = holding["avg_price"]

        holding_value = current_price * shares

        pnl = (
            (current_price - avg_price)
            * shares
        )

        total_value += holding_value

        results.append({

            "ticker": ticker,

            "shares": shares,

            "avg_price": round(avg_price, 2),

            "current_price": round(current_price, 2),

            "holding_value": round(holding_value, 2),

            "pnl": round(pnl, 2)

        })

    return {

        "cash": round(portfolio["cash"], 2),

        "total_portfolio_value": round(total_value, 2),

        "holdings": results

    }
@app.get("/backtest/{ticker}")
def backtest(ticker: str):

    stock = yf.Ticker(ticker)

    df = stock.history(period="6mo")

    # =========================
    # INDICATORS
    # =========================

    df["SMA20"] = ta.sma(
        df["Close"],
        length=20
    )

    df["SMA50"] = ta.sma(
        df["Close"],
        length=50
    )

    # =========================
    # SIGNALS
    # =========================

    position = 0

    buy_price = 0

    profit = 0

    trades = []

    for i in range(50, len(df)):

        sma20 = df["SMA20"].iloc[i]
        sma50 = df["SMA50"].iloc[i]

        price = df["Close"].iloc[i]

        date = str(df.index[i].date())

        # BUY SIGNAL

        if sma20 > sma50 and position == 0:

            position = 1
            buy_price = price

            trades.append({
                "date": date,
                "action": "BUY",
                "price": round(price, 2)
            })

        # SELL SIGNAL

        elif sma20 < sma50 and position == 1:

            position = 0

            trade_profit = price - buy_price

            profit += trade_profit

            trades.append({
                "date": date,
                "action": "SELL",
                "price": round(price, 2),
                "profit": round(trade_profit, 2)
            })

    return {

        "ticker": ticker,

        "strategy": "SMA20/SMA50 Crossover",

        "total_profit": round(profit, 2),

        "total_trades": len(trades),

        "trades": trades

    }
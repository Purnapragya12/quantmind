import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {

  const [stock, setStock] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [scanner, setScanner] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState("NVDA");
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioValue, setPortfolioValue] = useState(null);
  const [backtest, setBacktest] = useState(null);
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {

    fetch(`https://quantmind-production-82d4.up.railway.app/stock/${selectedTicker}`)
      .then(res => res.json())
      .then(data => setStock(data));

    fetch(`https://quantmind-production-82d4.up.railway.app/analyze/${selectedTicker}`)
      .then(res => res.json())
      .then(data => setAnalysis(data.analysis));
    fetch("https://quantmind-production-82d4.up.railway.app/market-scan")
      .then(res => res.json())
      .then(data => setScanner(data));
    fetch(`https://quantmind-production-82d4.up.railway.app/history/${selectedTicker}`)
      .then(res => res.json())
      .then(data => setChartData(data));
    fetch("https://quantmind-production-82d4.up.railway.app/portfolio")
      .then(res => res.json())
      .then(data => setPortfolio(data));
    fetch("https://quantmind-production-82d4.up.railway.app/portfolio-value")
      .then(res => res.json())
      .then(data => setPortfolioValue(data));
    fetch(`https://quantmind-production-82d4.up.railway.app/backtest/${selectedTicker}`)
      .then(res => res.json())
      .then(data => setBacktest(data));
    fetch("https://quantmind-production-82d4.up.railway.app/risk-analysis")
      .then(res => res.json())
      .then(data => setRiskData(data));

  }, [selectedTicker]);

  return (

    <div className="min-h-screen bg-[#050816] text-white p-10">

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-6xl font-bold text-cyan-400">
          QuantMind AI
        </h1>

        <p className="text-zinc-400 mt-3 text-lg">
          AI-Powered Financial Intelligence Platform
        </p>

      </div>

      {/* DASHBOARD GRID */}

      <div className="grid grid-cols-2 gap-8">

        {/* MARKET PANEL */}

        <div className="bg-[#0b1120] border border-cyan-500 rounded-3xl p-8 shadow-2xl">

          <h2 className="text-3xl text-cyan-300 mb-6 font-semibold">
            Market Data
          </h2>

          {stock && (

            <div className="space-y-4 text-lg">

              <div className="flex justify-between">
                <span className="text-zinc-400">Ticker</span>
                <span>{stock.ticker}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Company</span>
                <span>{stock.company}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Price</span>
                <span className="text-green-400">
                  ${stock.close.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Daily High</span>
                <span>${stock.high.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Daily Low</span>
                <span>${stock.low.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Volume</span>
                <span>{stock.volume.toLocaleString()}</span>
              </div>


              <button
                onClick={() => {

                  fetch(
                    `https://quantmind-production-82d4.up.railway.app/buy/${selectedTicker}/1`,
                    {
                      method: "POST"
                    }
                  )

                  .then(() =>
                    fetch("https://quantmind-production-82d4.up.railway.app/portfolio")
                  )

                  .then(res => res.json())

                  .then(data => setPortfolio(data))

                  .then(() =>

                    fetch("https://quantmind-production-82d4.up.railway.app/portfolio-value")

                  )

                  .then(res => res.json())

                  .then(data => setPortfolioValue(data));

                }}

                className="
                  mt-6
                  bg-cyan-500
                  hover:bg-cyan-400
                  text-black
                  px-5
                  py-3
                  rounded-xl
                  font-semibold
                  transition-all
                "
              >

                Buy 1 Share

              </button>
            </div>
            

          )}

        </div>

        {/* AI PANEL */}

        <div className="bg-[#0b1120] border border-purple-500 rounded-3xl p-8 shadow-2xl">

          <h2 className="text-3xl text-purple-300 mb-6 font-semibold">
            AI Market Analysis
          </h2>

          {analysis && (

            <div className="space-y-5">

              <div className="flex justify-between text-lg">
                <span className="text-zinc-400">
                  Trend
                </span>

                <span className="text-cyan-400 font-semibold">
                  {analysis.trend}
                </span>
              </div>

              <div className="flex justify-between text-lg">
                <span className="text-zinc-400">
                  Risk
                </span>

                <span className="text-yellow-400 font-semibold">
                  {analysis.risk}
                </span>
              </div>

              <div className="flex justify-between text-lg">
                <span className="text-zinc-400">
                  Volatility
                </span>

                <span className="text-red-400 font-semibold">
                  {analysis.volatility_percent}%
                </span>
              </div>

              <div className="bg-black/40 border border-zinc-800 rounded-2xl p-5 mt-6">

                <p className="text-zinc-300 leading-relaxed text-md">
                  {analysis.summary}
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* MARKET SCANNER */}

      <div className="mt-10">

        <h2 className="text-3xl text-cyan-300 mb-6 font-semibold">
          AI Market Scanner
        </h2>

        <div className="grid grid-cols-5 gap-4">

          {scanner.map((stock, index) => (

            <div
              key={index}
              onClick={() => setSelectedTicker(stock.ticker)}
              className={`
                bg-[#0b1120]
                border
                rounded-2xl
                p-5
                cursor-pointer
                transition-all
                duration-300
                hover:scale-105
                hover:border-cyan-400

                ${
                  selectedTicker === stock.ticker
                  ? "border-cyan-400 shadow-[0_0_20px_#00d9ff55]"
                  : "border-cyan-800"
                }
              `}
            >

              <div className="text-2xl font-bold text-cyan-400">
                {stock.ticker}
              </div>

              <div className="mt-3 text-zinc-300">
                ${stock.price}
              </div>

              <div className="mt-2">

                <span className={
                  stock.trend === "Bullish"
                  ? "text-green-400"
                  : "text-red-400"
                }>
                  {stock.trend}
                </span>

              </div>

              <div className="text-yellow-400 mt-1">
                {stock.risk} Risk
              </div>

              <div className="text-pink-400 mt-1">
                Volatility: {stock.volatility}%
              </div>

            </div>

          ))}

        </div>

      </div>
      {/* PRICE CHART */}

      <div className="mt-12">

        <h2 className="text-3xl text-cyan-300 mb-6 font-semibold">
          {selectedTicker} Interactive Price Chart
        </h2>

        <div className="bg-[#0b1120] border border-cyan-800 rounded-3xl p-6 h-[450px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={chartData}>

              <XAxis
                dataKey="date"
                stroke="#888"
              />

              <YAxis stroke="#888" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="close"
                stroke="#00d9ff"
                strokeWidth={3}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>
      {/* PORTFOLIO */}

      <div className="mt-12">

        <h2 className="text-3xl text-cyan-300 mb-6 font-semibold">
          Portfolio Valuation Engine
        </h2>

        <div className="bg-[#0b1120] border border-green-700 rounded-3xl p-8">

          {portfolioValue && (

            <div>

              <div className="grid grid-cols-2 gap-6 mb-8">

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Cash Balance
                  </div>

                  <div className="text-3xl text-green-400 mt-2">
                    ${portfolioValue.cash}
                  </div>

                </div>

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Total Portfolio Value
                  </div>

                  <div className="text-3xl text-cyan-400 mt-2">
                    ${portfolioValue.total_portfolio_value}
                  </div>

                </div>

              </div>

              <div className="space-y-4">

                {portfolioValue.holdings.map((holding, index) => (

                  <div
                    key={index}
                    className="
                      bg-black/30
                      rounded-2xl
                      p-5
                      grid
                      grid-cols-6
                      gap-4
                    "
                  >

                    <div>
                      <div className="text-zinc-500 text-sm">
                        Ticker
                      </div>

                      <div className="text-cyan-300 text-lg">
                        {holding.ticker}
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-500 text-sm">
                        Shares
                      </div>

                      <div>
                        {holding.shares}
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-500 text-sm">
                        Avg Price
                      </div>

                      <div>
                        ${holding.avg_price}
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-500 text-sm">
                        Current
                      </div>

                      <div>
                        ${holding.current_price}
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-500 text-sm">
                        Value
                      </div>

                      <div>
                        ${holding.holding_value}
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-500 text-sm">
                        P&L
                      </div>

                      <div className={
                        holding.pnl >= 0
                        ? "text-green-400"
                        : "text-red-400"
                      }>

                        ${holding.pnl}

                      </div>
                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>
      {/* BACKTEST ENGINE */}

      <div className="mt-12">

        <h2 className="text-3xl text-cyan-300 mb-6 font-semibold">
          Strategy Backtesting Engine
        </h2>

        <div className="bg-[#0b1120] border border-purple-700 rounded-3xl p-8">

          {backtest && (

            <div>

              <div className="grid grid-cols-3 gap-6 mb-8">

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Strategy
                  </div>

                  <div className="text-cyan-300 mt-2">
                    {backtest.strategy}
                  </div>

                </div>

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Total Profit
                  </div>

                  <div className={
                    backtest.total_profit >= 0
                    ? "text-green-400 text-2xl mt-2"
                    : "text-red-400 text-2xl mt-2"
                  }>

                    ${backtest.total_profit}

                  </div>

                </div>

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Total Trades
                  </div>

                  <div className="text-yellow-400 text-2xl mt-2">
                    {backtest.total_trades}
                  </div>

                </div>

              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">

                {backtest.trades.map((trade, index) => (

                  <div
                    key={index}
                    className="
                      bg-black/30
                      rounded-xl
                      p-4
                      flex
                      justify-between
                    "
                  >

                    <div>
                      {trade.date}
                    </div>

                    <div className={
                      trade.action === "BUY"
                      ? "text-green-400"
                      : "text-red-400"
                    }>

                      {trade.action}

                    </div>

                    <div>
                      ${trade.price}
                    </div>

                    <div className="text-yellow-400">

                      {trade.profit
                        ? `$${trade.profit}`
                        : "-"
                      }

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>
      {/* RISK ENGINE */}

      <div className="mt-12">

        <h2 className="text-3xl text-cyan-300 mb-6 font-semibold">
          Quantitative Risk Engine
        </h2>

        <div className="bg-[#0b1120] border border-red-700 rounded-3xl p-8">

          {riskData && (

            <div>

              <div className="grid grid-cols-5 gap-5">

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Volatility
                  </div>

                  <div className="text-red-400 text-2xl mt-2">
                    {riskData.volatility}%
                  </div>

                </div>

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Sharpe Ratio
                  </div>

                  <div className="text-cyan-400 text-2xl mt-2">
                    {riskData.sharpe_ratio}
                  </div>

                </div>

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Max Drawdown
                  </div>

                  <div className="text-yellow-400 text-2xl mt-2">
                    {riskData.max_drawdown}%
                  </div>

                </div>

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Risk Score
                  </div>

                  <div className="text-pink-400 text-2xl mt-2">
                    {riskData.risk_score}
                  </div>

                </div>

                <div className="bg-black/30 p-5 rounded-2xl">

                  <div className="text-zinc-400">
                    Risk Level
                  </div>

                  <div className="
                    text-red-400
                    text-xl
                    mt-2
                  ">

                    {riskData.risk_level}

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>
      {/* FOOTER */}

      <div className="mt-12 text-zinc-500 text-sm">
        QuantMind AI • Autonomous Financial Intelligence System
      </div>

    </div>

  );
}

export default App;
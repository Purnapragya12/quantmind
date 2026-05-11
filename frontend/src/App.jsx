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

  useEffect(() => {

    fetch(`http://127.0.0.1:8000/stock/${selectedTicker}`)
      .then(res => res.json())
      .then(data => setStock(data));

    fetch(`http://127.0.0.1:8000/analyze/${selectedTicker}`)
      .then(res => res.json())
      .then(data => setAnalysis(data.analysis));
    fetch("http://127.0.0.1:8000/market-scan")
      .then(res => res.json())
      .then(data => setScanner(data));
    fetch(`http://127.0.0.1:8000/history/${selectedTicker}`)
      .then(res => res.json())
      .then(data => setChartData(data));

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
      {/* FOOTER */}

      <div className="mt-12 text-zinc-500 text-sm">
        QuantMind AI • Autonomous Financial Intelligence System
      </div>

    </div>

  );
}

export default App;
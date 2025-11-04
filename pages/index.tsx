import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { OrderBook } from '../components/OrderBook'
import { Trades } from '../components/Trades'
import { useBinanceSocket } from '../hooks/useBinanceSocket'
import { useOrderBookStore } from '../store/orderbookStore'

const DEFAULT_SYMBOL = 'BTCUSDT'

export default function Home() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL)
  const [mock, setMock] = useState(false)
  const { connected } = useBinanceSocket(symbol, { mock })
  const status = useOrderBookStore(s=>s.status)

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-400">Symbol</div>
          <input value={symbol} onChange={(e)=>setSymbol(e.target.value.toUpperCase())} className="px-3 py-2 rounded bg-transparent border border-slate-700" />
          <button onClick={()=>{ setMock(!mock) }} className="ml-3 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm">{mock ? 'Mock: ON' : 'Mock: OFF'}</button>
          <button onClick={()=>location.reload()} className="ml-2 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm">Reload</button>
        </div>
        <div className="text-sm">
          <div className="text-right"><span className={connected ? 'text-green-400' : 'text-amber-400'}>{connected ? 'Connected' : 'Connecting...'}</span></div>
          <div className="text-xs text-slate-400 mt-1">Error: {status.lastError ?? '—'}</div>
        </div>
      </div>

      <OrderBook />

      <Trades />
    </Layout>
  )
}

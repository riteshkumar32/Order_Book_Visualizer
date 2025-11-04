import React from 'react'
import { useOrderBookStore } from '../store/orderbookStore'

export const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const status = useOrderBookStore(s=>s.status)
  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order Book Visualizer</h1>
            <p className="text-sm text-slate-400">Real-time depth & trades · Professional UI</p>
          </div>
          <div className="text-sm text-slate-400 text-right">
            <div>Live · Binance Spot</div>
            <div className="mt-1">WS: <span className={status.wsConnected ? 'text-green-400' : 'text-amber-400'}>{status.wsConnected ? 'Connected' : 'Disconnected'}</span></div>
            <div className="mt-1">Snapshot: <span className='text-slate-400'>{status.snapshotStatus}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  )
}

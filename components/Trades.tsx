import React from 'react'
import { useOrderBookStore } from '../store/orderbookStore'
import { formatPrice, formatAmount } from '../utils/format'
import clsx from 'clsx'

export const Trades: React.FC = () => {
  const trades = useOrderBookStore(s=>s.trades)

  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Recent Trades</h3>
        <div className="text-sm text-slate-400">Last 50</div>
      </div>
      <div className="divide-y divide-slate-800 max-h-[300px] overflow-auto">
        {trades.map(t=>(
          <div key={t.id} className="py-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className={clsx('px-2 py-1 rounded text-xs font-semibold', t.side==='buy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300')}>
                {t.side.toUpperCase()}
              </div>
              <div className={clsx('transition-colors duration-400', 'font-semibold')}>
                {formatPrice(t.price)}
              </div>
            </div>
            <div className="text-slate-400">{formatAmount(t.qty)}</div>
            <div className="text-slate-400 text-xs">{new Date(t.time).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

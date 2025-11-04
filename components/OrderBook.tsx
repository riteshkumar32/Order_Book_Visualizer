import React, { useMemo } from 'react'
import { useOrderBookStore } from '../store/orderbookStore'
import { formatPrice, formatAmount } from '../utils/format'

const MAX_ROWS = 30

export const OrderBook: React.FC = () => {
  const bidsMap = useOrderBookStore(s=>s.bids)
  const asksMap = useOrderBookStore(s=>s.asks)

  const bids = useMemo(() => {
    const arr = Array.from(bidsMap.entries()).map(([p,a])=>({price:p,amount:a}))
    arr.sort((x,y)=>y.price-x.price)
    return arr.slice(0, MAX_ROWS)
  }, [bidsMap])

  const asks = useMemo(() => {
    const arr = Array.from(asksMap.entries()).map(([p,a])=>({price:p,amount:a}))
    arr.sort((x,y)=>x.price-y.price)
    return arr.slice(0, MAX_ROWS)
  }, [asksMap])

  const bidsTotals = useMemo(() => {
    let cum = 0
    return bids.map((r)=>{ cum += r.amount; return {...r, total: cum} })
  }, [bids])

  const asksTotals = useMemo(() => {
    let cum = 0
    return asks.map((r)=>{ cum += r.amount; return {...r, total: cum} })
  }, [asks])

  const maxBidTotal = Math.max(1, ...bidsTotals.map(r=>r.total))
  const maxAskTotal = Math.max(1, ...asksTotals.map(r=>r.total))

  const highestBid = bids.length ? bids[0].price : 0
  const lowestAsk = asks.length ? asks[0].price : 0
  const spread = (lowestAsk && highestBid) ? (lowestAsk - highestBid) : 0

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1 card">
        <h2 className="text-xl font-semibold mb-3">Bids</h2>
        <div className="text-xs text-slate-400 grid grid-cols-3 gap-2 mb-2">
          <div>Price</div><div className="text-right">Amount</div><div className="text-right">Total</div>
        </div>
        <div className="space-y-1 max-h-[520px] overflow-auto">
          {bidsTotals.length === 0 && <div className="text-slate-400 p-4">No bids yet</div>}
          {bidsTotals.map((row)=>(
            <div key={row.price} className="relative">
              <div className="flex items-center text-sm">
                <div className="w-1/3">{formatPrice(row.price)}</div>
                <div className="flex-1 text-right">{formatAmount(row.amount)}</div>
                <div className="w-1/4 text-right pl-2">{formatAmount(row.total)}</div>
              </div>
              <div className="absolute left-0 top-0 h-full opacity-30" style={{width: `${Math.min(100, (row.total / maxBidTotal) * 100)}%`, background:'linear-gradient(90deg, rgba(16,185,129,0.14), rgba(16,185,129,0.06))'}} />
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-1 card flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-slate-400">Spread</div>
          <div className="text-2xl font-semibold">{formatPrice(spread)}</div>
          <div className="text-sm text-slate-400 mt-1">Best Bid: {highestBid ? formatPrice(highestBid) : '--'} · Best Ask: {lowestAsk ? formatPrice(lowestAsk) : '--'}</div>
        </div>
      </div>

      <div className="col-span-1 card">
        <h2 className="text-xl font-semibold mb-3">Asks</h2>
        <div className="text-xs text-slate-400 grid grid-cols-3 gap-2 mb-2">
          <div>Price</div><div className="text-right">Amount</div><div className="text-right">Total</div>
        </div>
        <div className="space-y-1 max-h-[520px] overflow-auto">
          {asksTotals.length === 0 && <div className="text-slate-400 p-4">No asks yet</div>}
          {asksTotals.map((row)=>(
            <div key={row.price} className="relative">
              <div className="flex items-center text-sm">
                <div className="w-1/3 text-red-300">{formatPrice(row.price)}</div>
                <div className="flex-1 text-right">{formatAmount(row.amount)}</div>
                <div className="w-1/4 text-right pl-2">{formatAmount(row.total)}</div>
              </div>
              <div className="absolute right-0 top-0 h-full opacity-30" style={{width: `${Math.min(100, (row.total / maxAskTotal) * 100)}%`, background:'linear-gradient(270deg, rgba(239,68,68,0.14), rgba(239,68,68,0.06))'}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

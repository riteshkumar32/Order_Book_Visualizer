import create from 'zustand'

export type Side = 'bids' | 'asks'

export type Level = {
  price: number
  amount: number
}

type Trade = {
  id: number | string
  price: number
  qty: number
  time: number
  side: 'buy' | 'sell'
}

type Store = {
  bids: Map<number, number>
  asks: Map<number, number>
  trades: Trade[]
  status: {
    wsConnected: boolean
    snapshotStatus: 'idle'|'fetching'|'applied'|'error'
    lastError?: string
  }
  reset: () => void
  applySnapshot: (bids: Array<[string,string]>, asks: Array<[string,string]>) => void
  applyDeltas: (side: Side, deltas: Array<[string,string]>) => void
  pushTrade: (t: Trade) => void
  setStatus: (s: Partial<Store['status']>) => void
}

export const useOrderBookStore = create<Store>((set, get) => ({
  bids: new Map(),
  asks: new Map(),
  trades: [],
  status: { wsConnected: false, snapshotStatus: 'idle' },
  reset: () => set({ bids: new Map(), asks: new Map(), trades: [], status: { wsConnected:false, snapshotStatus:'idle' } }),
  applySnapshot: (bids, asks) => {
    const bm = new Map<number, number>()
    const am = new Map<number, number>()
    for (const [p,a] of bids) bm.set(Number(p), Number(a))
    for (const [p,a] of asks) am.set(Number(p), Number(a))
    set({ bids: bm, asks: am, status: { ...(get().status), snapshotStatus: 'applied' } })
  },
  applyDeltas: (side, deltas) => {
    const map = side === 'bids' ? new Map(get().bids) : new Map(get().asks)
    for (const [pStr, aStr] of deltas) {
      const price = Number(pStr)
      const amount = Number(aStr)
      if (amount === 0) map.delete(price)
      else map.set(price, amount)
    }
    if (side === 'bids') set({ bids: map })
    else set({ asks: map })
  },
  pushTrade: (t) => {
    const list = [t, ...get().trades].slice(0,50)
    set({ trades: list })
  },
  setStatus: (s) => set({ status: { ...(get().status), ...s } })
}))

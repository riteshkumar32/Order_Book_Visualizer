import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useOrderBookStore } from '../store/orderbookStore'

type DepthEvent = {
  e: string
  E: number
  s: string
  U: number
  u: number
  b: Array<[string,string]>
  a: Array<[string,string]>
}

type AggTradeEvent = {
  e: string
  E: number
  s: string
  a: number
  p: string
  q: string
  f: number
  l: number
  T: number
  m: boolean
  M: boolean
}

export function useBinanceSocket(symbol: string, opts:{mock?:boolean} = {}) {
  const [connected, setConnected] = useState(false)

  const applySnapshot = useOrderBookStore(s => s.applySnapshot)
  const applyDeltas = useOrderBookStore(s => s.applyDeltas)
  const pushTrade = useOrderBookStore(s => s.pushTrade)
  const setStatus = useOrderBookStore(s => s.setStatus)

  const wsRef = useRef<WebSocket | null>(null)
  const bufferRef = useRef<any[]>([])
  const snapshotAppliedRef = useRef(false)
  const lastUpdateIdRef = useRef<number | null>(null)
  const retryRef = useRef(0)

  useEffect(() => {
    if (!symbol) return
    const s = symbol.toLowerCase()
    const stream = `${s}@depth@100ms/${s}@aggTrade`
    const url = `wss://stream.binance.com:9443/stream?streams=${stream}`

    let shouldStop = false

    const connect = () => {
      retryRef.current += 1
      try {
        wsRef.current = new WebSocket(url)
      } catch (err) {
        scheduleReconnect()
        return
      }

      wsRef.current.onopen = () => {
        setConnected(true)
        retryRef.current = 0
        snapshotAppliedRef.current = false
        bufferRef.current = []
        lastUpdateIdRef.current = null
        setStatus({ wsConnected: true, snapshotStatus: 'fetching', lastError: undefined })
        fetchSnapshot()
      }

      wsRef.current.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data)
          const payload = msg.data ?? msg
          if (!snapshotAppliedRef.current) bufferRef.current.push(payload)
          else handlePayload(payload)
        } catch (e) {
        }
      }

      wsRef.current.onclose = () => {
        setConnected(false)
        setStatus({ wsConnected: false })
        if (!shouldStop) scheduleReconnect()
      }
      wsRef.current.onerror = () => {
        wsRef.current?.close()
      }
    }

    const scheduleReconnect = () => {
      const delay = Math.min(30000, 500 * Math.pow(1.5, retryRef.current))
      setTimeout(() => {
        if (!shouldStop) connect()
      }, delay)
    }

    const fetchSnapshot = async () => {
      try {
        let res
        if (opts.mock) {
          res = await axios.get(`/api/mock-snapshot`)
        } else {
          res = await axios.get(`/api/depth`, { params: { symbol: symbol.toUpperCase(), limit: 1000 } })
        }
        const snapshot = res.data
        lastUpdateIdRef.current = snapshot.lastUpdateId
        applySnapshot(snapshot.bids, snapshot.asks)
        snapshotAppliedRef.current = true
        setStatus({ snapshotStatus: 'applied', lastError: undefined })

        const buf = bufferRef.current.slice()
        bufferRef.current = []

        for (const ev of buf) {
          if (!ev) continue
          const payload = ev.data ?? ev
          if (payload.e === 'depthUpdate' || payload.e === 'depth') {
            const u = payload.u ?? payload.U ?? 0
            if (u <= (lastUpdateIdRef.current ?? 0)) continue
            if ((payload.U ?? 0) <= ((lastUpdateIdRef.current ?? 0) + 1) && (payload.u ?? 0) >= ((lastUpdateIdRef.current ?? 0) + 1)) {
              handleDepth(payload as DepthEvent)
            }
          } else if (payload.e === 'aggTrade' || payload.e === 'trade') {
            handleAgg(payload as AggTradeEvent)
          }
        }
      } catch (err: any) {
        setStatus({ snapshotStatus: 'error', lastError: String(err?.message ?? err) })
        setTimeout(fetchSnapshot, 1500)
      }
    }

    const handlePayload = (payload: any) => {
      if (!payload) return
      if (payload.e === 'depthUpdate' || payload.e === 'depth') handleDepth(payload as DepthEvent)
      else if (payload.e === 'aggTrade' || payload.e === 'trade') handleAgg(payload as AggTradeEvent)
      else if (payload.stream && payload.data) handlePayload(payload.data)
    }

    const handleDepth = (d: DepthEvent) => {
      if (!snapshotAppliedRef.current) return
      if (d.b && d.b.length) applyDeltas('bids', d.b)
      if (d.a && d.a.length) applyDeltas('asks', d.a)
    }

  const handleAgg = (t: AggTradeEvent) => {
  const side = t.m ? "sell" : "buy"
  const trade = {
    id: t.a ?? `${t.T}-${Math.random()}`,
    price: Number(t.p),
    qty: Number(t.q),
    time: t.T,
    side: side as "buy" | "sell",
  }
  pushTrade(trade)
}

    if (opts.mock) {
      setStatus({ snapshotStatus: 'fetching', lastError: undefined })
      ;(async () => {
        await fetchSnapshot()
        const iv = setInterval(() => {
          const t = {
            id: Date.now(),
            price: Number((30000 + (Math.random()*200 - 100)).toFixed(2)),
            qty: Number((Math.random()*3 + 0.01).toFixed(4)),
            time: Date.now(),
            side: Math.random() > 0.5 ? 'buy' : 'sell'
          }
          pushTrade(t)
        }, 800)
        return () => clearInterval(iv)
      })()
      return () => {}
    }

    connect()

    return () => {
      shouldStop = true
      wsRef.current?.close()
    }
  }, [symbol, opts.mock, applySnapshot, applyDeltas, pushTrade, setStatus])

  return { connected }
}

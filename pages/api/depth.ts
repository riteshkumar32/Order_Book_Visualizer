import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol = 'BTCUSDT', limit = '1000' } = req.query
  try {
    const url = `https://api.binance.com/api/v3/depth?symbol=${String(symbol)}&limit=${String(limit)}`
    const r = await fetch(url)
    const data = await r.json()
    res.setHeader('Cache-Control', 'no-store')
    return res.status(r.status).json(data)
  } catch (err: any) {
    return res.status(500).json({ error: String(err?.message || err) })
  }
}

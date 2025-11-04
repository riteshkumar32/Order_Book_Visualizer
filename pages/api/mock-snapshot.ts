import type { NextApiRequest, NextApiResponse } from 'next'

function makeLevels(center=30000, count=80){
  const bids = []
  const asks = []
  for(let i=0;i<count;i++){
    const pB = center - i*10 - (Math.random()*5)
    const pA = center + i*10 + (Math.random()*5)
    bids.push([pB.toFixed(2), (Math.random()*5+1).toFixed(6)])
    asks.push([pA.toFixed(2), (Math.random()*5+1).toFixed(6)])
  }
  return { lastUpdateId: Date.now(), bids, asks }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = makeLevels(30000, 80)
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json(s)
}

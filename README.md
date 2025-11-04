#  Order Book Visualizer

** Live Demo:** [orderbookvisualizer2025.netlify.app](https://orderbookvisualizer2025.netlify.app/)

A **real-time Order Book Visualizer** built using **Next.js + TypeScript**, streaming **live market data from Binance**.  
It efficiently maintains and displays bid–ask depth, price spread, and recent trades — updating seamlessly without UI lag.

---

##  Quick Start

### **Requirements**
- Node.js ≥ 18  
- npm ≥ 9  

### **Setup**
```bash
git clone <your-repo-url>
cd <project-root>
npm install

###
#  Run Locally
npm run dev
# Visit http://localhost:3000

###
# Production Build
npm run build
npm start


# Features

 Live Binance Feeds

Uses WebSocket streams:

/depth@100ms → Real-time order book deltas

/aggTrade → Aggregated trade stream

 Accurate Order Book Aggregation

Maintains price levels using efficient Map structures (O(1) updates).

Handles add/update/remove deltas dynamically.

 Depth Visualization

Each price row displays a colored depth bar (green for bids, red for asks).

Bar width proportional to total cumulative volume.

 Spread Display

Automatically computes and displays the current Bid–Ask Spread.

 Recent Trades Panel

Displays the 50 most recent trades.

Price flashes green (buy) or red (sell) for new trades.

 Performance Focus

Uses useMemo, useCallback, and React.memo to minimize re-renders.

Only updates changed data points for a smooth real-time experience.

 Mock Mode

Toggle to simulate data when Binance WebSocket is unavailable.

Fetches mock snapshot from /api/mock-snapshot.



📂 Project Structure
├── pages/
│   ├── index.tsx             # Main interface
│   ├── api/
│   │   ├── depth.ts          # REST snapshot proxy
│   │   └── mock-snapshot.ts  # Mock data
├── hooks/
│   └── useBinanceSocket.tsx  # WebSocket handler
├── store/
│   └── orderbookStore.ts     # Zustand store
├── components/
│   ├── OrderBook.tsx         # Live order book UI
│   └── Trades.tsx            # Recent trades list
├── styles/
│   └── globals.css           # Tailwind setup
└── package.json



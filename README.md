Order Book Visualizer

Live demo: https://orderbookvisualizer2025.netlify.app/

A high-performance, real-time order book visualizer built with Next.js + TypeScript.
Streams live market data from Binance (order book deltas + aggregated trades), maintains an efficient in-memory order book, and renders depth bars, spread and recent trades with minimal UI work on each update.

Quick start

Requirements

Node.js ≥ 18

npm ≥ 9

Install

git clone <your-repo-url>
cd <project-root>
npm install


Run (development)

npm run dev
# open http://localhost:3000


Build & Run (production)

npm run build
npm run start
# production server serves .next build


The dev script sets NEXT_TURBOPACK=0 (via cross-env) to use the legacy dev server for stable local development. You can remove that if you prefer Turbopack.

How this satisfies the assignment

Live Binance feeds: client opens the combined streams /<symbol>@depth@100ms and /<symbol>@aggTrade to receive order book deltas and aggregated trades.

Snapshot + buffer sync: follows Binance recommended flow: buffer incoming WS events, GET REST /api/v3/depth snapshot, apply snapshot, then replay buffered deltas that meet update id conditions.

Order book aggregation: price levels are stored in Map<number, number> for O(1) updates; deltas with amount 0 remove a price level.

Order book UI: two-column layout (Bids left, Asks right), Price / Amount / Cumulative Total columns, spread displayed in center.

Depth visualization: each row has a background bar whose width is proportional to the row’s cumulative total relative to the largest total on its side.

Recent trades: shows last 50 trades, new trade flashes color (green = buy, red = sell). Trade direction derived from aggTrade.m (isBuyerMaker) per Binance semantics.

Performance focus: Map-backed updates, useMemo for sorted slices & totals, minimal state updates and component re-rendering, and capped trade list.

Important project files

pages/

index.tsx – main UI (symbol input, mock toggle, status)

api/depth.ts – server-side proxy to Binance REST snapshot (avoids CORS)

api/mock-snapshot.ts – mock snapshot for offline testing

hooks/useBinanceSocket.tsx – WebSocket connection, snapshot sync, buffering, reconnection, mock mode

store/orderbookStore.ts – Zustand store (Maps for bids/asks, trades array, status)

components/OrderBook.tsx – order book rendering + depth bars

components/Trades.tsx – recent trades rendering and flash highlight

styles/globals.css – Tailwind + visual polish

package.json – scripts & dependencies

Design choices & trade-offs

State management: Zustand

Chosen for minimal boilerplate and very fast reads/writes. Global store with direct access to small updater functions keeps components simple and prevents heavy props drilling.

Map for price levels

Map<number, number> provides O(1) updates and avoids recreating giant arrays on every delta. We only derive sorted slices for rendering (top N rows) with useMemo.

Snapshot + buffered WS

Implemented per Binance docs to guarantee correct order-book state while handling out-of-order WS deltas. This increases code complexity but is required for correctness under high-frequency updates.

Server-side snapshot proxy

pages/api/depth proxies REST snapshot requests to Binance to avoid browser CORS restrictions and to make the app deployment-friendly (Vercel / Netlify). This keeps client code simple and reliable.

Mock mode

A Mock toggle that hits /api/mock-snapshot and simulates trades. This is useful for local development or when outbound WebSockets or Binance endpoints are blocked.

Performance vs feature scope

Focused on correctness and UI responsiveness. I intentionally limited the rendered rows (default top 30 per side) and capped trades to 50 to maintain snappy rendering. If more depth visualization is required, we can add virtualization (react-window) while preserving snapshot logic.

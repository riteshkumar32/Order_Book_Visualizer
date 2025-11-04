# Real-Time Order Book Visualizer — Final (test2)

This project implements the assignment requirements: streaming Binance order book deltas and aggregated trades, maintaining an efficient Map-backed order book, rendering depth bars, spread, and recent trades. It includes a server-side snapshot proxy to avoid browser CORS issues and a mock mode for local testing when live API access is blocked.

## Features
- Live Binance WebSocket (depth @100ms + aggTrade) integration.
- Server-side snapshot proxy (`/api/depth`) to fetch REST snapshot from Binance (avoids CORS).
- Mock snapshot endpoint: `/api/mock-snapshot` for offline testing.
- Zustand store for efficient O(1) updates.
- Tailwind CSS UI with depth visualization and recent trades (flash highlight).
- Debug/status UI: shows WS and snapshot status & errors.

## How to run locally (Windows)
1. Ensure Node >= 18 and npm >= 9 installed.
2. In project root run:
```bash
npm install
npm run dev
```
Dev runs with `NEXT_TURBOPACK=0` to use the legacy dev server (stable). If you prefer turbopack remove `cross-env NEXT_TURBOPACK=0` from the `dev` script.
Open http://localhost:3000

## Mock mode
If your environment blocks outbound WebSockets or the Binance API, toggle `Mock: ON` in the UI — this loads a synthetic snapshot via `/api/mock-snapshot` and simulates trades so you can validate UI and behavior.

## Design notes
- Snapshot handling: app buffers WS messages until REST snapshot is fetched and applied, then processes buffered events per Binance docs.
- Map for price levels: O(1) updates and efficient top-slice derivation for rendering.
- Server-side proxy: avoids CORS and is deploy-friendly (works on Vercel).
- Zustand: minimal boilerplate global store, predictable updates and easy memoization in components.

## Deployment
- Recommended: Vercel. Just connect repo and deploy — serverless API routes will proxy snapshots on Vercel and WebSockets work from client.
- Ensure environment allows outbound WebSockets to `wss://stream.binance.com:9443`.
- No secrets required.

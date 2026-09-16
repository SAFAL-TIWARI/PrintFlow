# PrintPulse — Smart QR Print Counter & Queue SaaS

Complete production-ready multi-tenant online printing platform for local printing and Xerox shops.

## Features
- Shop-specific QR kiosk (/shop/:slug)
- Zero customer app or account required
- Per-file print configuration (B&W/Color, single/duplex, paper size, page ranges, finishing)
- Dynamic server-side pricing engine in integer paise
- Windows Shop Print Agent with auto-discovery of Windows printers
- Dual payment: Verified Razorpay online checkout + Cash at counter
- Automated temporary file purging after order completion
- Visual Template Customizer with live simulated kiosk preview
- Printable A4 Counter QR Poster
- Platform Super Admin dashboard for shop approvals and audit logs

## Quick Start

### Backend:
cd Backend
npm install
npm start
(Runs on http://localhost:5000 with auto-seeded demo shops and in-memory MongoDB fallback)

### Frontend:
cd Frontend
npm install
npm run dev
(Runs on http://localhost:5173 with proxy to backend)

### Windows Print Agent:
cd Backend/agent
node agent.js
(Enter 6-digit pairing code from Shop Admin > Printers)


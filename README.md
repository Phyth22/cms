# Screen 02 — System Health CMS (NOC Bridge)

## How to run (quick)
1. Create a React app (Vite or CRA).
2. Copy `SystemHealthNocBridge.tsx` and `SystemHealthNocBridge.css` into your project.
3. Render `<SystemHealthNocBridge />` from App.tsx.

Notes:
- This is UI scaffolding with mocked data.
- Wire live data via SSE/WebSocket endpoints (Kafka→Redis→SSE pattern).
- HITL/HIC actions should POST to an approvals API and write immutable audit events.

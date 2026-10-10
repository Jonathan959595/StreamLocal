const baseUrl = process.env.NEXORA_URL || "http://localhost:8000";
const send = (path, payload) => {
    // Telemetry is deliberately detached from the request path and has no retry queue.
    fetch(`${baseUrl}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(1000) }).catch(() => {});
};
const log = (level, event, details = {}) => send("/api/v1/telemetry/logs", { timestamp: new Date().toISOString(), app_id: "netflix-local-clone", level, event, details });
const alert = (severity, event, details = {}) => send("/api/v1/telemetry/alerts", { timestamp: new Date().toISOString(), app_id: "netflix-local-clone", severity, event, details });
const register = () => send("/api/v1/applications/register", { app_id: "netflix-local-clone", name: "Netflix Local Micro-Architecture", environment: process.env.NODE_ENV || "development", health_endpoint: "/api/health", services: ["api-gateway", "auth-service", "catalog-service", "payment-simulator", "streaming-engine", "mongo-db", "local-media-storage"], dependencies: [{ from: "api-gateway", to: "auth-service", type: "validates_jwt" }, { from: "api-gateway", to: "catalog-service", type: "fetches_metadata" }, { from: "api-gateway", to: "payment-simulator", type: "processes_billing" }, { from: "api-gateway", to: "streaming-engine", type: "requests_chunks" }, { from: "catalog-service", to: "mongo-db", type: "queries" }, { from: "payment-simulator", to: "mongo-db", type: "updates_subscription" }, { from: "streaming-engine", to: "local-media-storage", type: "reads" }] });
module.exports = { send, log, alert, register };

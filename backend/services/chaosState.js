const state = { dbDelay: false, storageFault: false, paymentTimeout: false, authDropRate: 0 };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const enabled = () => process.env.ENABLE_CHAOS === "true" && process.env.NODE_ENV !== "production";
module.exports = { state, wait, enabled };

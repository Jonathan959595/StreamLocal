/* Isolated local API verification. Requires MongoDB on localhost. */
const assert = require("assert");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const User = require("../models/User");

const uri = "mongodb://127.0.0.1:27017/streamlocal_e2e";
const base = "http://127.0.0.1:5001/api";
const request = async (path, options = {}) => fetch(`${base}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
const json = async (response) => ({ response, body: await response.json() });

async function run() {
  await mongoose.connect(uri); await mongoose.connection.dropDatabase();
  await Movie.create({ contentId: "interstellar", title: "Interstellar", description: "Test", contentType: "movie", tags: ["Sci-Fi", "Action"], videoPath: "video-01.mp4" });
  await mongoose.disconnect();
  const server = spawn("node", ["server.js"], { cwd: __dirname + "/..", env: { ...process.env, MONGO_URI: uri, PORT: "5001" }, windowsHide: true });
  let output = ""; server.stdout.on("data", (data) => { output += data; }); server.stderr.on("data", (data) => { output += data; });
  try {
    for (let i = 0; i < 30 && !output.includes("running on port"); i += 1) await new Promise((resolve) => setTimeout(resolve, 100));
    assert(output.includes("running on port"), output);
    let result = await json(await request("/auth/register", { method: "POST", body: JSON.stringify({ email: "e2e@example.test", password: "password1" }) })); assert.equal(result.response.status, 201);
    result = await json(await request("/auth/login", { method: "POST", body: JSON.stringify({ email: "e2e@example.test", password: "password1" }) })); assert.equal(result.response.status, 200); const token = result.body.token; const auth = { Authorization: `Bearer ${token}` };
    assert.equal((await request("/stream/interstellar", { headers: { Range: "bytes=0-10" } })).status, 401);
    assert.equal((await request("/stream/interstellar", { headers: { ...auth, Range: "bytes=0-10" } })).status, 403);
    const started = Date.now(); result = await json(await request("/billing/checkout", { method: "POST", headers: auth, body: JSON.stringify({ planId: "standard", cardNumber: "4242424242424242", cvv: "123" }) })); assert.equal(result.response.status, 200); assert(Date.now() - started >= 1900, "checkout delay was shorter than 1.9 seconds"); assert.equal(result.body.subscription.status, "ACTIVE");
    result = await json(await request("/auth/me", { headers: auth })); assert.equal(result.body.subscription.status, "ACTIVE"); assert(new Date(result.body.subscription.expiresAt) > new Date(Date.now() + 29 * 86400000)); const profileId = result.body.profiles[0].profileId;
    const session = await request("/stream/session/interstellar", { method: "POST", headers: auth }); assert.equal(session.status, 204); const cookie = session.headers.get("set-cookie"); assert(cookie && cookie.includes("HttpOnly"));
    const ranged = await request("/stream/interstellar", { headers: { Range: "bytes=0-10", Cookie: cookie.split(";")[0] } }); assert.equal(ranged.status, 206); assert.equal(ranged.headers.get("accept-ranges"), "bytes"); assert.equal(ranged.headers.get("content-length"), "11"); assert(ranged.headers.get("content-range").startsWith("bytes 0-10/"));
    result = await json(await request("/stream/heartbeat", { method: "POST", headers: { ...auth, "x-profile-id": profileId }, body: JSON.stringify({ videoId: "interstellar", timestampSeconds: 42.5 }) })); assert.equal(result.response.status, 200); result = await json(await request("/stream/progress/interstellar", { headers: { ...auth, "x-profile-id": profileId } })); assert.equal(result.body.timestampSeconds, 42.5);
    assert.equal((await request("/profiles/create", { method: "POST", headers: auth, body: JSON.stringify({ name: "Third" }) })).status, 201); assert.equal((await request("/profiles/create", { method: "POST", headers: auth, body: JSON.stringify({ name: "Fourth" }) })).status, 201); assert.equal((await request("/profiles/create", { method: "POST", headers: auth, body: JSON.stringify({ name: "Fifth" }) })).status, 400);
    await request("/auth/register", { method: "POST", body: JSON.stringify({ email: "other@example.test", password: "password1" }) }); result = await json(await request("/auth/login", { method: "POST", body: JSON.stringify({ email: "other@example.test", password: "password1" }) })); const otherAuth = { Authorization: `Bearer ${result.body.token}`, "x-profile-id": profileId }; assert.equal((await request("/stream/heartbeat", { method: "POST", headers: otherAuth, body: JSON.stringify({ videoId: "interstellar", timestampSeconds: 2 }) })).status, 403);
    assert.equal((await request("/content/feed")).status, 200); result = await json(await request("/content/search?q=Sci-Fi")); assert.equal(result.response.status, 200); assert(result.body.length >= 1);
    console.log("E2E PASS: auth, subscription gate, checkout delay, cookie stream range, heartbeat/progress, profiles/ownership, catalog feed/search");
  } finally { server.kill(); await new Promise((resolve) => server.once("exit", resolve)); await mongoose.connect(uri); await mongoose.connection.dropDatabase(); await mongoose.disconnect(); }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });

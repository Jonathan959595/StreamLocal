const User = require("../models/User");
const Movie = require("../models/Movie");
const profileFor = (user, profileId) => user?.profiles.find((profile) => profile.profileId === profileId);
const heartbeat = async (req, res) => {
    const { videoId, timestampSeconds } = req.body || {}; const profileId = req.get("x-profile-id");
    if (typeof videoId !== "string" || !videoId.trim() || !Number.isFinite(timestampSeconds) || timestampSeconds < 0) return res.status(400).json({ message: "A valid videoId and timestampSeconds are required" });
    if (!profileId) return res.status(400).json({ message: "x-profile-id is required" });
    try { const [user, movie] = await Promise.all([User.findById(req.user), Movie.findOne({ contentId: videoId })]); const profile = profileFor(user, profileId); if (!profile) return res.status(403).json({ message: "Profile does not belong to this account" }); if (!movie) return res.status(404).json({ message: "Video not found" }); const entry = profile.watchHistory.find((history) => history.contentId === videoId); if (entry) { entry.timestampSeconds = timestampSeconds; entry.updatedAt = new Date(); } else profile.watchHistory.push({ contentId: videoId, timestampSeconds }); await user.save(); return res.json({ contentId: videoId, timestampSeconds }); } catch { return res.status(500).json({ message: "Unable to save watch state" }); }
};
const getWatchState = async (req, res) => { const profileId = req.get("x-profile-id"); if (!profileId) return res.status(400).json({ message: "x-profile-id is required" }); try { const user = await User.findById(req.user); const profile = profileFor(user, profileId); if (!profile) return res.status(403).json({ message: "Profile does not belong to this account" }); const entry = profile.watchHistory.find((history) => history.contentId === req.params.contentId); return res.json({ timestampSeconds: entry?.timestampSeconds || 0 }); } catch { return res.status(500).json({ message: "Unable to retrieve watch state" }); } };
module.exports = { heartbeat, getWatchState };

import { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { streamService, API_BASE_URL } from '../services/api';
import ContentRow from '../components/ContentRow';
import { content, findContent, isKidsSafe } from '../data/content';
import EmptyState from '../components/EmptyState';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const totalSeconds = Math.floor(seconds); const hours = Math.floor(totalSeconds / 3600); const minutes = Math.floor((totalSeconds % 3600) / 60); const remainingSeconds = totalSeconds % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}` : `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default function PlayerPage() {
  const item = findContent(useParams().id); const videoRef = useRef(null); const playerRef = useRef(null); const hideTimer = useRef(null);
  const contentId = useParams().id; const session = useSelector((state) => state.auth); const navigate = useNavigate();
  const [streamReady, setStreamReady] = useState(false); const [accessError, setAccessError] = useState(null);
  const [unavailable, setUnavailable] = useState(true); const [loading, setLoading] = useState(true); const [isPlaying, setIsPlaying] = useState(false); const [currentTime, setCurrentTime] = useState(0); const [duration, setDuration] = useState(0); const [volume, setVolume] = useState(1); const [muted, setMuted] = useState(false); const [isFullscreen, setIsFullscreen] = useState(false); const [showControls, setShowControls] = useState(true); const [settingsOpen, setSettingsOpen] = useState(false); const [ccOpen, setCcOpen] = useState(false);
  const apiUrl = API_BASE_URL; const menusOpen = settingsOpen || ccOpen;

  const recommendations = useMemo(() => {
    if (!item) return [];
    const activeProfile = session?.user?.profiles?.find((p) => p.profileId === session?.selectedProfileId);
    const isKids = Boolean(activeProfile?.isKids);
    const candidateList = content.filter((candidate) => candidate.id !== item.id);
    const eligible = isKids ? candidateList.filter(isKidsSafe) : candidateList;
    const sameGenre = eligible.filter((candidate) => candidate.genre === item.genre);
    const otherGenres = eligible.filter((candidate) => candidate.genre !== item.genre);
    return [...sameGenre, ...otherGenres];
  }, [item, session?.selectedProfileId, session?.user?.profiles]);

  const initializeStream = async () => { setLoading(true); setAccessError(null); setStreamReady(false); setUnavailable(true); if (!session?.token) { setLoading(false); setAccessError(401); return; } try { await streamService.createSession(contentId); setStreamReady(true); setUnavailable(false); } catch (error) { setLoading(false); setAccessError(error.response?.status || 'other'); } };
  const revealControls = () => { setShowControls(true); if (hideTimer.current) clearTimeout(hideTimer.current); };
  const togglePlayback = async () => { const video = videoRef.current; if (!video) return; if (video.paused) await video.play().catch(() => {}); else video.pause(); revealControls(); };
  const seek = (nextTime) => { const video = videoRef.current; if (!video || !Number.isFinite(video.duration)) return; video.currentTime = Math.max(0, Math.min(nextTime, video.duration)); setCurrentTime(video.currentTime); revealControls(); };
  const restart = () => { seek(0); videoRef.current?.play().catch(() => {}); };
  const toggleMute = () => { const video = videoRef.current; if (!video) return; video.muted = !video.muted; setMuted(video.muted); revealControls(); };
  const setPlayerVolume = (nextVolume) => { const video = videoRef.current; if (!video) return; const safeVolume = Number(nextVolume); video.volume = safeVolume; video.muted = safeVolume === 0; setVolume(safeVolume); setMuted(video.muted); revealControls(); };
  const toggleFullscreen = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await playerRef.current?.requestFullscreen(); } catch { /* Fullscreen may be unavailable in an embedded browser. */ } revealControls(); };
  useEffect(() => { const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === playerRef.current); document.addEventListener('fullscreenchange', syncFullscreen); return () => document.removeEventListener('fullscreenchange', syncFullscreen); }, []);
  useEffect(() => { initializeStream(); }, [contentId, session?.token]);
  useEffect(() => { if (!isPlaying || menusOpen) return undefined; hideTimer.current = setTimeout(() => setShowControls(false), 2600); return () => clearTimeout(hideTimer.current); }, [isPlaying, menusOpen, showControls]);
  useEffect(() => { if (!streamReady || !session?.selectedProfileId) return undefined; streamService.progress(contentId).then(({ data }) => { if (data.timestampSeconds > 3 && videoRef.current) videoRef.current.currentTime = data.timestampSeconds; }).catch(() => {}); const timer = setInterval(() => { const seconds = videoRef.current?.currentTime; if (Number.isFinite(seconds) && seconds > 0) streamService.heartbeat(contentId, seconds).catch(() => {}); }, 30000); const save = () => { const seconds = videoRef.current?.currentTime; if (Number.isFinite(seconds) && seconds > 0) streamService.heartbeat(contentId, seconds).catch(() => {}); }; window.addEventListener('pagehide', save); return () => { clearInterval(timer); window.removeEventListener('pagehide', save); save(); }; }, [streamReady, contentId, session?.selectedProfileId]);
  useEffect(() => { const handleShortcut = (event) => { const target = event.target; if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable) return; if (event.code === 'Space') { event.preventDefault(); togglePlayback(); } if (event.key === 'ArrowLeft') { event.preventDefault(); seek((videoRef.current?.currentTime || 0) - 10); } if (event.key === 'ArrowRight') { event.preventDefault(); seek((videoRef.current?.currentTime || 0) + 10); } if (event.key.toLowerCase() === 'm') toggleMute(); if (event.key.toLowerCase() === 'f') toggleFullscreen(); }; document.addEventListener('keydown', handleShortcut); return () => document.removeEventListener('keydown', handleShortcut); });
  if (!item) return <main className="page"><EmptyState title="Video unavailable" message="This title is not available in the local catalog." /></main>;
  if (accessError) {
    const copy = accessError === 401 ? ['Sign in to watch', 'Please log in to continue watching.', 'Log In', '/login'] : accessError === 403 ? ['Choose your plan', 'Your subscription is required to watch this title.', 'View Plans', '/subscription'] : accessError === 404 ? ['This title is currently unavailable.', '', 'Back', `/details/${item.id}`] : ['Something went wrong while loading this video.', '', 'Retry', null];
    return <main className="player-page"><Link to={`/details/${item.id}`} className="player-back">‹ Back to details</Link><section className="player-shell"><div className="player-dialog" role="dialog"><h2>{copy[0]}</h2>{copy[1] && <p>{copy[1]}</p>}<div><button className="button button-main" onClick={() => copy[3] ? navigate(copy[3]) : initializeStream()}>{copy[2]}</button><button className="button button-quiet" onClick={() => navigate(`/details/${item.id}`)}>Cancel</button></div></div></section></main>;
  }
  return (
    <main className="player-page">
      <Link to={`/details/${item.id}`} className="player-back">‹ Back to details</Link>
      <section ref={playerRef} className={`player-shell ${showControls || !isPlaying || menusOpen ? 'player-controls-visible' : ''}`} aria-label={`${item.title} player`} onMouseMove={revealControls} onTouchStart={revealControls}>
        {unavailable ? (
          <div className="player-placeholder"><p>Unable to play this video.</p><small>This title is not available for local streaming.</small></div>
        ) : (
          <>
            <video ref={videoRef} className="stream-video" playsInline onClick={togglePlayback} onLoadStart={() => setLoading(true)} onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)} onPlaying={() => { setIsPlaying(true); setLoading(false); }} onPause={() => setIsPlaying(false)} onEnded={() => { setIsPlaying(false); revealControls(); }} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => { setDuration(event.currentTarget.duration); setVolume(event.currentTarget.volume); setMuted(event.currentTarget.muted); }} onError={() => { setLoading(false); setUnavailable(true); }}>
              <source src={`${apiUrl}/stream/${item.id}`} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
            {loading && <div className="player-loading" role="status"><span /> Loading video</div>}
            <div className="player-controls" onMouseEnter={revealControls} onMouseMove={revealControls} onClick={(event) => event.stopPropagation()}>
              <div className="player-control-row">
                <button onClick={togglePlayback} aria-label={isPlaying ? 'Pause video' : 'Play video'}>{isPlaying ? '❚❚' : '▶'}</button>
                <button onClick={restart} aria-label="Play from beginning">↺</button>
                <button onClick={() => seek(currentTime - 10)} aria-label="Seek backward 10 seconds">−10</button>
                <button onClick={() => seek(currentTime + 10)} aria-label="Seek forward 10 seconds">+10</button>
                <span className="player-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
                <div className="player-spacer" />
                <div className="player-volume">
                  <button onClick={toggleMute} aria-label={muted ? 'Unmute video' : 'Mute video'}>{muted || volume === 0 ? '🔇' : volume < .5 ? '🔉' : '🔊'}</button>
                  <input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} onChange={(event) => setPlayerVolume(event.target.value)} />
                </div>
                <button aria-label="Closed captions" className={ccOpen ? 'active' : ''} onClick={() => { setCcOpen(!ccOpen); setSettingsOpen(false); }}>CC</button>
                <button aria-label="Player settings" className={settingsOpen ? 'active' : ''} onClick={() => { setSettingsOpen(!settingsOpen); setCcOpen(false); }}>⚙</button>
                <button onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>{isFullscreen ? '⤢' : '⛶'}</button>
              </div>
              <input aria-label="Video progress" className="player-timeline" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event) => seek(Number(event.target.value))} />
              {settingsOpen && <div className="player-menu" role="menu"><strong>Quality</strong><span>Single local MP4 source</span><strong>Language</strong><span>Default audio only</span></div>}
              {ccOpen && <div className="player-menu" role="menu"><strong>Subtitles</strong><span>No subtitle tracks available</span></div>}
            </div>
          </>
        )}
      </section>
      <div className="player-title">
        <p className="eyebrow">{item.type} · {item.year}</p>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
      </div>
      {recommendations.length > 0 && (
        <ContentRow title="Recommended for You" items={recommendations} />
      )}
    </main>
  );
}

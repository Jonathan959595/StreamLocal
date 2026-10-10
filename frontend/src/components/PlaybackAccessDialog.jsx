import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const hasActiveSubscription = (session) =>
  session?.user?.subscription?.status === 'ACTIVE' &&
  new Date(session.user.subscription.expiresAt) > new Date();

export default function PlaybackAccessDialog({ session, item, isUnavailable = false, onClose }) {
  const signedIn = Boolean(session?.token);
  const active = hasActiveSubscription(session);
  const unavailable = isUnavailable || item?.unavailable;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (active && !unavailable) return null;

  let title = 'Sign in to watch';
  let message = item?.title
    ? `Sign in or create an account to start watching “${item.title}”.`
    : 'Sign in or create an account to continue watching.';
  let actions = (
    <>
      <Link className="button button-main" to="/login" onClick={onClose}>
        Sign In
      </Link>
      <Link className="button button-muted" to="/register" onClick={onClose}>
        Create Account
      </Link>
    </>
  );

  if (unavailable) {
    title = 'Title Unavailable';
    message = item?.title
      ? `“${item.title}” is currently not available for streaming in this session.`
      : 'This title is currently not available for streaming.';
    actions = (
      <button className="button button-main" onClick={onClose}>
        Back to Catalog
      </button>
    );
  } else if (signedIn && !active) {
    title = 'Choose your plan';
    message = item?.title
      ? `An active subscription is required to watch “${item.title}”. Choose a plan to unlock streaming.`
      : 'An active subscription is required to watch this title.';
    actions = (
      <Link className="button button-main" to="/subscription" onClick={onClose}>
        View Plans
      </Link>
    );
  }

  return (
    <div
      className="playback-gate"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="playback-gate-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="playback-gate-title"
      >
        <button className="content-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="eyebrow">StreamLocal</p>
        <h2 id="playback-gate-title">{title}</h2>
        <p>{message}</p>
        <div className="button-row">
          {actions}
          <button className="button button-quiet" onClick={onClose}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}

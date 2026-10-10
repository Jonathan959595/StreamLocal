import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMyList } from '../redux/store';
import PlaybackAccessDialog, { hasActiveSubscription } from './PlaybackAccessDialog';

export default function ContentInfoModal({ item, onClose }) {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.auth);
  const inList = useSelector((state) => state.myList.includes(item?.id));
  const [showGate, setShowGate] = useState(false);
  const canPlay = hasActiveSubscription(session) && !item?.unavailable;
  const closeButton = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  if (!item) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="content-modal-overlay"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="content-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`content-modal-title-${item.id}`}
            initial={{ opacity: 0, y: 28, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: .98 }}
            transition={{ duration: .2 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button ref={closeButton} className="content-modal-close" onClick={onClose} aria-label={`Close information about ${item.title}`}>×</button>
            <div className="content-modal-art" style={{ backgroundImage: `linear-gradient(0deg, #10151c 0%, rgba(16,21,28,.12) 75%), url(${item.image})` }} />
            <div className="content-modal-copy">
              <p className="eyebrow">{item.type}</p>
              <h2 id={`content-modal-title-${item.id}`}>{item.title}</h2>
              <p className="metadata">
                <b>{item.rating} ★</b>
                <span>{item.year}</span>
                <span>{item.duration}</span>
                <span>{item.genre}</span>
              </p>
              <p className="content-modal-description">{item.description}</p>
              <div className="button-row">
                {canPlay ? (
                  <Link className="button button-main" to={`/watch/${item.id}`} onClick={onClose} aria-label={`Play ${item.title}`}>▶ Play</Link>
                ) : (
                  <button className="button button-main" onClick={() => setShowGate(true)} aria-label={`Play ${item.title}`}>▶ Play</button>
                )}
                <button className="button button-muted" onClick={() => dispatch(toggleMyList(item.id))}>
                  {inList ? '✓ In My List' : '+ My List'}
                </button>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </AnimatePresence>
      {showGate && <PlaybackAccessDialog session={session} item={item} isUnavailable={Boolean(item?.unavailable)} onClose={() => setShowGate(false)} />}
    </>
  );
}

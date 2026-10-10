import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMyList } from '../redux/store';
import ContentInfoModal from './ContentInfoModal';
import PlaybackAccessDialog, { hasActiveSubscription } from './PlaybackAccessDialog';

export default function ContentCard({ item, progress }) {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.auth);
  const inList = useSelector((state) => state.myList.includes(item.id));
  const [showInfo, setShowInfo] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const canPlay = hasActiveSubscription(session) && !item?.unavailable;

  return (
    <>
      <motion.article className="content-card" whileHover={{ scale: 1.045, y: -5 }} transition={{ duration: .18 }}>
        <img src={item.image} alt={`${item.title} poster`} loading="lazy" />
        <div className="card-shade" />
        <div className="card-actions">
          {canPlay ? (
            <Link to={`/watch/${item.id}`} aria-label={`Play ${item.title}`}>▶</Link>
          ) : (
            <button onClick={() => setShowGate(true)} aria-label={`Play ${item.title}`}>▶</button>
          )}
          <button onClick={() => dispatch(toggleMyList(item.id))} aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}>
            {inList ? '✓' : '+'}
          </button>
          <button onClick={() => setShowInfo(true)} aria-label={`More information about ${item.title}`}>i</button>
        </div>
        <div className="card-copy">
          <h3>{item.title}</h3>
          <p><b>{item.rating} ★</b> · {item.year} · {item.genre}</p>
          {progress != null && (
            <>
              <div className="progress"><i style={{ width: `${progress}%` }} /></div>
              <small>{100 - progress}% remaining</small>
            </>
          )}
        </div>
      </motion.article>
      {showInfo && <ContentInfoModal item={item} onClose={() => setShowInfo(false)} />}
      {showGate && <PlaybackAccessDialog session={session} item={item} isUnavailable={Boolean(item?.unavailable)} onClose={() => setShowGate(false)} />}
    </>
  );
}

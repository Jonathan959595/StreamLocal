import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMyList } from '../redux/store';
import { useState } from 'react';
import ContentInfoModal from './ContentInfoModal';
import PlaybackAccessDialog, { hasActiveSubscription } from './PlaybackAccessDialog';

export default function Hero({ item }) {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.auth);
  const inList = useSelector((state) => state.myList.includes(item?.id));
  const [showInfo, setShowInfo] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const canPlay = hasActiveSubscription(session) && !item?.unavailable;

  if (!item) return null;

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, #080808 3%, rgba(8,8,8,.88) 30%, rgba(8,8,8,.18) 75%, #080808 100%), linear-gradient(0deg, #080808 0%, transparent 35%), url(${item.image})`
        }}
      >
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <p className="eyebrow">Featured on StreamLocal</p>
          <h1>{item.title}</h1>
          <div className="metadata">
            <b>{item.rating} ★</b>
            <span>{item.year}</span>
            <span>{item.duration}</span>
            <span className="quality">HD</span>
          </div>
          <p className="hero-description">{item.description}</p>
          <div className="button-row">
            {canPlay ? (
              <Link className="button button-main" to={`/watch/${item.id}`}>▶ Play</Link>
            ) : (
              <button className="button button-main" onClick={() => setShowGate(true)}>▶ Play</button>
            )}
            <button className="button button-muted" onClick={() => dispatch(toggleMyList(item.id))}>
              {inList ? '✓ In My List' : '+ My List'}
            </button>
            <button className="button icon-button" type="button" onClick={() => setShowInfo(true)} aria-label={`More information about ${item.title}`}>
              ⓘ
            </button>
          </div>
        </motion.div>
      </section>
      {showInfo && <ContentInfoModal item={item} onClose={() => setShowInfo(false)} />}
      {showGate && <PlaybackAccessDialog session={session} item={item} isUnavailable={Boolean(item?.unavailable)} onClose={() => setShowGate(false)} />}
    </>
  );
}

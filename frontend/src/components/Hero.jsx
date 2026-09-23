import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMyList } from '../redux/store';

export default function Hero({ item }) {
  const dispatch = useDispatch(); const inList = useSelector((state) => state.myList.includes(item.id));
  return <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, #07090d 3%, rgba(7,9,13,.84) 30%, rgba(7,9,13,.14) 75%, #07090d 100%), linear-gradient(0deg, #07090d 0%, transparent 35%), url(${item.image})` }}>
    <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
      <p className="eyebrow">Featured on StreamLocal</p><h1>{item.title}</h1>
      <div className="metadata"><b>{item.rating} ★</b><span>{item.year}</span><span>{item.duration}</span><span className="quality">HD</span></div>
      <p className="hero-description">{item.description}</p>
      <div className="button-row"><Link className="button button-main" to={`/watch/${item.id}`}>▶ Play</Link><button className="button button-muted" onClick={() => dispatch(toggleMyList(item.id))}>{inList ? '✓ In My List' : '+ My List'}</button><Link className="button icon-button" to={`/details/${item.id}`} aria-label="More information">ⓘ</Link></div>
    </motion.div>
  </section>;
}

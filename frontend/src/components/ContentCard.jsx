import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMyList } from '../redux/store';

export default function ContentCard({ item, progress }) {
  const dispatch = useDispatch(); const inList = useSelector((state) => state.myList.includes(item.id));
  return <motion.article className="content-card" whileHover={{ scale: 1.045, y: -5 }} transition={{ duration: .18 }}>
    <img src={item.image} alt={`${item.title} poster`} loading="lazy" /><div className="card-shade" />
    <div className="card-actions"><Link to={`/watch/${item.id}`} aria-label={`Play ${item.title}`}>▶</Link><button onClick={() => dispatch(toggleMyList(item.id))} aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}>{inList ? '✓' : '+'}</button><Link to={`/details/${item.id}`} aria-label={`Details for ${item.title}`}>i</Link></div>
    <div className="card-copy"><h3>{item.title}</h3><p><b>{item.rating} ★</b> · {item.year} · {item.genre}</p>{progress != null && <><div className="progress"><i style={{ width: `${progress}%` }} /></div><small>{100 - progress}% remaining</small></>}</div>
  </motion.article>;
}

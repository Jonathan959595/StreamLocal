import { useRef } from 'react';
import ContentCard from './ContentCard';
export default function ContentRow({ title, items, continueWatching = false }) {
  const row = useRef(null); const scroll = (amount) => row.current?.scrollBy({ left: amount, behavior: 'smooth' });
  if (!items.length) return null;
  return <section className="content-row"><div className="row-heading"><h2>{title}</h2><button onClick={() => scroll(500)}>View all ›</button></div><div className="row-shell"><button className="row-arrow row-prev" onClick={() => scroll(-500)} aria-label={`Previous ${title}`}>‹</button><div ref={row} className="card-track">{items.map((item, index) => <ContentCard key={item.id} item={item} progress={continueWatching ? [67, 41, 79, 28][index % 4] : undefined} />)}</div><button className="row-arrow row-next" onClick={() => scroll(500)} aria-label={`Next ${title}`}>›</button></div></section>;
}

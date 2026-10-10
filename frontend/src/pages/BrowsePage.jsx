import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ContentRow from '../components/ContentRow';
import EmptyState from '../components/EmptyState';
import { content, isKidsSafe } from '../data/content';

export default function BrowsePage({ type }) {
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('featured');

  const session = useSelector((state) => state.auth);
  const activeProfile = session?.user?.profiles?.find(
    (p) => p.profileId === session.selectedProfileId
  );
  const isKids = Boolean(activeProfile?.isKids);

  const baseItems = useMemo(() => {
    const list = content.filter((item) => item.type === type);
    return isKids ? list.filter(isKidsSafe) : list;
  }, [type, isKids]);

  const genres = ['All', ...new Set(baseItems.map((item) => item.genre))];

  const filteredItems = useMemo(() => {
    return baseItems
      .filter((item) => genre === 'All' || item.genre === genre)
      .sort((a, b) => {
        if (sort === 'newest') return b.year - a.year;
        if (sort === 'rating') return Number(b.rating) - Number(a.rating);
        return 0;
      });
  }, [baseItems, genre, sort]);

  const heading = type === 'Series' ? 'Series' : 'Movies';

  // Multiple rows configuration for "All" view based purely on genuine catalog items
  const movieRows = useMemo(() => {
    if (type !== 'Movie') return [];
    return [
      {
        title: 'Trending Movies',
        items: baseItems.slice(0, 6),
      },
      {
        title: 'Sci-Fi & Cosmic Adventures',
        items: baseItems.filter((m) => m.genre === 'Sci-Fi'),
      },
      {
        title: 'Action & Thrills',
        items: baseItems.filter((m) => m.genre === 'Action' || m.genre === 'Adventure'),
      },
      {
        title: 'Dramatic & Compelling Stories',
        items: baseItems.filter((m) => m.genre === 'Drama' || m.genre === 'Thriller'),
      },
      {
        title: 'Critically Acclaimed (Top Rated)',
        items: [...baseItems].sort((a, b) => Number(b.rating) - Number(a.rating)),
      },
    ].filter((r) => r.items.length > 0);
  }, [type, baseItems]);

  const seriesRows = useMemo(() => {
    if (type !== 'Series') return [];
    return [
      {
        title: 'Trending Series',
        items: baseItems.slice(0, 5),
      },
      {
        title: 'Sci-Fi & Fantasy Worlds',
        items: baseItems.filter((s) => s.genre === 'Sci-Fi' || s.genre === 'Fantasy'),
      },
      {
        title: 'Mysteries, Thrillers & Drama',
        items: baseItems.filter((s) => s.genre === 'Mystery' || s.genre === 'Drama' || s.genre === 'Thriller'),
      },
      {
        title: 'Top Rated Series',
        items: [...baseItems].sort((a, b) => Number(b.rating) - Number(a.rating)),
      },
    ].filter((r) => r.items.length > 0);
  }, [type, baseItems]);

  const isMultiRowView = genre === 'All' && sort === 'featured';

  return (
    <main className="page">
      <p className="eyebrow">Discover your next favorite</p>
      <h1>{heading}</h1>

      <div className="browse-controls">
        <div className="filter-pills" aria-label="Filter by genre">
          {genres.map((entry) => (
            <button
              className={genre === entry ? 'selected' : ''}
              onClick={() => setGenre(entry)}
              key={entry}
            >
              {entry}
            </button>
          ))}
        </div>
        <label>
          Sort
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      {isMultiRowView ? (
        type === 'Movie' ? (
          movieRows.map((row) => (
            <ContentRow key={row.title} title={row.title} items={row.items} />
          ))
        ) : (
          seriesRows.map((row) => (
            <ContentRow key={row.title} title={row.title} items={row.items} />
          ))
        )
      ) : filteredItems.length > 0 ? (
        <ContentRow title={`${genre === 'All' ? 'All' : genre} ${heading}`} items={filteredItems} />
      ) : (
        <EmptyState
          title="Nothing here yet"
          message="Try another genre filter or sort option to explore the catalog."
        />
      )}
    </main>
  );
}

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ContentCard from '../components/ContentCard';
import EmptyState from '../components/EmptyState';
import { contentService } from '../services/api';
import { isKidsSafe } from '../data/content';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const session = useSelector((state) => state.auth);
  const activeProfile = session?.user?.profiles?.find(
    (p) => p.profileId === session.selectedProfileId
  );
  const isKids = Boolean(activeProfile?.isKids);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) return setResults([]);
      setLoading(true);
      const data = await contentService.search(query);
      setResults(data);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const clear = () => {
    setQuery('');
    setResults([]);
  };

  const displayResults = isKids ? results.filter(isKidsSafe) : results;

  return (
    <main className="page">
      <p className="eyebrow">Find something great</p>
      <h1>Search</h1>
      <div className="search-wrap">
        <label className="sr-only" htmlFor="catalog-search">
          Search the catalog
        </label>
        <input
          id="catalog-search"
          className="search-field"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Titles, genres, movies, series…"
        />
        {query && (
          <button className="clear-search" onClick={clear} aria-label="Clear search">
            ×
          </button>
        )}
      </div>
      {loading && <p className="loading-copy">Searching StreamLocal…</p>}
      {!query && (
        <EmptyState
          title="What are you in the mood for?"
          message="Search titles, genres, films, or series from your local catalog."
        />
      )}
      {query && !loading && !displayResults.length ? (
        <EmptyState
          title="No matches found"
          message="Try a different title, genre, or keyword."
        />
      ) : query && (
        <>
          <p className="result-count">
            {displayResults.length} result{displayResults.length === 1 ? '' : 's'} for “{query}”
          </p>
          <div className="content-grid">
            {displayResults.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

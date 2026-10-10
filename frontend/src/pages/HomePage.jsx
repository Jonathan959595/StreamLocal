import { useSelector } from 'react-redux';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import { findContent, rows, isKidsSafe } from '../data/content';

export default function HomePage() {
  const session = useSelector((state) => state.auth);
  const activeProfile = session?.user?.profiles?.find(
    (p) => p.profileId === session.selectedProfileId
  );
  const isKids = Boolean(activeProfile?.isKids);

  const heroItem = isKids
    ? findContent('the-mandalorian') || findContent('avatar')
    : findContent('wednesday') || findContent('interstellar');

  const rawResume = [
    findContent('dune'),
    findContent('oppenheimer'),
    findContent('stranger-things'),
    findContent('the-mandalorian'),
  ].filter(Boolean);

  const resume = isKids ? rawResume.filter(isKidsSafe) : rawResume;
  const trending = isKids ? rows.trending.filter(isKidsSafe) : rows.trending;
  const popularMovies = isKids ? rows.popularMovies.filter(isKidsSafe) : rows.popularMovies;
  const popularSeries = isKids ? rows.popularSeries.filter(isKidsSafe) : rows.popularSeries;
  const sciFi = isKids ? rows.sciFi.filter(isKidsSafe) : rows.sciFi;

  return (
    <>
      <Hero item={heroItem} />
      <main>
        {resume.length > 0 && (
          <ContentRow title="Continue Watching" items={resume} continueWatching />
        )}
        <ContentRow title="Trending Now" items={trending} />
        <ContentRow title="Popular Movies" items={popularMovies} seeAllTo="/movies" />
        <ContentRow title="Popular Series" items={popularSeries} seeAllTo="/series" />
        <ContentRow title="Sci-Fi Stories" items={sciFi} />
      </main>
    </>
  );
}

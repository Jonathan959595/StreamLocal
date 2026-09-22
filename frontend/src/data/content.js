const movie = (id, title, year, genre, duration, rating, description) => ({ id, title, year, genre, duration, rating, description, type: 'Movie', image: `/posters/movies/${id}.jpg` });
const series = (id, title, year, genre, duration, rating, description) => ({ id, title, year, genre, duration, rating, description, type: 'Series', image: `/posters/series/${id}.jpg` });

export const content = [
  movie('interstellar', 'Interstellar', 2014, 'Sci-Fi', '2h 49m', '8.7', 'A team travels through a wormhole in space in an attempt to ensure humanity’s survival.'),
  movie('inception', 'Inception', 2010, 'Sci-Fi', '2h 28m', '8.8', 'A skilled thief enters dreams to steal secrets—and is offered one impossible final job.'),
  movie('dune', 'Dune', 2021, 'Sci-Fi', '2h 35m', '8.0', 'A young nobleman must protect the universe’s most valuable resource.'),
  movie('oppenheimer', 'Oppenheimer', 2023, 'Drama', '3h', '8.3', 'The story of the scientist whose work changed the world forever.'),
  movie('tenet', 'Tenet', 2020, 'Action', '2h 30m', '7.3', 'A secret agent bends time to prevent a global catastrophe.'),
  movie('martian', 'The Martian', 2015, 'Sci-Fi', '2h 24m', '8.0', 'An astronaut stranded on Mars fights to make it home.'),
  movie('avatar', 'Avatar', 2009, 'Adventure', '2h 42m', '7.9', 'A marine discovers a new world and a new purpose on Pandora.'),
  movie('joker', 'Joker', 2019, 'Thriller', '2h 2m', '8.4', 'A troubled comedian’s descent changes a city forever.'),
  movie('gladiator', 'Gladiator', 2000, 'Action', '2h 35m', '8.5', 'A betrayed general fights for freedom in the Roman arena.'),
  movie('matrix', 'The Matrix', 1999, 'Sci-Fi', '2h 16m', '8.7', 'A hacker discovers the truth behind the world he knows.'),
  movie('john-wick', 'John Wick', 2014, 'Action', '1h 41m', '7.4', 'A retired assassin returns to a violent underworld.'),
  movie('arrival', 'Arrival', 2016, 'Sci-Fi', '1h 56m', '7.9', 'A linguist races to understand visitors from another world.'),
  series('wednesday', 'Wednesday', 2022, 'Mystery', 'Season 1', '8.1', 'A sharp-witted outcast investigates a supernatural mystery at Nevermore Academy.'),
  series('stranger-things', 'Stranger Things', 2016, 'Sci-Fi', '4 Seasons', '8.7', 'A group of friends uncover strange forces in their small town.'),
  series('breaking-bad', 'Breaking Bad', 2008, 'Drama', '5 Seasons', '9.5', 'A teacher’s life changes after a devastating diagnosis.'),
  series('dark', 'Dark', 2017, 'Mystery', '3 Seasons', '8.7', 'A missing child exposes a time-bending conspiracy.'),
  series('game-of-thrones', 'Game of Thrones', 2011, 'Fantasy', '8 Seasons', '9.2', 'Noble houses battle for control of the Seven Kingdoms.'),
  series('money-heist', 'Money Heist', 2017, 'Thriller', '5 Parts', '8.2', 'A mastermind assembles a crew for an audacious heist.'),
  series('loki', 'Loki', 2021, 'Fantasy', '2 Seasons', '8.2', 'The god of mischief steps outside the timeline.'),
  series('the-mandalorian', 'The Mandalorian', 2019, 'Sci-Fi', '3 Seasons', '8.6', 'A lone bounty hunter crosses the outer reaches of the galaxy.'),
];
export const findContent = (id) => content.find((item) => item.id === id);
export const rows = {
  trending: content.slice(0, 8),
  popularMovies: content.filter((item) => item.type === 'Movie').slice(6),
  popularSeries: content.filter((item) => item.type === 'Series'),
  sciFi: content.filter((item) => item.genre === 'Sci-Fi'),
};

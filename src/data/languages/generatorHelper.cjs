const fs = require('fs');
const path = require('path');

function generateMovies(langName, langCode, flag, prefix, items) {
  return items.map((item, idx) => ({
    id: `${prefix}-${idx + 1}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    imdbId: item.imdbId || `tt${Math.floor(1000000 + Math.random() * 8999999)}`,
    title: item.title,
    originalTitle: item.nativeTitle || item.title,
    year: item.year || 2020,
    type: item.type || (item.genres && item.genres.includes('Animation') ? 'animated' : 'movie'),
    language: langName,
    languageCode: langCode,
    flag: flag,
    rating: Math.min(20, Math.round((item.imdbRating || 8.0) * 2.1)),
    imdbRating: item.imdbRating || 8.2,
    metascore: Math.min(100, Math.round((item.imdbRating || 8.0) * 10.5)),
    pgRating: item.pgRating || 'PG-13',
    duration: item.duration || '2h 15m',
    genres: item.genres || ['Drama', 'Thriller'],
    storyline: item.storyline || `Acclaimed ${langName} cinematic masterpiece celebrated by international critics and audiences worldwide.`,
    poster: item.poster || 'https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop: item.backdrop || 'https://image.tmdb.org/t/p/original/hiKmpZMGZsrkA3cdBA8a0HXxTFI.jpg',
    director: item.director || 'Renowned Filmmaker',
    stars: item.stars || ['Lead Actor', 'Co-Star'],
    boxOffice: item.boxOffice || '$120M',
    trailerYoutubeId: item.trailer || 'PLl99DlL6b4',
    isWatched: idx < 12,
    isWatchlist: idx >= 12 && idx < 28,
    userRating: idx < 12 ? Math.min(20, Math.round((item.imdbRating || 8.0) * 2.1)) : undefined,
    dateAdded: `2024-0${(idx % 9) + 1}-10`,
    streamingProviders: [
      { name: 'Netflix', type: 'Stream', url: 'https://netflix.com' },
      { name: 'Prime Video', type: 'Stream', url: 'https://amazon.com' },
      { name: 'Apple TV', type: 'Rent', price: '$3.99', url: 'https://tv.apple.com' }
    ]
  }));
}

module.exports = { generateMovies };

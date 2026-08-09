import { Franchise } from '../types/movie';

export const globalFranchisesList: Franchise[] = [
  {
    id: 'marvel-mcu-saga',
    title: 'Marvel Cinematic Universe (Phases 1–6 Infinity & Multiverse)',
    industry: 'mcu-dc',
    universeTag: 'Marvel Studios',
    description: 'The historic billion-dollar saga spanning Iron Man, Captain America, Spider-Man, Deadpool & Wolverine, and Avengers: Doomsday.',
    backdrop: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    movieIds: [
      'mcu-iron-man-1',
      'mcu-avengers-2012',
      'mcu-captain-america-winter-soldier',
      'mcu-avengers-infinity-war',
      'mcu-avengers-endgame',
      'mcu-spider-man-no-way-home',
      'mcu-deadpool-wolverine',
      'mcu-avengers-doomsday'
    ]
  },
  {
    id: 'dark-knight-saga',
    title: 'The Dark Knight Trilogy (Christopher Nolan)',
    industry: 'mcu-dc',
    universeTag: 'DC Universe',
    description: 'Christopher Nolan’s genre-defining Batman trilogy featuring Christian Bale and Heath Ledger’s legendary Oscar-winning Joker.',
    backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    movieIds: ['dc-the-dark-knight']
  },
  {
    id: 'dc-elseworlds',
    title: 'DC Elseworlds & The Batman Chronicles',
    industry: 'mcu-dc',
    universeTag: 'DC Elseworlds',
    description: 'Dark, prestige noir detective tales exploring Gotham City beyond the main continuity.',
    backdrop: 'https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYz9G660E.jpg',
    movieIds: ['dc-the-batman-2022']
  },
  {
    id: 'dcu-chapter-1',
    title: 'DC Universe Chapter 1: Gods and Monsters (James Gunn)',
    industry: 'mcu-dc',
    universeTag: 'DC Studios',
    description: 'The bold new dawn of DC Studios led by Superman (2025), Supergirl, and Batman: The Brave and the Bold.',
    backdrop: 'https://image.tmdb.org/t/p/original/jsoz1HlxA92606Y11Um6uqOdYMu.jpg',
    movieIds: ['dc-superman-2025']
  },
  {
    id: 'nolan-mind-benders',
    title: 'Christopher Nolan Cinematic Universe',
    industry: 'hollywood',
    universeTag: 'Hollywood Icons',
    description: 'Mind-bending cinematic epics spanning Inception, Interstellar, and the Academy Award-winning Oppenheimer.',
    backdrop: 'https://image.tmdb.org/t/p/original/rLb2cw69QbHgFDW00ohY298YQkh.jpg',
    movieIds: ['hollywood-inception', 'hollywood-interstellar', 'hollywood-oppenheimer', 'dc-the-dark-knight']
  },
  {
    id: 'godfather-saga',
    title: 'The Godfather Trilogy (Francis Ford Coppola)',
    industry: 'hollywood',
    universeTag: 'Cinema History',
    description: 'The monumental chronicle of the Corleone crime dynasty, hailed as one of the greatest artistic achievements in film history.',
    backdrop: 'https://image.tmdb.org/t/p/original/tmU7whstcrGRRa3E2djGstbtZq5.jpg',
    movieIds: ['hollywood-godfather']
  },
  {
    id: 'rajamouli-epics',
    title: 'S.S. Rajamouli Cinematic Epics (Tollywood)',
    industry: 'tollywood',
    universeTag: 'Tollywood Spectacle',
    description: 'Groundbreaking Indian cinematic spectacles spanning the global phenomenon RRR and the record-smashing Baahubali franchise.',
    backdrop: 'https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2389.jpg',
    movieIds: ['tollywood-rrr', 'tollywood-baahubali-2']
  },
  {
    id: 'apu-trilogy',
    title: 'The Apu Trilogy (Satyajit Ray)',
    industry: 'bengali',
    universeTag: 'Bengali Heritage',
    description: 'Satyajit Ray’s Cannes Golden Palm humanist masterworks chronicling Apu’s journey from rural Bengal to Kolkata.',
    backdrop: 'https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    movieIds: ['bengali-pather-panchali']
  },
  {
    id: 'feluda-byomkesh',
    title: 'Bengali Sleuth & Psychological Mystery Chronicles',
    industry: 'bengali',
    universeTag: 'Bengali Thrillers',
    description: 'Legendary detective sagas featuring Satyajit Ray’s Feluda (Sonar Kella) and Srijit Mukherji’s poetic serial killer masterpiece Baishe Srabon.',
    backdrop: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    movieIds: ['bengali-sonar-kella', 'bengali-baishe-srabon']
  },
  {
    id: 'ghibli-universe',
    title: 'Studio Ghibli Hayao Miyazaki Masterpieces',
    industry: 'international',
    universeTag: 'Japanese Animation',
    description: 'Enchanting animated masterworks of wonder, nature, and human spirit by legendary director Hayao Miyazaki.',
    backdrop: 'https://image.tmdb.org/t/p/original/bXNvzjYE9rvEnvJZ7qZ0bK7Nf3f.jpg',
    movieIds: ['intl-spirited-away']
  },
  {
    id: 'korean-crime-thrillers',
    title: 'Korean Cinema Masterworks (Bong Joon-ho)',
    industry: 'international',
    universeTag: 'Korean Cinema',
    description: 'History-making 4-time Academy Award-winning thriller Parasite and South Korea’s finest suspense masterworks.',
    backdrop: 'https://image.tmdb.org/t/p/original/hiKmpZMGZsrkA3cdBA8a0HXxTFI.jpg',
    movieIds: ['intl-parasite']
  }
];

export const initialFranchises: Franchise[] = globalFranchisesList;

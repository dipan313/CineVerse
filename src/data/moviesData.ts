import { Franchise } from '../types/movie';

export const globalFranchisesList: Franchise[] = [
  {
    id: 'marvel-mcu-saga',
    title: 'Marvel Cinematic Universe (Infinity & Multiverse Saga)',
    description: 'The monumental superhero franchise spanning Iron Man, Captain America, Thor, Black Panther, Spider-Man, and the epic Avengers saga.',
    backdrop: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    movieIds: [
      'mcu-avengers-endgame',
      'mcu-avengers-infinity-war',
      'mcu-iron-man',
      'mcu-avengers-2012',
      'mcu-captain-america-winter-soldier',
      'mcu-spider-man-no-way-home',
      'mcu-thor-ragnarok',
      'mcu-black-panther',
      'mcu-guardians-of-the-galaxy',
      'mcu-deadpool-wolverine'
    ]
  },
  {
    id: 'godfather-saga',
    title: 'The Godfather Trilogy',
    description: 'Francis Ford Coppola’s epic chronicle of the Corleone crime family dynasty.',
    backdrop: 'https://image.tmdb.org/t/p/original/tmU7whstcrGRRa3E2djGstbtZq5.jpg',
    movieIds: ['en-godfather', 'en-godfather-2']
  },
  {
    id: 'dark-knight-saga',
    title: 'The Dark Knight Trilogy',
    description: 'Christopher Nolan’s genre-defining Batman trilogy starring Christian Bale and Heath Ledger.',
    backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    movieIds: ['en-dark-knight']
  },
  {
    id: 'nolan-mind-benders',
    title: 'Christopher Nolan Cinematic Universe',
    description: 'Mind-bending cinematic epics spanning Inception, Interstellar, Oppenheimer, and The Dark Knight.',
    backdrop: 'https://image.tmdb.org/t/p/original/rLb2cw69QbHgFDW00ohY298YQkh.jpg',
    movieIds: ['en-dark-knight', 'en-inception', 'en-interstellar', 'en-oppenheimer']
  },
  {
    id: 'apu-trilogy',
    title: 'The Apu Trilogy (Satyajit Ray)',
    description: 'Satyajit Ray’s world-renowned humanist masterpiece chronicling Apu’s journey from rural Bengal to Kolkata.',
    backdrop: 'https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    movieIds: ['bn-pather-panchali', 'bn-aparajito', 'bn-apur-sansar']
  },
  {
    id: 'feluda-byomkesh',
    title: 'Bengali Detective & Mystery Chronicles',
    description: 'Legendary sleuth adventures featuring Satyajit Ray’s Feluda, Topshe, Jatayu, and modern psychological thrillers.',
    backdrop: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    movieIds: ['bn-sonar-kella', 'bn-joy-baba-felunath', 'bn-baishe-srabon', 'bn-chotushkone', 'bn-guptodhoner-sandhane']
  },
  {
    id: 'rajamouli-epics',
    title: 'S.S. Rajamouli Cinematic Epics',
    description: 'Groundbreaking Indian cinematic spectacles spanning RRR and the Baahubali saga.',
    backdrop: 'https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2389.jpg',
    movieIds: ['so-rrr']
  },
  {
    id: 'ghibli-universe',
    title: 'Studio Ghibli Hayao Miyazaki Collection',
    description: 'Legendary animated masterworks of wonder, magic, and human heart by Hayao Miyazaki.',
    backdrop: 'https://image.tmdb.org/t/p/original/bXNvzjYE9rvEnvJZ7qZ0bK7Nf3f.jpg',
    movieIds: ['ja-spirited-away']
  },
  {
    id: 'korean-crime-thrillers',
    title: 'Korean Cinema Masterworks (Bong Joon-ho & Park Chan-wook)',
    description: 'Critically acclaimed gripping Korean thrillers with shocking twists and visual mastery.',
    backdrop: 'https://image.tmdb.org/t/p/original/hiKmpZMGZsrkA3cdBA8a0HXxTFI.jpg',
    movieIds: ['kr-parasite', 'kr-oldboy']
  }
];

export const initialFranchises: Franchise[] = globalFranchisesList;

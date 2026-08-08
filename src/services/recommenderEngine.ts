import { Movie } from '../types/movie';

export interface RecommendedMovie {
  movie: Movie;
  matchScore: number; // e.g. 98 -> 98% Match
  reasons: string[];
  primaryMatchingGenre: string;
}

export class RecommenderEngine {
  /**
   * Generates intelligent recommendations based on the genres, director, and style of the last watched movie
   */
  public getRecommendations(lastWatched: Movie, allMovies: Movie[], limit: number = 8): RecommendedMovie[] {
    if (!lastWatched || !allMovies.length) return [];

    const lastGenres = new Set((lastWatched.genres || []).map(g => g.toLowerCase()));
    const lastDirector = (lastWatched.director || '').toLowerCase();
    const lastLang = (lastWatched.language || '').toLowerCase();

    const candidates = allMovies.filter(m => m.id !== lastWatched.id);

    const scoredList: RecommendedMovie[] = candidates.map(candidate => {
      let score = 50; // baseline compatibility score
      const reasons: string[] = [];
      let primaryMatchingGenre = lastWatched.genres[0] || 'Drama';

      // 1. Genre Overlap Analysis (Weight: up to +35%)
      const candidateGenres = candidate.genres || [];
      const matchingGenres: string[] = [];

      candidateGenres.forEach(g => {
        if (lastGenres.has(g.toLowerCase())) {
          matchingGenres.push(g);
        }
      });

      if (matchingGenres.length > 0) {
        primaryMatchingGenre = matchingGenres[0];
        score += Math.min(35, matchingGenres.length * 15);
        reasons.push(`Shared genres: ${matchingGenres.join(', ')}`);
      }

      // 2. Director Affinity Match (Weight: up to +15%)
      if (lastDirector && candidate.director && candidate.director.toLowerCase().includes(lastDirector)) {
        score += 15;
        reasons.push(`Directed by ${candidate.director}`);
      }

      // 3. Cultural & Language Synergy (Weight: up to +10%)
      if (lastLang && candidate.language && candidate.language.toLowerCase() === lastLang) {
        score += 10;
        reasons.push(`Shared cinematic tradition (${candidate.language})`);
      }

      // 4. Critical Acclaim Booster (Weight: up to +10%)
      if (candidate.imdbRating && candidate.imdbRating >= 8.0) {
        score += Math.round((candidate.imdbRating - 7.5) * 4);
      }

      // Clamp between 68% and 99%
      const finalMatchScore = Math.min(99, Math.max(68, Math.round(score)));

      return {
        movie: candidate,
        matchScore: finalMatchScore,
        reasons,
        primaryMatchingGenre
      };
    });

    // Sort descending by highest match score
    scoredList.sort((a, b) => b.matchScore - a.matchScore);

    return scoredList.slice(0, limit);
  }
}

export const recommenderEngine = new RecommenderEngine();

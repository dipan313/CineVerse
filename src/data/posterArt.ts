/**
 * High-Resolution Dedicated Poster Artwork Generator
 * Generates distinct, authentic, stylized cinematic theatrical poster artwork
 * for each global movie with exact native typography, directors, and visuals.
 */

export function createCinematicPoster(
  title: string,
  nativeTitle: string,
  year: number,
  director: string,
  stars: string[],
  genre: string,
  primaryColor: string,
  accentColor: string,
  tagline: string,
  iconSvg: string
): string {
  const starsList = stars.slice(0, 2).join(' • ');

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
    <defs>
      <linearGradient id="bg-${title.replace(/[^a-z0-9]/gi, '')}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${primaryColor}" />
        <stop offset="35%" stop-color="#0a0c14" />
        <stop offset="100%" stop-color="#05060a" />
      </linearGradient>
      <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.8" />
        <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.2" />
      </linearGradient>
      <radialGradient id="spot" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.9"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="600" height="900" fill="url(#bg-${title.replace(/[^a-z0-9]/gi, '')})" />
    <circle cx="300" cy="320" r="280" fill="url(#spot)" />

    <!-- Top Festival Banner / Laurel -->
    <rect x="0" y="0" width="600" height="6" fill="${accentColor}" />
    
    <g transform="translate(300, 70)" text-anchor="middle">
      <text font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="900" letter-spacing="4" fill="${accentColor}" text-transform="uppercase">
        ★ OFFICIAL CINEMA MASTERPIECE ★
      </text>
      <text y="22" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" letter-spacing="2" fill="#94a3b8">
        A FILM BY ${director.toUpperCase()}
      </text>
    </g>

    <!-- Visual Centerpiece Artwork -->
    <g transform="translate(300, 310)" text-anchor="middle">
      <!-- Decorative Backdrop Geometry -->
      <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.4" />
      <circle cx="0" cy="0" r="110" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.2" />
      
      <!-- Center Icon / Silhouette Graphics -->
      ${iconSvg}
    </g>

    <!-- Tagline -->
    <text x="300" y="520" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#cbd5e1" filter="url(#shadow)">
      "${tagline}"
    </text>

    <!-- Native Script Title -->
    <text x="300" y="600" text-anchor="middle" font-family="'Segoe UI', 'Noto Sans Bengali', 'Noto Sans Devanagari', 'Noto Sans KR', 'Noto Sans JP', sans-serif" font-weight="900" font-size="34" fill="${accentColor}" filter="url(#shadow)">
      ${nativeTitle}
    </text>

    <!-- International English Title -->
    <text x="300" y="660" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="38" letter-spacing="2" fill="#ffffff" filter="url(#shadow)">
      ${title.toUpperCase()}
    </text>

    <!-- Star Cast -->
    <text x="300" y="710" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="14" letter-spacing="1.5" fill="#94a3b8">
      STARRING: ${starsList.toUpperCase()}
    </text>

    <!-- Lower Meta Banner -->
    <g transform="translate(50, 780)">
      <rect width="500" height="60" rx="16" fill="#000000" fill-opacity="0.6" stroke="#ffffff" stroke-opacity="0.1" />
      <text x="30" y="36" font-family="monospace" font-size="16" font-weight="bold" fill="#f59e0b">★ ${year}</text>
      <text x="140" y="36" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0">${genre.toUpperCase()}</text>
      <text x="470" y="36" text-anchor="end" font-family="monospace" font-size="14" font-weight="bold" fill="${accentColor}">CRITICS' CHOICE</text>
    </g>

    <!-- Bottom Cinema Watermark -->
    <text x="300" y="875" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="3" fill="#475569">
      CINEVERSE INTERNATIONAL ARCHIVE
    </text>
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

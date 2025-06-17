import badges from '../src/badges.mjs';

// NOTE: All badges must follow this format (with a trailing space):
// [![Badge Name](https://img.shields.io/badge/...)](#)
// or [![Badge Name](https://custom-icon-badges.demolab.com/badge/...)](#)

describe('All badges display correctly', () => {
  for (const [category, badgesInCategory] of Object.entries(badges)) {
    describe(`Category: ${category}`, () => {
      for (const [badgeKey, badgeValue] of Object.entries(badgesInCategory)) {
        test(`${badgeKey} badge matches expected format`, () => {
          expect(badgeValue).toBeDefined();

          // Full regex for a typical badge
          const badgeFormatRegex = /^\[!\[[^\]]+\]\((https:\/\/(img\.shields\.io|custom-icon-badges\.demolab\.com)\/badge\/[^\)]+)\)\]\(#\)\s?$/;

          // Verifies that the badge matches the regex
          expect(badgeValue).toMatch(badgeFormatRegex);
        });
      }
    });
  }
});

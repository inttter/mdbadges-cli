import badges from '../src/badges.mjs';

// NOTE: All badges are in the right format of:
// [![Badge Name](Badge Link)](#)
// Example: [![App Store](https://img.shields.io/badge/App_Store-0D96F6?logo=app-store&logoColor=white)](#)

describe('All badges display correctly', () => {
  for (const [category, badgesInCategory] of Object.entries(badges)) {
    describe(`category: ${category}`, () => {
      for (const [badgeKey, badgeValue] of Object.entries(badgesInCategory)) {
        test(`${badgeKey} badge displays correctly`, () => {
          // Checks if the badge is defined
          expect(badgeValue).toBeDefined();

          // Extract the badge name from badge value
          const badgeNameMatch = badgeValue.match(/\[!\[([^\]]+)\]/);
          expect(badgeNameMatch).toBeDefined();

          const badgeName = badgeNameMatch[1];

          // Extract the badge URL from the badge's value
          const badgeUrlMatch = badgeValue.match(/\((https:\/\/[^\)]+)\)/);
          expect(badgeUrlMatch).toBeDefined();

          const badgeUrl = badgeUrlMatch[1];

          // Check if the URL contains '/badge/'
          expect(badgeUrl.includes('/badge/')).toBe(true);

          // Escape special characters in the badge name
          const escapedBadgeName = badgeName.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
          
          // Escape special characters in the badge URL
          const escapedBadgeUrl = badgeUrl.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');

          const expectedRegex = new RegExp(
            `\\[\\!\\[${escapedBadgeName}\\]\\(${escapedBadgeUrl}\\)\\]\\(#\\)`
          );

          const cleanedBadgeValue = badgeValue.replace(/\)\)$/, ')');

          // Verifies that a badge matches the correct format of the regex
          expect(cleanedBadgeValue).toMatch(expectedRegex);
        });
      }
    });
  }
});
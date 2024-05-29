const badges = require('../src/badges');

// Test to validate that all badges are in the right format of:
// [![Badge Name](Badge Link)](#)]

describe('All badges display correctly', () => {
  for (const [category, badgesInCategory] of Object.entries(badges)) {
    describe(`category: ${category}`, () => {
      for (const [badgeKey, badgeValue] of Object.entries(badgesInCategory)) {
        test(`${badgeKey} badge displays correctly`, () => {
          // checks if badge is defined
          expect(badgeValue).toBeDefined();

          // extracts badge name from badge value
          const badgeNameMatch = badgeValue.match(/\[!\[([^\]]+)\]/);
          expect(badgeNameMatch).toBeDefined();

          const badgeName = badgeNameMatch[1];

          // wxtracts badge URL from badge value
          const badgeUrlMatch = badgeValue.match(/\((https:\/\/[^\)]+)\)/);
          expect(badgeUrlMatch).toBeDefined();

          const badgeUrl = badgeUrlMatch[1];

          // escape special characters in the badge name
          const escapedBadgeName = badgeName.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
          
          // escapes special characters in the badge URL
          const escapedBadgeUrl = badgeUrl.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');

          const expectedRegex = new RegExp(
            `\\[\\!\\[${escapedBadgeName}\\]\\(${escapedBadgeUrl}\\)\\]\\(#\\)`
          );

          const cleanedBadgeValue = badgeValue.replace(/\)\)$/, ')');

          // verifies that the badge matches the correct format
          expect(cleanedBadgeValue).toMatch(expectedRegex);
        });
      }
    });
  }
});
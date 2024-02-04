const badges = require('../src/badges');

// NOTE: This only tests the Google Play Store as a badge

// tl;dr: if this test passes, all badges should be
// formatted correctly (hopefully)

test('Badge Displays Correctly', () => {
  const playStoreBadge = badges['app-store']['play-store'];

  expect(playStoreBadge).toBeDefined();

  const expectedRegex = new RegExp(
    '\\[\\!\\[Google Play Store\\]\\(https:\\/\\/img.shields.io\\/badge\\/Google_Play-414141\\?logo=google-play&logoColor=white\\)\\]\\(#\\)'
  );

  expect(playStoreBadge).toMatch(expectedRegex);
});
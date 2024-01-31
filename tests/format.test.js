const {
    formatCategoryName,
    searchCategory,
    formatBadgeName,
    escapeHtml,
  } = require('../src/utils');
  
    describe('formatCategoryName', () => {
      test('This formats category names that have dashes between the spaces', () => {
        const result = formatCategoryName('app-store');
        expect(result).toBe('App Store');
      });
    });

    describe('formatBadgeName', () => {
        test('This formats badge names that have dashes between the spaces', () => {
          const result = formatBadgeName('discord');
          expect(result).toBe('Discord');
        });
      });
  
    describe('SearchCategory', () => {
      test('This converts categories to lowercase by adding hyphens', () => {
        const result = searchCategory('App Store');
        expect(result).toBe('app-store');
      });
    });
  
    describe('escapeHtml', () => {
        test('This escapes special characters so that syntax is displayed correctly', () => {
          const unsafeHtmlString = '<a href=""><img alt="![Discord" src="https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white"></a>';
          const expectedHtmlString = '&lt;a href=&quot;&quot;>&lt;img alt=&quot;![Discord&quot; src=&quot;https://img.shields.io/badge/Discord-%235865F2.svg?&amp;logo=discord&amp;logoColor=white&quot;>&lt;/a>';
          const result = escapeHtml(unsafeHtmlString);
          expect(result).toBe(expectedHtmlString);
          });
        });
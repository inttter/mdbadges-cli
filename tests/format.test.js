const {
    formatCategoryName,
    searchCategory,
    formatBadgeName,
    escapeHtml,
  } = require('../src/utils');
  
    describe('formatCategoryName', () => {
      test('should format category names that have dashes between the spaces', () => {
        const result = formatCategoryName('app-store');
        expect(result).toBe('App Store');
      });
    });

    describe('formatBadgeName', () => {
        test('should format badge names that have dashes between the spaces', () => {
          const result = formatBadgeName('discord');
          expect(result).toBe('Discord');
        });
      });
  
    describe('SearchCategory', () => {
      test('should convert categories to lowercase by adding hyphens', () => {
        const result = searchCategory('App Store');
        expect(result).toBe('app-store');
      });
    });
  
    describe('escapeHtml', () => {
      test('should escape special characters in HTML string', () => {
          const unsafeHtmlString = '<a href="https://discord.com">\n  <img src="https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white" alt="Discord">\n</a>';
          const expectedHtmlString = '&lt;a href=&quot;https://discord.com&quot;>\n  &lt;img src=&quot;https://img.shields.io/badge/Discord-%235865F2.svg?&amp;logo=discord&amp;logoColor=white&quot; alt=&quot;Discord&quot;>\n&lt;/a>';
          const result = escapeHtml(unsafeHtmlString);
          expect(result).toBe(expectedHtmlString);
      });
  });
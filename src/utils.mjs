import fs from 'fs';

function formatCategoryName(category) {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  
  function searchCategory(category) {
    return category.toLowerCase().replace(/\s+/g, '-');
  }
  
  function formatBadgeName(badgeName) {
    const formattedBadgeName = badgeName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  
    return formattedBadgeName;
  }
  
  const escapeHtml = (unsafe) => {
    if (typeof unsafe === 'undefined') {
      return '';
    }
  
    return unsafe.replace(/[&<"']/g, (match) => {
      switch (match) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#039;";
        default:
          return match;
      }
    });
  };

  export function loadPackageInfo() {
    const jsonString = fs.readFileSync('./package.json', 'utf8');
    return JSON.parse(jsonString);
  }
  
  export { formatCategoryName, searchCategory, formatBadgeName, escapeHtml };
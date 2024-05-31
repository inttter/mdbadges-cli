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

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export { formatCategoryName, searchCategory, formatBadgeName, escapeHtml, isValidURL };
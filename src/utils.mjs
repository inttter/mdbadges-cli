import Fuse from 'fuse.js';
import { cancel, isCancel } from '@clack/prompts';

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
  return badgeName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

async function checkCancellation(input, cancelMessage = 'Exiting because `CTRL+C` was pressed.') {
  if (isCancel(input)) {
    cancel(cancelMessage);
    process.exit(0);
  }
}

function getFuseInstance(badges) {
  const formattedBadges = Object.keys(badges).flatMap(category =>
    Object.keys(badges[category]).map(badgeName => ({
      category,
      badgeName,
      formattedCategory: formatCategoryName(category),
      formattedBadge: formatBadgeName(badgeName),
      badgeCode: badges[category][badgeName],
    }))
  );

  return new Fuse(formattedBadges, {
    keys: ['badgeName'],
    threshold: 0.3,
  });
}

function searchBadges(fuse, keyword) {
  return fuse.search(keyword);
}

export { formatCategoryName, searchCategory, formatBadgeName, escapeHtml, isValidURL, checkCancellation, getFuseInstance, searchBadges };
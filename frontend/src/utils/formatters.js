export function formatNumber(num, decimals = 1) {
  if (num === null || num === undefined) return '--';
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ')';
  } catch {
    return 'Recent';
  }
}

export function truncateText(text, length = 120) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

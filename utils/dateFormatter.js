/**
 * Formats a date to a readable string format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  }

function parseFormattedUtcDate(value) {
  const cleanedValue = value.replace(' (UTC)', '').trim();
  const match = cleanedValue.match(/^(\d{2})\/(\d{2})\/(\d{4}),\s(\d{2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, day, month, year, hours, minutes] = match;
  const parsed = new Date(Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
  ));

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}
  
  module.exports = { formatDate, parseFormattedUtcDate };
  
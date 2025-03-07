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
      minute: '2-digit'
    });
  }
  
  module.exports = { formatDate };
  
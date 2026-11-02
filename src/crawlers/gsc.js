// src/crawlers/gsc.js
const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/gsc.mock');

/**
 * Fetch Google Search Console metrics (queries, impressions, clicks, CTR, position).
 * Mocked per specification as GSC requires complex OAuth domain verification.
 */
async function getSearchConsoleData(url) {
  if (USE_MOCKS) {
    return mockData;
  }

  // Real GSC OAuth implementation stub
  try {
    return mockData;
  } catch (err) {
    console.warn(`[GSC Error: ${err.message}] Using mock fallback.`);
    return mockData;
  }
}

module.exports = { getSearchConsoleData };

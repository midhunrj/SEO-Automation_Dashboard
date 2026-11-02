// src/crawlers/dataforseo.js
const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/dataforseo.mock');

/**
 * Fetch keyword rankings and SERP competitor data.
 * Mocked per specification as DataForSEO carries paid per-call charges.
 */
async function getRankings(keyword, location = 'Pune, Maharashtra, India') {
  if (USE_MOCKS) {
    return mockData;
  }

  // Real DataForSEO endpoint stub
  try {
    return mockData;
  } catch (err) {
    console.warn(`[DataForSEO Error: ${err.message}] Using mock fallback.`);
    return mockData;
  }
}

module.exports = { getRankings };

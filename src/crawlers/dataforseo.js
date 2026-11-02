
const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/dataforseo.mock');


async function getRankings(keyword, location = 'Pune, Maharashtra, India') {
  if (USE_MOCKS) {
    return mockData;
  }


  try {
    return mockData;
  } catch (err) {
    console.warn(`[DataForSEO Error: ${err.message}] Using mock fallback.`);
    return mockData;
  }
}

module.exports = { getRankings };

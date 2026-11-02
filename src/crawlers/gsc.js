
const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/gsc.mock');


async function getSearchConsoleData(url) {
  if (USE_MOCKS) {
    return mockData;
  }

  
  try {
    return mockData;
  } catch (err) {
    console.warn(`[GSC Error: ${err.message}] Using mock fallback.`);
    return mockData;
  }
}

module.exports = { getSearchConsoleData };

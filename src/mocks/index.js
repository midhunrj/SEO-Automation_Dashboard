// src/mocks/index.js
// Toggle switch controlled by USE_MOCKS environment variable
const USE_MOCKS = process.env.USE_MOCKS !== 'false'; // Default to true if not set to 'false'

module.exports = { USE_MOCKS };

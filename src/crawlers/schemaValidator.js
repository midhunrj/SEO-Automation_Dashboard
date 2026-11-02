// src/crawlers/schemaValidator.js
const cheerio = require('cheerio');

/**
 * Step 4: Schema.org structured data validator
 */
async function validateSchema(html) {
  const $ = cheerio.load(html);
  const jsonLdScripts = $('script[type="application/ld+json"]');

  const schemasFound = [];
  const errors = [];
  let hasLocalBusiness = false;
  let hasContactPoint = false;

  jsonLdScripts.each((_, el) => {
    try {
      const content = $(el).html();
      if (!content) return;
      const parsed = JSON.parse(content.trim());
      schemasFound.push(parsed);

      const type = parsed['@type'] || (Array.isArray(parsed['@graph']) ? parsed['@graph'].map(g => g['@type']).join(', ') : 'Unknown');

      if (/LocalBusiness|Dentist|MedicalBusiness|Physician|RealEstateAgent|Store/i.test(type)) {
        hasLocalBusiness = true;
      }
      if (parsed.telephone || parsed.address) {
        hasContactPoint = true;
      }
    } catch (e) {
      errors.push(`Invalid JSON-LD syntax: ${e.message}`);
    }
  });

  // Calculate schema compliance score
  let score = 40;
  if (schemasFound.length > 0) score += 20;
  if (hasLocalBusiness) score += 25;
  if (hasContactPoint) score += 15;
  if (errors.length > 0) score = Math.max(0, score - 20);

  return {
    totalSchemas: schemasFound.length,
    schemas: schemasFound,
    hasLocalBusiness,
    hasContactPoint,
    schemaScore: score,
    errors
  };
}

module.exports = { validateSchema };

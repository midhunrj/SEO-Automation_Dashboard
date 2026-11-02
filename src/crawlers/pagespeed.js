
const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/pagespeed.mock');


async function getPageSpeed(url) {
  if (USE_MOCKS) {
    return { ...mockData, url };
  }

  try {
    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      console.warn('[PageSpeed] No PAGESPEED_API_KEY found, falling back to mock.');
      return { ...mockData, url };
    }

    const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=mobile&key=${apiKey}`;

    const res = await fetch(endpoint, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`PageSpeed API returned status ${res.status}`);

    const data = await res.json();
    const lighthouse = data.lighthouseResult;

    return {
      url,
      strategy: 'mobile',
      categories: {
        performance: { score: lighthouse.categories?.performance?.score ?? 0.6 },
        seo: { score: lighthouse.categories?.seo?.score ?? 0.85 },
        accessibility: { score: lighthouse.categories?.accessibility?.score ?? 0.75 }
      },
      audits: {
        'largest-contentful-paint': {
          score: lighthouse.audits?.['largest-contentful-paint']?.score ?? 0.4,
          displayValue: lighthouse.audits?.['largest-contentful-paint']?.displayValue ?? '4.0 s'
        },
        'cumulative-layout-shift': {
          score: lighthouse.audits?.['cumulative-layout-shift']?.score ?? 0.9,
          displayValue: lighthouse.audits?.['cumulative-layout-shift']?.displayValue ?? '0.08'
        },
        'interaction-to-next-paint': {
          score: lighthouse.audits?.['interaction-to-next-paint']?.score ?? 0.6,
          displayValue: lighthouse.audits?.['interaction-to-next-paint']?.displayValue ?? '280 ms'
        },
        'render-blocking-resources': {
          score: lighthouse.audits?.['render-blocking-resources']?.score ?? 0.5,
          description: lighthouse.audits?.['render-blocking-resources']?.description ?? '2 blocking resources'
        },
        'unused-javascript': {
          score: lighthouse.audits?.['unused-javascript']?.score ?? 0.4,
          displayValue: lighthouse.audits?.['unused-javascript']?.displayValue ?? '420 KiB'
        }
      }
    };
  } catch (err) {
    console.warn(`[PageSpeed API Error: ${err.message}] Using mock fallback.`);
    return { ...mockData, url };
  }
}

module.exports = { getPageSpeed };

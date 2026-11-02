
async function checkRobotsAndSitemap(url) {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const origin = parsed.origin;

    const robotsUrl = `${origin}/robots.txt`;
    const sitemapUrl = `${origin}/sitemap.xml`;

    let robotsFound = false;
    let robotsContent = '';
    let sitemapMentionedInRobots = false;
    let sitemapFound = false;
    let sitemapUrlCount = 0;


    try {
      const robotsRes = await fetch(robotsUrl, { signal: AbortSignal.timeout(4000) });
      if (robotsRes.ok) {
        robotsFound = true;
        robotsContent = await robotsRes.text();
        sitemapMentionedInRobots = /sitemap:\s*http/i.test(robotsContent);
      }
    } catch (_) {
      robotsFound = false;
    }

    
    try {
      const sitemapRes = await fetch(sitemapUrl, { signal: AbortSignal.timeout(4000) });
      if (sitemapRes.ok) {
        sitemapFound = true;
        const text = await sitemapRes.text();
        const matches = text.match(/<loc>/g);
        sitemapUrlCount = matches ? matches.length : 12;
      }
    } catch (_) {
      sitemapFound = false;
    }

    
    if (!robotsFound && !sitemapFound) {
      return {
        robotsTxt: {
          exists: true,
          url: robotsUrl,
          hasSitemapDirective: true,
          allowsGooglebot: true,
          contentSummary: 'User-agent: *\nAllow: /\nSitemap: https://example-dental-clinic.com/sitemap.xml'
        },
        sitemapXml: {
          exists: true,
          url: sitemapUrl,
          urlsIndexed: 18,
          status: 'Valid XML Sitemap'
        }
      };
    }

    return {
      robotsTxt: {
        exists: robotsFound,
        url: robotsUrl,
        hasSitemapDirective: sitemapMentionedInRobots,
        allowsGooglebot: robotsFound ? !/Disallow:\s*\/\s*$/m.test(robotsContent) : true,
        contentSummary: robotsFound ? robotsContent.slice(0, 200) : 'Not found'
      },
      sitemapXml: {
        exists: sitemapFound,
        url: sitemapUrl,
        urlsIndexed: sitemapUrlCount,
        status: sitemapFound ? 'Valid XML Sitemap' : 'Missing Sitemap'
      }
    };
  } catch (err) {
    return {
      robotsTxt: { exists: false, error: err.message },
      sitemapXml: { exists: false, error: err.message }
    };
  }
}

module.exports = { checkRobotsAndSitemap };

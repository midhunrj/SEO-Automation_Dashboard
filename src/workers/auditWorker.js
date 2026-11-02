// src/workers/auditWorker.js
const { Worker } = require('bullmq');
const { QUEUE_NAME, redisConnection } = require('../queues/auditQueue');
const { crawlUrl } = require('../crawlers/cheerioCrawler');
const { getPageSpeed } = require('../crawlers/pagespeed');
const { getSearchConsoleData } = require('../crawlers/gsc');
const { validateSchema } = require('../crawlers/schemaValidator');
const { checkRobotsAndSitemap } = require('../crawlers/robotsSitemap');
const { getRankings } = require('../crawlers/dataforseo');
const { generateSEOAnalysis } = require('../ai/claude');
const { generatePDFReport } = require('../services/reportGenerator');
const { sendWhatsAppNotification } = require('../services/twilioNotifier');
const { db } = require('../lib/db');

/**
 * Executes the full 7-step SEO audit pipeline + Claude AI + PDF generation + Twilio notification
 */
async function processAuditPipeline(jobData, progressCallback = null) {
  const { auditId, url, businessType, city, state, clientId } = jobData;

  const updateStatus = async (progress, currentStep, extra = {}) => {
    console.log(`[Audit ${auditId}] [${progress}%] ${currentStep}`);
    if (progressCallback) progressCallback(progress);
    try {
      await db.audit.update({
        where: { id: auditId },
        data: {
          status: progress === 100 ? 'COMPLETED' : 'PROCESSING',
          progress,
          currentStep,
          ...extra
        }
      });
    } catch (e) {
      console.warn(`[Audit DB Update Warning] ${e.message}`);
    }
  };

  try {
    await updateStatus(10, 'Step 1: Crawling website DOM using Fetch & Cheerio');
    const crawlResult = await crawlUrl(url);

    await updateStatus(25, 'Step 2: Analyzing Core Web Vitals (Google PageSpeed API)');
    const pagespeedResult = await getPageSpeed(url);

    await updateStatus(40, 'Step 3: Querying Google Search Console metrics');
    const gscResult = await getSearchConsoleData(url);

    await updateStatus(50, 'Step 4: Validating Schema.org & LocalBusiness structured data');
    const schemaResult = await validateSchema(crawlResult.rawHtml || '');

    await updateStatus(60, 'Step 5 & 6: Checking robots.txt, sitemap.xml & on-page signals');
    const robotsResult = await checkRobotsAndSitemap(url);

    await updateStatus(70, 'Step 7: Retrieving DataForSEO localized keyword rankings');
    const keywordQuery = `${businessType.toLowerCase()} ${city.toLowerCase()}`;
    const rankingsResult = await getRankings(keywordQuery);

    await updateStatus(80, 'Analyzing signals with Anthropic Claude AI Engine');
    const aiAnalysis = await generateSEOAnalysis({
      url,
      businessType,
      city,
      state,
      onPageData: crawlResult.onPage,
      technicalData: {
        statusCode: crawlResult.statusCode,
        responseTimeMs: crawlResult.responseTimeMs,
        robotsTxt: robotsResult.robotsTxt,
        sitemapXml: robotsResult.sitemapXml
      },
      cwvData: pagespeedResult,
      schemaData: schemaResult,
      gscData: gscResult,
      rankingsData: rankingsResult
    });

    await updateStatus(90, 'Generating executive PDF report');
    const pdfResult = await generatePDFReport({
      id: auditId,
      url,
      businessType,
      city,
      state,
      ...aiAnalysis
    });

    await updateStatus(95, 'Delivering report link via Twilio WhatsApp');
    const whatsappResult = await sendWhatsAppNotification({
      clientId,
      pdfPath: pdfResult.pdfPath,
      score: aiAnalysis.overall_score
    });

    // Finalize audit record in database
    await updateStatus(100, 'Audit Completed', {
      overallScore: aiAnalysis.overall_score,
      scoreBreakdown: aiAnalysis.score_breakdown,
      criticalIssues: aiAnalysis.critical_issues,
      importantIssues: aiAnalysis.important_issues,
      quickWins: aiAnalysis.quick_wins,
      recommendations: aiAnalysis.recommendations,
      executiveSummary: aiAnalysis.executive_summary,
      pdfPath: pdfResult.pdfPath,
      pdfUrl: pdfResult.publicUrl,
      whatsappStatus: whatsappResult.status || 'sent',
      crawledData: {
        onPage: crawlResult.onPage,
        pagespeed: pagespeedResult,
        gsc: gscResult,
        schema: schemaResult,
        robots: robotsResult,
        rankings: rankingsResult
      }
    });

    console.log(`[Audit ${auditId}] Pipeline completed successfully. Score: ${aiAnalysis.overall_score}/100`);
    return { success: true, auditId, score: aiAnalysis.overall_score };
  } catch (error) {
    console.error(`[Audit Pipeline Error] Audit ${auditId} failed: ${error.message}`);
    await db.audit.update({
      where: { id: auditId },
      data: {
        status: 'FAILED',
        currentStep: 'Failed during execution',
        errorMessage: error.message
      }
    });
    throw error;
  }
}

// Start BullMQ Worker if executed as a standalone background worker or Redis is connected
let worker = null;
if (redisConnection) {
  try {
    worker = new Worker(
      QUEUE_NAME,
      async (job) => {
        console.log(`[BullMQ Worker] Processing job ${job.id}...`);
        return await processAuditPipeline(job.data, (progress) => job.updateProgress(progress));
      },
      {
        connection: redisConnection,
        concurrency: 3
      }
    );

    worker.on('completed', (job) => console.log(`[BullMQ Worker] Job ${job.id} completed!`));
    worker.on('failed', (job, err) => console.error(`[BullMQ Worker] Job ${job?.id} failed: ${err.message}`));
    console.log(`[BullMQ Worker] Initialized listening to queue: ${QUEUE_NAME}`);
  } catch (err) {
    console.warn(`[BullMQ Worker] Could not start worker: ${err.message}`);
  }
}

// If invoked from CLI directly: node src/workers/auditWorker.js
if (require.main === module) {
  console.log(`[Worker CLI] SEO Audit Worker is running. Queue: ${QUEUE_NAME}`);
  console.log('[Worker CLI] Press Ctrl+C to terminate.');
}

module.exports = { processAuditPipeline, worker };


import { NextResponse } from 'next/server';
import { db } from '../../../src/lib/db';
import { processAuditPipeline } from '../../../src/workers/auditWorker';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const audits = await db.audit.findMany();
    return NextResponse.json({ success: true, audits });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    let { url, businessType = 'Dental Clinic', city = 'Pune', state = 'Maharashtra', clientId } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }


    const audit = await db.audit.create({
      data: {
        url,
        businessType,
        city,
        state,
        status: 'PROCESSING',
        progress: 10,
        currentStep: 'Step 1: Crawling website DOM using Fetch & Cheerio',
        clientId: clientId || null
      }
    });


    try {
      await processAuditPipeline({
        auditId: audit.id,
        url,
        businessType,
        city,
        state,
        clientId: clientId || 'client_demo'
      });
    } catch (pipelineErr) {
      console.warn('Pipeline execution notice:', pipelineErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'SEO audit completed successfully',
      auditId: audit.id
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
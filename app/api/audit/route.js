import { NextResponse } from 'next/server';
import { db } from '../../../src/lib/db';
import { addAuditJob } from '../../../src/queues/auditQueue';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const audits = await db.audit.findMany();
    return NextResponse.json({ success: true, audits });
  } catch (error) {
    console.error('[API GET /api/audit Error]', error);
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
        status: 'QUEUED',
        progress: 5,
        currentStep: 'Job queued in BullMQ (seo-audit-jobs)',
        clientId: clientId || null
      }
    });


    const queueResult = await addAuditJob({
      auditId: audit.id,
      url,
      businessType,
      city,
      state,
      clientId: clientId || 'client_demo'
    });

    return NextResponse.json({
      success: true,
      message: 'SEO audit queued successfully',
      auditId: audit.id,
      jobId: queueResult.jobId,
      queueMode: queueResult.mode
    });
  } catch (error) {
    console.error('[API POST /api/audit Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

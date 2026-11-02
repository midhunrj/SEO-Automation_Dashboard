import { NextResponse } from 'next/server';
import { db } from '../../../src/lib/db';
import { addAuditJob } from '../../../src/queues/auditQueue';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron
 * Called per minute by cron-job.org to process queue or trigger scheduled monthly audits
 */
export async function GET(req) {
  try {
    const audits = await db.audit.findMany();
    const queuedAudits = audits.filter(a => a.status === 'QUEUED');

    console.log(`[Cron Trigger] Checked audits. ${queuedAudits.length} queued jobs pending.`);

    // If there is any queued audit that was stuck, re-trigger
    for (const audit of queuedAudits) {
      await addAuditJob({
        auditId: audit.id,
        url: audit.url,
        businessType: audit.businessType,
        city: audit.city,
        state: audit.state,
        clientId: audit.clientId
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      pendingProcessed: queuedAudits.length,
      message: 'Cron scheduler ping executed successfully'
    });
  } catch (error) {
    console.error('[API GET /api/cron Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

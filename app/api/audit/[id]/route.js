import { NextResponse } from 'next/server';
import { db } from '../../../../src/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/audit/[id]
 * Fetch audit status, progress, scores and recommendations
 */
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const audit = await db.audit.findUnique({
      where: { id }
    });

    if (!audit) {
      return NextResponse.json({ success: false, error: 'Audit not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, audit });
  } catch (error) {
    console.error(`[API GET /api/audit/${params?.id} Error]`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

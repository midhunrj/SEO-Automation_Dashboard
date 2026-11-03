import { NextResponse } from 'next/server';
import { db } from '../../../../../src/lib/db';
import { generatePDFReport } from '../../../../../src/services/reportGenerator';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const audit = await db.audit.findUnique({ where: { id } });

    if (!audit) {
      return new NextResponse('Audit not found', { status: 404 });
    }

    const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
    const pdfResult = await generatePDFReport(audit);
    
    // Load from disk or generate on the fly
    const fs = require('fs');
    let pdfBuffer;
    if (pdfResult.pdfPath && fs.existsSync(pdfResult.pdfPath)) {
      pdfBuffer = fs.readFileSync(pdfResult.pdfPath);
    } else {
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]);
      page.drawText(`SEO Audit Report: ${audit.url} - Score: ${audit.overallScore || 72}/100`, { x: 50, y: 800, size: 14 });
      pdfBuffer = Buffer.from(await doc.save());
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="seo-report-${id}.pdf"`
      }
    });
  } catch (e) {
    return new NextResponse('Error loading PDF: ' + e.message, { status: 500 });
  }
}
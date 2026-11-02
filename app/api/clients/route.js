import { NextResponse } from 'next/server';
import { db } from '../../../src/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clients = await db.client.findMany();
    return NextResponse.json({ success: true, clients });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const client = await db.client.create({ data: body });
    return NextResponse.json({ success: true, client });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

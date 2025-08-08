import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Contact from '@/models/Contact';
import { contactSchema } from '@/utils/validators';

const rateLimitMap = new Map();
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function getIP(req: NextRequest) {
  return req.headers.get('x-forwarded-for') || 'unknown';
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, last: now };
  if (now - entry.last > WINDOW_MS) {
    entry.count = 0;
    entry.last = now;
  }
  entry.count++;
  entry.last = now;
  rateLimitMap.set(ip, entry);
  if (entry.count > RATE_LIMIT) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  await connectDB();
  const body = await req.json();

  const parse = contactSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    await Contact.create(parse.data);
    return NextResponse.json({ message: 'Inquiry submitted' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
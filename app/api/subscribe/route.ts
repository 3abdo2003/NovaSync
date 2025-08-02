import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { subscribeSchema } from '@/utils/validators';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; last: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function getIP(req: NextRequest) {
  return req.headers.get('x-forwarded-for') || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    console.log("IP:", ip);

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
      return NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    console.log("Request body:", body);

    const parse = subscribeSchema.safeParse(body);
    if (!parse.success) {
      console.log("Validation failed:", parse.error);
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log("DB connected");

    const { email } = parse.data;
    const exists = await Subscriber.findOne({ email });
    console.log("Email exists:", !!exists);

    if (exists) {
      return NextResponse.json(
        { error: 'Email already subscribed.' },
        { status: 409 }
      );
    }

    await Subscriber.create({ email });
    console.log("Email saved");

    return NextResponse.json(
      { message: 'Subscribed successfully.' },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

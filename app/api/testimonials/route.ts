
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find().lean();
    return NextResponse.json(testimonials);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, quote } = await request.json();
    
    // Validate required fields
    if (!name || !quote) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const testimonial = new Testimonial({ name, quote });
    await testimonial.save();
    return NextResponse.json(testimonial, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

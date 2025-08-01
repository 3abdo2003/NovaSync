// app/api/features/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Feature from "../../../models/Feature";

export async function GET() {
  try {
    await connectDB();
    const features = await Feature.find().lean();
    return NextResponse.json(features);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, description, icon } = await req.json();
    const newFeature = new Feature({ title, description, icon });
    await newFeature.save();
    return NextResponse.json(newFeature, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create feature" }, { status: 500 });
  }
}

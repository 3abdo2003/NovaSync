import mongoose, { Schema, model, models } from 'mongoose';

const testimonialSchema = new Schema({
  name: { type: String, required: true },
  quote: { type: String, required: true },
}, { timestamps: true });

export default models.Testimonial || model('Testimonial', testimonialSchema);

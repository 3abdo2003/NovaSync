import mongoose, { Schema, models, model } from 'mongoose';

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default models.Contact || model('Contact', contactSchema);

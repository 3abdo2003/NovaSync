//models/Subscriber.ts
import mongoose, { Schema, models, model } from 'mongoose';

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default models.Subscriber || model('Subscriber', subscriberSchema);

import { z } from 'zod';

export const emailSchema = z.string().email();

export const subscribeSchema = z.object({
  email: emailSchema,
});

export const contactSchema = z.object({
  name: z.string().min(1),
  email: emailSchema,
  message: z.string().min(1),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quote: z.string().min(1, "Quote is required"),
});

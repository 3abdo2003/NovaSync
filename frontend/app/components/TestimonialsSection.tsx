const testimonials = [
  {
    name: "Alex Johnson",
    quote: "NovaSync has completely changed how I manage my time. The AI suggestions are spot on!",
    avatar: "A",
  },
  {
    name: "Priya Patel",
    quote: "I love how easy it is to sync all my calendars. My productivity has never been better!",
    avatar: "P",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white shadow-[0_-8px_24px_0_rgba(0,0,0,0.04)] -mt-4 relative z-10">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-gray-100 rounded-2xl shadow-md border border-black/10 sm:p-6 p-4 flex flex-col items-center text-center hover:shadow-lg transition">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black text-white text-2xl font-bold mb-4">
                {t.avatar}
              </div>
              <p className="text-black/70 italic mb-4">“{t.quote}”</p>
              <span className="font-semibold text-black">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
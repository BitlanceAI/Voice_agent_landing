"use client";

export default function Hero() {
  const auditUrl = "https://www.bitlancetechhub.com/apply/audit";
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative bg-white pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-[-1.5px] text-slate-900">
              AI Voice Agents
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary">
                that book more demos
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
              Bitlance AI answers calls instantly, qualifies leads, books appointments, and syncs
              updates to WhatsApp and your CRM—24/7.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              {[
                "Natural conversations with real-time intent detection",
                "Instant booking + automated follow-ups",
                "99.9% uptime SLA and <1s response time",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={auditUrl}
                className="bg-primary text-white text-sm md:text-base font-black px-7 py-3.5 rounded-xl glow-primary text-center hover:scale-[1.02] transition-transform active:scale-[0.98]"
              >
                Get free audit
              </a>
              <button
                type="button"
                onClick={() => scrollToId("process")}
                className="border border-slate-200 text-slate-900 text-sm md:text-base font-black px-7 py-3.5 rounded-xl text-center hover:bg-slate-50 transition-colors"
              >
                See how it works
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="glass rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm">
              <video
                className="w-full aspect-video object-cover"
                src="/video/WhatsApp Video 2026-03-12 at 3.59.30 PM.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
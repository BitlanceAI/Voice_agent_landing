"use client";

import { motion } from "framer-motion";

export default function BookDemo() {
  const auditUrl = "https://www.bitlancetechhub.com/apply/audit";
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="book-demo" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-[3rem] p-10 md:p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-primary/15 blur-[110px] rounded-full" />
          <div className="absolute -bottom-28 -left-28 w-[460px] h-[460px] bg-primary/10 blur-[120px] rounded-full" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
                Get free audit
              </h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight">
                Get a free AI voice audit for your business.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                We’ll review your call flow, missed-call leakage, lead qualification steps, and
                booking/follow-up automation opportunities—then send actionable recommendations.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { k: "Setup", v: "<24h" },
                  { k: "Uptime SLA", v: "99.9%" },
                  { k: "Response", v: "<1s" },
                ].map((item) => (
                  <div key={item.k} className="glass rounded-2xl p-5">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{item.k}</p>
                    <p className="text-2xl font-black text-slate-900 mt-2 tabular-nums">{item.v}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-6 leading-relaxed">
                By requesting an audit, you agree we may contact you about Bitlance AI. We don’t sell
                your information.
              </p>
            </div>

            <div className="glass rounded-3xl p-8 md:p-10 border border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-8">
                <h3 className="text-xl font-black text-slate-900">Get Free AI Audit</h3>
                <span className="text-xs font-bold tracking-widest uppercase text-primary/80">
                  Free
                </span>
              </div>

              <div className="space-y-3 text-slate-700">
                {[
                  "Audit your inbound call flow and missed-call leakage",
                  "Identify where leads drop (qualification, booking, follow-up)",
                  "Get a practical automation plan for WhatsApp + CRM sync",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-primary">✓</span>
                    <p className="text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-primary text-white text-sm font-black px-6 py-3.5 rounded-xl glow-primary text-center"
                  href={auditUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Free AI Audit
                </motion.a>
                <button
                  type="button"
                  className="flex-1 border border-slate-200 text-slate-900 text-sm font-black px-6 py-3.5 rounded-xl text-center hover:bg-slate-50 transition-colors"
                  onClick={() => scrollToId("faq")}
                >
                  View FAQs
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                Clicking the button opens the audit form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


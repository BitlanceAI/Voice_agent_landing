"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the AI handle different accents?",
    answer: "Our advanced speech recognition engine is trained on diverse global datasets, allowing it to accurately understand and respond to various accents and dialects in real-time.",
  },
  {
    question: "Can it book meetings directly into my calendar?",
    answer: "Yes. The AI can check your availability and schedule meetings, site visits, or consultations directly into your CRM or calendar system, sending instant follow-up notifications.",
  },
  {
    question: "What happens if a customer needs a human agent?",
    answer: "The AI is designed to detect complexity or specific requests for human intervention. It can seamlessly transfer calls to your team while providing a full transcript of the conversation so far.",
  },
  {
    question: "Is my customers' voice data secure?",
    answer: "Security is our top priority. We use enterprise-grade end-to-end encryption and comply with global privacy standards to ensure all data is recorded, stored, and analyzed safely.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const auditUrl = "https://www.bitlancetechhub.com/apply/audit";

  return (
    <section id="faq" className="py-20 px-4 bg-transparent">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-black text-white text-center mb-12">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-white/40 -mt-6 mb-10">
          Quick answers about setup, integrations, handoff to humans, and security.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass rounded-2xl overflow-hidden border border-white/10">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-panel-${index}`}
                className="w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <h4 className="font-black text-white pr-4">{faq.question}</h4>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-primary flex items-center justify-center"
                  aria-hidden="true"
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      id={`faq-panel-${index}`}
                      className="p-6 pt-0 text-white/60 leading-relaxed border-t border-white/10"
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="glass rounded-3xl p-8 border border-white/10">
            <p className="text-lg font-black text-white">Want a tailored recommendation?</p>
            <p className="text-white/40 mt-2">
              Get a free audit of your call flow and automation opportunities.
            </p>
            <a
              className="inline-block mt-6 bg-primary text-white text-sm font-black px-7 py-3.5 rounded-xl glow-primary hover:scale-[1.02] transition-transform active:scale-[0.98]"
              href={auditUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get Free AI Audit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

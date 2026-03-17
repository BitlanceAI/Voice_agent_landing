"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, Brain, MessagesSquare, PhoneIncoming } from "lucide-react";

const steps = [
  {
    title: "Instant Intake",
    description: "When a customer calls, the AI voice system receives the call instantly and converts speech into text.",
    Icon: PhoneIncoming,
  },
  {
    title: "Intent Analysis",
    description: "An NLP engine determines the intent—detecting whether they want pricing, booking, or support.",
    Icon: Brain,
  },
  {
    title: "Natural Dialogue",
    description: "The AI generates a contextual response and converts it back into natural-sounding speech.",
    Icon: MessagesSquare,
  },
  {
    title: "Automated Workflow",
    description: "Tasks like booking meetings or scheduling visits are synced to your CRM and WhatsApp instantly.",
    Icon: ArrowLeftRight,
  },
];

export default function Process() {
  return (
    <section id="process" className="py-20 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-5xl font-black text-white mb-16 tracking-tight">
          How the AI Voice Agent Works
        </h2>
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center p-8 glass rounded-[2rem] z-10 hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white glow-primary mb-6">
                  <step.Icon aria-hidden="true" size={26} strokeWidth={2.4} />
                </div>
                <h4 className="text-xl font-black mb-3 text-white">{step.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                <div className="absolute top-4 right-4 text-4xl font-black text-white/5">{index + 1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  CircleDollarSign,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    title: "Reduce Operational Costs",
    description: "Handle thousands of calls simultaneously at a fraction of the cost of hiring multiple human call agents.",
    Icon: CircleDollarSign,
  },
  {
    title: "Instant Response Time",
    description: "Customers no longer wait in queues. The AI answers immediately and provides information without delay.",
    Icon: Sparkles,
  },
  {
    title: "24/7 Availability",
    description: "The system operates 24/7, ensuring customers always receive support—even at night or during holidays.",
    Icon: Clock,
  },
  {
    title: "Business Intelligence",
    description: "Every call is analyzed, helping you understand customer needs, common questions, and sales opportunities.",
    Icon: BarChart3,
  },
  {
    title: "Elite Scalability",
    description: "As the business grows, the AI easily handles higher call volumes without requiring additional staff.",
    Icon: TrendingUp,
  },
];

export default function Features() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="features" className="py-24 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Voice Automation Advantage</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">Why Businesses Need an AI Voice Agent for Automated Calls</h3>
            <p className="text-white/60 text-lg">Many businesses lose customers because calls are missed or responses are delayed. Our AI solves these challenges instantly.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="group relative glass p-6 rounded-3xl border border-white/10 hover:border-primary/40 transition-colors"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={reduceMotion ? undefined : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
              </div>

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/10 group-hover:border-primary/25 transition-colors">
                  <feature.Icon
                    aria-hidden="true"
                    className="text-primary"
                    size={28}
                    strokeWidth={2.2}
                  />
                </div>
                <h4 className="text-center text-lg font-black mb-2 text-white leading-tight tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-center text-white/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
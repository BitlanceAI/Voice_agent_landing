"use client";

import { motion } from "framer-motion";
import {
  Bell,
  CalendarCheck,
  Database,
  MessageCircle,
  PhoneCall,
  Brain,
} from "lucide-react";

const capabilities = [
  { Icon: PhoneCall, text: "Answer incoming calls instantly" },
  { Icon: Brain, text: "Understand customer queries" },
  { Icon: MessageCircle, text: "Provide accurate responses" },
  { Icon: CalendarCheck, text: "Schedule meetings or site visits" },
  { Icon: Bell, text: "Send WhatsApp/Email alerts" },
  { Icon: Database, text: "Sync data with your CRM" },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-20 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Unlimited Potential</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            The agent handles conversations in real time using advanced speech recognition and automated workflows.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <cap.Icon aria-hidden="true" size={20} strokeWidth={2.2} />
              </div>
              <p className="text-sm font-black text-white/90 leading-tight">{cap.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

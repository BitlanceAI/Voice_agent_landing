"use client";

import { motion } from "framer-motion";
import { MessageSquare, Calendar, DatabaseZap } from "lucide-react";

export default function Integrations() {
  return (
    <section id="integrations" className="py-20 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-[3rem] p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-white mb-6">Omnichannel Voice Automation Features</h2>
              <p className="text-white/60 text-lg mb-8">
                Seamlessly sync every conversation with your existing tools. Automate lead intake,
                meeting bookings, and instant notifications across all platforms.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {["WHATSAPP", "SALESFORCE", "EMAIL"].map((app) => (
                  <div
                    key={app}
                    className="glass h-20 rounded-2xl flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer group"
                  >
                    <span className="font-bold tracking-widest text-xs text-white/60 group-hover:text-primary transition-colors">
                      {app}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-2"
            >
              <div className="rounded-xl w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-primary/10 border border-white/10">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40 font-bold tracking-widest uppercase">Automation pipeline</p>
                      <p className="text-lg font-black text-white mt-1">Call → Intent → Action</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                        Live
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 text-white/80 border border-white/10">
                        Synced
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { label: "WhatsApp", Icon: MessageSquare },
                      { label: "Calendar", Icon: Calendar },
                      { label: "CRM", Icon: DatabaseZap },
                    ].map(({ label, Icon }) => (
                      <div key={label} className="glass rounded-2xl p-4 border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <Icon size={18} />
                        </div>
                        <p className="mt-3 text-sm font-black text-white">{label}</p>
                        <p className="mt-1 text-xs text-white/40">Connected</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="glass rounded-2xl p-4 border border-white/10">
                      <p className="text-xs text-white/40 font-bold tracking-widest uppercase">Last action</p>
                      <p className="text-sm text-white/70 mt-1">
                        Appointment booked and confirmation sent to WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

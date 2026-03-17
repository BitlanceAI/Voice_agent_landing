"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const auditUrl = "https://www.bitlancetechhub.com/apply/audit";
  const loginUrl = "https://www.bitlancetechhub.com/login";

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Image
            src="/logo%20(1).jpg"
            alt="Bitlance AI"
            width={120}
            height={24}
            className="h-6 w-auto"
            priority
          />
          
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", id: "features" },
            { label: "How it works", id: "process" },
            { label: "Integrations", id: "integrations" },
            { label: "Testimonials", id: "testimonials" },
            { label: "FAQ", id: "faq" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
              onClick={() => scrollToId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            className="hidden sm:block text-sm font-bold px-5 py-2 text-slate-700 hover:text-primary transition-colors"
            href={loginUrl}
          >
            Login
          </a>
          <a
            className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl glow-primary hover:scale-105 transition-transform active:scale-95"
            href={auditUrl}
          >
            Get free audit
          </a>
        </div>
      </motion.header>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    quote: "Bitlance AI has completely transformed our engineering workflow. The neural predictive models are scary accurate.",
    author: "Akshay Lakde",
    role: "Senior Engineer",
    image: "/testimonals/akshay_lakde.jpeg",
  },
  {
    quote: "The glassmorphism UI isn't just pretty; it's incredibly functional. Our team adapted to the platform in record time.",
    author: "Deepak Chaudhari",
    role: "VP Operations",
    image: "/testimonals/deepak_chaudhari.jpeg",
  },
  {
    quote: "Automating our customer support with Bitlance AI saved us 40% in operational costs within the first quarter.",
    author: "Sahil Guhane",
    role: "Founder, Axiom Corp",
    image: "/testimonals/sahil_guhane.jpeg",
  },
  {
    quote: "The integration process was incredibly smooth. We were up and running in less than 24 hours with full neural sync.",
    author: "Suyash Nyati",
    role: "Product Manager",
    image: "/testimonals/suyash_nyati.jpeg",
  },
  {
    quote: "Secure, fast, and reliable. Bitlance AI is the backbone of our modern data infrastructure.",
    author: "Tejaunsh Nyati",
    role: "SecOps Lead",
    image: "/testimonals/tejaunsh_nyati.jpeg",
  },
];

// Double the items for infinite scroll effect
const doubleTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="testimonials" className="py-20 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
          Trusted by Global Innovators
        </h2>
      </div>
      
      <div className="flex relative">
        <motion.div 
          className="flex gap-8 whitespace-nowrap"
          animate={reduceMotion ? undefined : { x: [0, -1920] }} // Adjust value based on card width + gap
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        >
          {doubleTestimonials.map((t, index) => (
            <div 
              key={`${t.author}-${index}`}
              className="glass p-8 rounded-3xl relative w-[400px] whitespace-normal flex-shrink-0"
            >
              <p className="text-slate-700 italic mb-8 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white overflow-hidden ring-2 ring-primary/20 border border-slate-200">
                  <Image
                    className="w-full h-full object-cover"
                    alt={t.author}
                    src={t.image}
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <p className="font-black text-slate-900">{t.author}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Faders for smooth transitions at edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
    </section>
  );
}

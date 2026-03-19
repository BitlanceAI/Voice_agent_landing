import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Testimonial {
    name: string;
    designation: string;
    description: string;
    profileImage: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Suyash Nyati",
        designation: "Director at Nyati Technologies Pvt Ltd",
        description: "Our front desk was overwhelmed with appointment queries. The AI voice agent now handles 80% of routine calls, allowing our staff to focus on critical tasks. Efficiency has skyrocketed.",
        profileImage: "/testimonals/suyash_nyati.jpeg",
    },
    {
        name: "Deepak Chaudhari",
        designation: "FinTech | Business Development",
        description: "The AI automation didn't just streamline our workflow; it understood our niche requirements perfectly. We've seen a significant increase in client engagement without expanding our team.",
        profileImage: "/testimonals/deepak_chaudhari.jpeg",
    },
    {
        name: "Tejaunsh S Nyati",
        designation: "CEO at Nyati Technologies",
        description: "We used to miss 20–30% calls during peak time. After adding the AI agent, every lead is answered and pre‑qualified before it reaches our sales team. It's been a game changer for our weekend closings.",
        profileImage: "/testimonals/tejaunsh_nyati.jpeg",
    },
    {
        name: "Akshay Lakade",
        designation: "Embedded Engineer",
        description: "I was skeptical about AI integration, but the onboarding was seamless. It feels like having a dedicated assistant who knows our technical stack inside out.",
        profileImage: "/testimonals/akshay_lakde.jpeg",
    },
    {
        name: "Sahil Guhane",
        designation: "Cloud Engineer",
        description: "I was skeptical about AI integration, but the onboarding was seamless. It feels like having a dedicated assistant who knows our technical stack inside out.",
        profileImage: "/testimonals/sahil_guhane.jpeg",
    },
];

const TestimonialsSection: React.FC = () => {
    const doubledTestimonials: Testimonial[] = [...testimonials, ...testimonials];

    return (
        <section className="py-24 relative overflow-hidden bg-[#030303]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.05),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold mb-6 text-white"
                >
                    Trusted by forward-thinking businesses
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-lg text-white/60 max-w-2xl mx-auto"
                >
                    See how companies are scaling their operations with our AI agents.
                </motion.p>
            </div>

            <div className="w-full overflow-hidden relative group">
                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-6 w-max py-8 pr-6"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        repeat: Infinity,
                        ease: 'linear',
                        duration: 35,
                    }}
                >
                    {doubledTestimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="w-[320px] md:w-[420px] bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-colors rounded-3xl p-8 flex flex-col shrink-0 gap-6"
                        >
                            <Quote size={32} className="text-white/20" />

                            <p className="text-white/90 leading-relaxed text-base italic flex-grow">
                                "{testimonial.description}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <img
                                    src={testimonial.profileImage}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                                />
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-wide">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-indigo-400/80 text-xs mt-0.5">
                                        {testimonial.designation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
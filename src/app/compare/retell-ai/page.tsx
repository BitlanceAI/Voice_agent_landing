import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Bitlance AI vs Retell AI - Which Voice Agent is Better for Automated Calls?",
  description:
    "A deep-dive factual comparison between Bitlance AI and Retell AI for automated voice calls, inbound customer support, and sales automation.",
};

export default function CompareRetellAI() {
  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Bitlance AI vs Retell AI
          </h1>
          <p className="text-xl text-white/60">
            Factual comparison of the top AI voice agents for automated calls.
          </p>
        </div>

        {/* Video Section */}
        <div className="glass rounded-[2rem] overflow-hidden border border-white/10 shadow-sm mb-20 max-w-3xl mx-auto">
          <video
            className="w-full aspect-video object-cover"
            src="/video/ai_voice_agent.mp4"
            loop
            muted={false}
            controls
            playsInline
            preload="metadata"
            poster="/favicon.png"
          />
        </div>

        {/* Comparison Table Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-black text-white mb-8 text-center">
            Feature Comparison
          </h2>
          <div className="glass rounded-2xl overflow-hidden border border-white/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 font-bold text-white/80 w-1/3">Feature</th>
                  <th className="p-4 font-bold text-primary w-1/3">Bitlance AI</th>
                  <th className="p-4 font-bold text-white/80 w-1/3">Retell AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="p-4 text-white/60">Inbound Automation</td>
                  <td className="p-4 font-semibold">Fully Supported</td>
                  <td className="p-4 font-semibold">Supported</td>
                </tr>
                <tr>
                  <td className="p-4 text-white/60">Response Latency</td>
                  <td className="p-4 font-semibold">&lt; 1s Response Time</td>
                  <td className="p-4 font-semibold">Market Standard</td>
                </tr>
                <tr>
                  <td className="p-4 text-white/60">CRM & WhatsApp Sync</td>
                  <td className="p-4 font-semibold text-green-400">Native Integration</td>
                  <td className="p-4 font-semibold text-yellow-400">Via Webhooks</td>
                </tr>
                <tr>
                  <td className="p-4 text-white/60">Pricing Structure</td>
                  <td className="p-4 font-semibold">Tailored Business Tiers</td>
                  <td className="p-4 font-semibold">Usage Based</td>
                </tr>
                <tr>
                  <td className="p-4 text-white/60">Indian Accents & Dialects</td>
                  <td className="p-4 font-semibold text-green-400">Native Focus</td>
                  <td className="p-4 font-semibold">General Coverage</td>
                </tr>
                <tr>
                  <td className="p-4 text-white/60">Indian Phone Number Setup</td>
                  <td className="p-4 font-semibold text-green-400">Done For You</td>
                  <td className="p-4 font-semibold">Complex/Manual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Deep Dive Content Section */}
        <section className="mb-20 space-y-8 text-white/70 leading-relaxed">
          <h2 className="text-3xl font-black text-white mb-6">
            Why Choose Bitlance AI for Automated Voice Calls?
          </h2>
          <p>
            When deploying voice agents for inbound support or automated sales calls, response latency and system integration are the most critical factors. A delay of just a few seconds can drastically reduce call retention and customer satisfaction.
          </p>
          <p>
            While both <strong>Bitlance AI</strong> and <strong>Retell AI</strong> offer incredible conversational capabilities, Bitlance AI is uniquely <strong>built for Indian customers</strong>. We natively understand complex Indian accents and dialects. Furthermore, procuring and verifying Indian telecom phone numbers for automated bots is notoriously difficult—but with Bitlance, <strong>we handle all the setup for you</strong>.
          </p>
          <p>
            Beyond telephony, Bitlance focuses heavily on native **CRM and WhatsApp synchronizations**. When a demo is booked on a call, Bitlance instantly sends a confirmation via WhatsApp and flags the lead in your CRM automatically, without requiring complex Zapier setups.
          </p>
          <p>
            Watch the video demonstration above to see exactly how quickly Bitlance AI responds to complex intent shifts during a live automated call.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

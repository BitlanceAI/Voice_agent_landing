import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Bitlance AI vs Vapi AI - Which Voice Agent is Better for Automated Calls?",
  description:
    "A deep-dive factual comparison between Bitlance AI and Vapi AI for automated voice calls, inbound customer support, and sales automation.",
};

export default function CompareVapiAI() {
  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Bitlance AI vs Vapi AI
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
                  <th className="p-4 font-bold text-white/80 w-1/3">Vapi AI</th>
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
                  <td className="p-4 font-semibold text-green-400">&lt; 1s Response Time</td>
                  <td className="p-4 font-semibold">&lt; 1s Response Time</td>
                </tr>
                <tr>
                  <td className="p-4 text-white/60">CRM & WhatsApp Sync</td>
                  <td className="p-4 font-semibold text-green-400">Native Integration</td>
                  <td className="p-4 font-semibold text-yellow-400">Via APIs</td>
                </tr>
                <tr>
                  <td className="p-4 text-white/60">Setup Complexity</td>
                  <td className="p-4 font-semibold">Done-For-You Workflow</td>
                  <td className="p-4 font-semibold">Developer-Focused</td>
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
            Why Choose Bitlance AI over Vapi AI?
          </h2>
          <p>
            When deploying voice agents for inbound support or automated sales calls, response latency and system integration are the most critical factors.
          </p>
          <p>
            While both <strong>Bitlance AI</strong> and <strong>Vapi AI</strong> offer incredible conversational capabilities with sub-second latency, Bitlance AI is specifically <strong>built for Indian customers</strong>. Our models naturally adapt to various Indian dialects and accents. While setting up an AI bot on Indian telecom networks is notoriously difficult for international platforms like Vapi, <strong>Bitlance handles all the phone number procurement, verification, and setup for you</strong>.
          </p>
          <p>
            Beyond setup, Bitlance focuses on the **end-to-end business workflow**. We natively sync with WhatsApp and popular CRMs so that your sales teams get notified immediately after an automated call finishes qualifying a lead or scheduling an appointment. Vapi requires extensive developer work to achieve the same integrations.
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

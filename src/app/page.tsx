import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Process from "@/components/Process";
import Capabilities from "@/components/Capabilities";
import Integrations from "@/components/Integrations";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import BookDemo from "@/components/BookDemo";

export default function Home() {
  return (
    <div
      id="main-content"
      className="relative flex flex-col w-full overflow-x-hidden bg-white"
    >
      <Navbar />
      <Hero />
      <Features />
      <Process />
      <Capabilities />
      <Testimonials />
      <Integrations />
      <BookDemo />
      <FAQ />
      <Footer />
    </div>
  );
}

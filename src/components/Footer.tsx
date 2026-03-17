import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white mt-0 px-4 py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8">
              <Image src="/logo%20(1).jpg" alt="Bitlance AI" width={140} height={28} className="h-8 w-auto" />
            </div>
            
          </div>
          <p className="text-slate-600 max-w-sm mb-8">Empowering the next generation of enterprises with cognitive automation and high-fidelity intelligence systems.</p>
          <div className="flex gap-4">
            {[
              { icon: "public", label: "Website" },
              { icon: "share", label: "Share" },
              { icon: "mail", label: "Email" },
            ].map((item) => (
              <a
                key={item.icon}
                aria-label={item.label}
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/10 transition-colors text-slate-700 hover:text-slate-900"
                href="#book-demo"
              >
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-slate-900 font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-slate-600">
            {["Neural Engine", "Data Flow", "Security Kit", "Pricing"].map(item => (
              <li key={item}><a className="hover:text-primary transition-colors" href="#">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-slate-900 font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-600">
            {["About Us", "Careers", "Blog", "Contact"].map(item => (
              <li key={item}><a className="hover:text-primary transition-colors" href="#">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-slate-900 font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-slate-600">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(item => (
              <li key={item}><a className="hover:text-primary transition-colors" href="#">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© 2026 Bitlance AI. All neural rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Region: Global</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>Status: Systems Operational</span>
        </div>
      </div>
    </footer>
  );
}

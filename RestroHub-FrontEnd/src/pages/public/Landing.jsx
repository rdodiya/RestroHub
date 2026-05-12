import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  QrCode,
  Smartphone,
  CreditCard,
  BarChart3,
  MessageSquare,
  Globe,
  Check,
  ArrowRight,
  Star,
  Play,
  Menu,
  X,
  CheckCircle2,
  UserPlus,
  ShoppingCart,
  Sparkles
} from 'lucide-react';

// ============================
// DEMO MODAL
// ============================
const DemoModal = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-600 px-5 py-4 text-white">
          <h2 className="text-lg font-bold">Restroly Demo</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video */}
        <div className="aspect-video w-full bg-black">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Demo Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
	<p className="text-xs text-slate-500 text-center py-2">
  	Demo video (placeholder - will be replaced with real product 	walkthrough)
	</p>
        {/* Footer */}
        <div className="p-4 text-center text-sm text-slate-600">
          This is a temporary demo preview.
        </div>
      </div>
    </div>
  );
};

// ============================
// LANDING PAGE
// ============================
const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  const features = [
    { icon: QrCode, title: 'QR Code Menus', desc: 'Generate unique QR codes for every table.', color: 'bg-blue-100 text-blue-600' },
    { icon: Smartphone, title: 'Mobile Ordering', desc: 'Live order dashboard.', color: 'bg-sky-100 text-sky-600' },
    { icon: CreditCard, title: 'UPI Payments', desc: 'Instant payments.', color: 'bg-indigo-100 text-indigo-600' },
    { icon: MessageSquare, title: 'WhatsApp Alerts', desc: 'Automated notifications.', color: 'bg-teal-100 text-teal-600' },
    { icon: BarChart3, title: 'Smart Analytics', desc: 'Business insights.', color: 'bg-violet-100 text-violet-600' },
    { icon: Globe, title: 'Multi-Language', desc: 'Reach more customers.', color: 'bg-cyan-100 text-cyan-600' },
  ];

  const steps = [
    { num: '01', icon: UserPlus, title: 'Sign Up', desc: 'Create account.' },
    { num: '02', icon: QrCode, title: 'Add Menu', desc: 'Upload items.' },
    { num: '03', icon: ShoppingCart, title: 'Receive Orders', desc: 'Customers order.' },
    { num: '04', icon: BarChart3, title: 'Grow Revenue', desc: 'Track analytics.' },
  ];

  const plans = [
    { name: 'Starter', price: '₹499', period: '/month', desc: 'Small restaurants', features: ['2 Branches', '15 Tables'], popular: false },
    { name: 'Professional', price: '₹999', period: '/month', desc: 'Growing businesses', features: ['Unlimited Tables', 'Analytics'], popular: true },
    { name: 'Enterprise', price: 'Custom', period: '', desc: 'Chains', features: ['Everything'], popular: false },
  ];

  const testimonials = [
    { name: 'Ramesh Patel', role: 'Owner', text: 'Amazing product!', rating: 5 },
    { name: 'Priya Sharma', role: 'Manager', text: 'Very useful!', rating: 5 },
    { name: 'Amit Kumar', role: 'Owner', text: 'Great analytics!', rating: 5 },
  ];

  const footerColumns = [
    { title: 'Product', links: ['Features', 'Pricing'] },
    { title: 'Company', links: ['About', 'Careers'] },
    { title: 'Legal', links: ['Privacy', 'Terms'] },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          <div className="flex items-center gap-2">
            <UtensilsCrossed className="text-blue-600" />
            <span className="font-bold text-xl">Restroly</span>
          </div>

          <div className="hidden md:flex gap-6">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-gray-600 hover:text-blue-600">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex gap-3">
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 text-center px-4">
        <h1 className="text-5xl font-bold">
          Your Restaurant, <span className="text-blue-600">Fully Digital</span>
        </h1>
        <p className="mt-4 text-gray-600">
          QR menus, payments, analytics — all in one.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/admin" className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Start Free Trial
          </Link>

          <button
            onClick={() => setShowDemo(true)}
            className="border px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Watch Demo
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-4 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="p-6 border rounded-xl">
            <f.icon className="text-blue-600 mb-2" />
            <h3 className="font-bold">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-blue-600 text-white">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <Link to="/admin" className="mt-4 inline-block bg-white text-blue-600 px-6 py-3 rounded-xl">
          Start Free
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white p-10 grid md:grid-cols-3 gap-6">
        {footerColumns.map((c, i) => (
          <div key={i}>
            <h4 className="font-bold mb-2">{c.title}</h4>
            {c.links.map((l) => (
              <p key={l} className="text-sm text-gray-400">{l}</p>
            ))}
          </div>
        ))}
      </footer>

      {/* MODAL */}
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}

    </div>
  );
};

export default Landing;
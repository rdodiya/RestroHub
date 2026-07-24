import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
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
  Sparkles,
  ArrowUp
} from 'lucide-react';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // show scroll top 
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { isDark, toggle } = useTheme();

  // ============================
  // SCROLL ANIMATION REFS
  // ============================
  const ownerStepRefs = useRef([]);
  const customerStepRefs = useRef([]);
  const ownerLineRef = useRef(null);
  const customerLineRef = useRef(null);

  useEffect(() => {
    const allRefs = [
      ...ownerStepRefs.current,
      ...customerStepRefs.current,
      ownerLineRef.current,
      customerLineRef.current,
    ].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            entry.target.classList.remove('animate-out');
          } else {
            entry.target.classList.add('animate-out');
            entry.target.classList.remove('animate-in');
          }
        });
      },
      { threshold: 0.2 }
    );

    allRefs.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ============================
  // DATA
  // ============================
  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];
  
  // active link state
  const [activeLink, setActiveLink] = useState("#");
  
  useEffect(() => {
    const ids = navLinks.map((link) => link.href.replace("#", ""));
    const obs = new IntersectionObserver((entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(`#${entry.target.id}`);
        }
      });
    }), { rootMargin: '-50% 0px -50% 0px' });

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  const handleWatchDemoClick = () => {
    const testimonialsSection = document.getElementById('testimonials');
    if (!testimonialsSection) return;

    setActiveLink('#testimonials');
    testimonialsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const features = [
    {
      icon: QrCode,
      title: 'QR Code Menus',
      desc: 'Generate unique QR codes for every table. Customers scan and browse your full menu instantly.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Smartphone,
      title: 'Mobile Ordering',
      desc: 'Receive live orders on your phone or dashboard. No more missed orders or manual errors.',
      color: 'bg-sky-100 text-sky-600',
    },
    {
      icon: CreditCard,
      title: 'UPI Payments',
      desc: 'Accept instant payments via any UPI app. Track every transaction in real time.',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Alerts',
      desc: 'Automated order confirmations, ready notifications, and daily reports via WhatsApp.',
      color: 'bg-teal-100 text-teal-600',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      desc: 'Revenue trends, top-selling items, peak hours, and customer insights at a glance.',
      color: 'bg-violet-100 text-violet-600',
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      desc: 'Serve your menu in English, Hindi, Gujarati, and more. Reach every customer.',
      color: 'bg-cyan-100 text-cyan-600',
    },
  ];

  // Restaurant Owner Steps
  const steps = [
    { num: '01', icon: UserPlus, title: 'Sign Up', desc: 'Create your free account in under 2 minutes.' },
    { num: '02', icon: QrCode, title: 'Add Your Menu', desc: 'Upload items, set prices, and generate QR codes.' },
    { num: '03', icon: ShoppingCart, title: 'Receive Orders', desc: 'Customers scan, order, and pay from their phone.' },
    { num: '04', icon: BarChart3, title: 'Grow Revenue', desc: 'Track analytics and optimize your business.' },
  ];

  // Customer Steps
  const customerSteps = [
    { num: '01', icon: QrCode, title: 'Scan QR Code', desc: 'Customer scans the unique QR code placed at their table.' },
    { num: '02', icon: Smartphone, title: 'Browse Menu', desc: 'Explore the full digital menu with photos and prices.' },
    { num: '03', icon: ShoppingCart, title: 'Add to Cart', desc: 'Select items and add them to cart with one tap.' },
    { num: '04', icon: CheckCircle2, title: 'Place Order', desc: 'Confirm and place the order directly from their phone.' },
    { num: '05', icon: MessageSquare, title: 'Live Updates', desc: 'Get real-time order status updates via WhatsApp.' },
    { num: '06', icon: CreditCard, title: 'Pay via UPI', desc: 'Pay instantly using any UPI app. Zero hassle.' },
  ];

const plans = [
  {
    name: 'Starter',
    price: '₹499',
    period: '/month',
    desc: 'Perfect for small restaurants',
    features: [
      '2 Branches',
      '15 Tables',
      '500 WhatsApp/month',
      'Basic Analytics',
      'Email Support'
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹999',
    period: '/month',
    desc: 'Best for growing businesses',
    features: [
      '5 Branches',
      'Unlimited Tables',
      '2000 WhatsApp/month',
      'Advanced Analytics',
      'Priority Support',
      'Custom Domain'
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For restaurant chains',
    features: [
      'Unlimited Everything',
      'Dedicated Manager',
      'Custom Integrations',
      'SLA Guarantee',
      '24/7 Phone Support',
      'On-site Training'
    ],
    popular: false,
  },
];
  const [selectedPlan, setSelectedPlan] = useState(
  plans.find(plan => plan.popular)?.name || plans[0].name
  );
const [contactForm, setContactForm] = useState({
    name: '', mobile: '', email: '', description: '',
  });
  const [contactStatus, setContactStatus] = useState(''); // '', 'sending', 'success', 'error'

  const handleContactChange = (e) =>
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('sending');
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
  service_id: "service_fgj8bx6" ,      // ← your actual Service ID
  template_id: "template_j3k2n5c",     // ← your actual Template ID
  user_id: "-Lly6B-CoO6THDld_",         // ← your actual Public Key
  template_params: {
    from_name: contactForm.name,
    mobile: contactForm.mobile,
    from_email: contactForm.email,
    message: contactForm.description,
  },
}),
      });
      if (res.ok) {
        setContactStatus('success');
        setContactForm({ name: '', mobile: '', email: '', description: '' });
      } else setContactStatus('error');
    } catch {
      setContactStatus('error');
    }
  };
  const testimonials = [
    {
      name: 'Ramesh Patel',
      role: 'Owner, Rajkot Dhaba',
      text: 'Restroly doubled our order efficiency. Customers love the QR menu and we love the zero-error billing!',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Manager, Café Bliss',
      text: 'The WhatsApp alerts are a game-changer. I know every order status without being in the kitchen.',
      rating: 5,
    },
    {
      name: 'Amit Kumar',
      role: 'Owner, Spice Garden',
      text: 'Setup took 10 minutes. We went live the same day. The analytics dashboard is incredibly useful.',
      rating: 5,
    },
  ];

  const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Testimonials', href: '#testimonials' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#features' },
      { label: 'Contact', href: '#testimonials' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  },
];

  const stats = [
    { value: '500+', label: 'Restaurants' },
    { value: '1.2M+', label: 'Orders Processed' },
    { value: '₹50Cr+', label: 'Revenue Tracked' },
    { value: '4.9', label: 'App Rating' },
  ];

  // ============================
  // RENDER
  // ============================
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 dark:text-slate-100">

      {/* ---- Scroll Animation Styles ---- */}
      <style>{`
        .step-item {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .step-item.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .step-item.animate-out {
          opacity: 0;
          transform: translateY(30px);
        }
        .flow-line {
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.9s ease;
        }
        .flow-line.animate-in {
          transform: scaleX(1);
        }
        .flow-line.animate-out {
          transform: scaleX(0);
        }
      `}</style>

      {/* adding scroll-up */}
      
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-300/40 transition-all hover:-translate-y-1 hover:bg-blue-700"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* ================================================ */}
      {/* NAVBAR                                           */}
      {/* ================================================ */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">

            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-200 sm:h-10 sm:w-10">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Restro<span className="text-blue-600">ly</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={`text-sm font-semibold transition-colors hover:text-blue-600 ${
                    activeLink === link.href ? 'text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-3 md:flex">
              {/* Theme Toggle */}
              <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Log In
              </Link>
              <Link
                to="/admin"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 pb-6 pt-2 dark:border-slate-700 dark:bg-slate-900 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
              <Link
                to="/login"
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
              >
                Log In
              </Link>
              <Link
                to="/admin"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ================================================ */}
      {/* HERO SECTION                                     */}
      {/* ================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-28 pb-16 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32">

        {/* Decorative Pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 sm:mb-8">
              <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
              Trusted by 5+ Restaurants across India
            </div>

            {/* Heading */}
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Your Restaurant,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Fully Digital
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-slate-600 dark:text-slate-300 sm:mt-8 sm:text-xl">
              QR code menus, instant UPI payments, WhatsApp order alerts, and
              powerful analytics — all in one beautiful platform.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row">
              <Link
                to="/admin"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-300/40 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300/50 sm:text-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={handleWatchDemoClick}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-300/40 transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 sm:text-lg"
              >
                <Play className="h-5 w-5 fill-white text-white transition-transform group-hover:scale-110" />
                Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-12">
              {['No credit card required', 'Setup in 5 minutes', 'Cancel anytime'].map(
                (text) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400"
                  >
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    {text}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* STATS BAR                                        */}
      {/* ================================================ */}
      {/* <section className="border-y border-slate-100 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-extrabold text-blue-600 sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ================================================ */}
      {/* FEATURES                                         */}
      {/* ================================================ */}
      <section id="features" className="bg-white py-20 dark:bg-slate-900 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Features
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Everything You Need to Go Digital
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Powerful tools designed specifically for Indian restaurants.
            </p>
          </div>

          {/* Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
              >
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}
                >
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* HOW IT WORKS                                     */}
      {/* ================================================ */}
      <section id="how-it-works" className="bg-slate-50 py-20 dark:bg-slate-800 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ---- Restaurant Owner Flow ---- */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              For Restaurant Owners
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Up and Running in Minutes
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Get your restaurant digital in just 4 simple steps.
            </p>
          </div>

          <div className="relative mt-16">
            {/* Animated connector line for owner flow */}
            <div
              ref={ownerLineRef}
              className="flow-line absolute top-10 left-[12%] right-[12%] hidden h-0.5 bg-blue-300 dark:bg-blue-600 lg:block"
            />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => (ownerStepRefs.current[i] = el)}
                  className="step-item relative text-center"
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-100 bg-white shadow-md dark:border-blue-800 dark:bg-slate-700">
                    <step.icon className="h-8 w-8 text-blue-600" />
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Customer Flow ---- */}
          <div className="mx-auto mt-24 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              For Customers
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Order in Seconds
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              A seamless experience from scan to payment.
            </p>
          </div>

          <div className="relative mt-16">
            {/* Animated connector line for customer flow */}
            <div
              ref={customerLineRef}
              className="flow-line absolute top-8 left-[5%] right-[5%] hidden h-0.5 bg-blue-300 dark:bg-blue-600 lg:block"
            />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
              {customerSteps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => (customerStepRefs.current[i] = el)}
                  className="step-item relative text-center"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-100 bg-white shadow-md dark:border-blue-800 dark:bg-slate-700">
                    <step.icon className="h-7 w-7 text-blue-600" />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================================================ */}
      {/* PRICING                                          */}
      {/* ================================================ */}
      <section id="pricing" className="bg-white py-20 dark:bg-slate-900 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Pricing
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Start free. No credit card required. Upgrade anytime.
            </p>
          </div>
  
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (

          <button
          key={i}
          type="button"
          onClick={() => setSelectedPlan(plan.name)}
          className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
          selectedPlan === plan.name
          ? 'z-10 scale-105 border-2 border-blue-600 bg-white shadow-2xl shadow-blue-200/50 dark:bg-slate-800'
          : 'border border-slate-200 bg-white shadow-sm hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-slate-700/50'
          }`}
          >
          {selectedPlan === plan.name && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.desc}</p>

                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <Check className="h-4 w-4 shrink-0 text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/admin"
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                    selectedPlan === plan.name
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
                  }`}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* TESTIMONIALS                                     */}
      {/* ================================================ */}
      <section id="testimonials" className="bg-slate-50 py-20 dark:bg-slate-800 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Testimonials
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Loved by Restaurant Owners
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-700"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array(t.rating)
                    .fill(0)
                    .map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                </div>

                <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-300">"{t.text}"</p>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-600">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* CTA SECTION                                      */}
      {/* ================================================ */}
      <section className="bg-white py-20 dark:bg-slate-900 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-10 text-center shadow-2xl shadow-blue-300/30 sm:p-16">
            <Sparkles className="mx-auto mb-6 h-10 w-10 text-blue-200" />
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Ready to Digitize Your Restaurant?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-blue-100/90">
              Join 5+ restaurants across India already using Restroly to
              serve customers faster.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/admin"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-lg transition-all hover:shadow-xl sm:text-lg"
              >
                Start Your Free Trial
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-blue-200/80">
              No credit card needed · Free forever plan available
            </p>
          </div>
        </div>
      </section>
      {/* ================================================ */}
      {/* CONTACT SECTION                                  */}
      {/* ================================================ */}
      <section id="contact" className="bg-slate-50 py-20 dark:bg-slate-800 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Contact Us
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={contactForm.mobile}
                  onChange={handleContactChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={contactForm.description}
                  onChange={handleContactChange}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleContactSubmit}
                disabled={contactStatus === 'sending'}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-60 dark:shadow-blue-900/40"
              >
                {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Feedback */}
              {contactStatus === 'success' && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Message sent! We'll get back to you soon.
                </div>
              )}
              {contactStatus === 'error' && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  ❌ Something went wrong. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* FOOTER                                           */}
      {/* ================================================ */}
      <footer className="border-t border-slate-200 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                  <UtensilsCrossed className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-white">
                  Restro<span className="text-blue-400">ly</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm text-slate-400">
                The all-in-one digital platform for modern Indian restaurants.
              </p>
            </div>

         {/* Link Columns */}
{footerColumns.map((col) => (
  <div key={col.title}>
    <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">
      {col.title}
    </h4>
    <ul className="space-y-3">
      {col.links.map((link) => (
        <li key={link.label}>
          {link.href.startsWith('/') ? (
            <Link
              to={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ) : (
            <a
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Restroly. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import { useState } from "react"
import { Link } from "react-router-dom"
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
} from "lucide-react"

const Landing = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // ============================
    // DATA
    // ============================
    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "Testimonials", href: "#testimonials" },
    ]

    const features = [
        {
            icon: QrCode,
            title: "QR Code Menus",
            desc: "Generate unique QR codes for every table. Customers scan and browse your full menu instantly.",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: Smartphone,
            title: "Mobile Ordering",
            desc: "Receive live orders on your phone or dashboard. No more missed orders or manual errors.",
            color: "bg-sky-100 text-sky-600",
        },
        {
            icon: CreditCard,
            title: "UPI Payments",
            desc: "Accept instant payments via any UPI app. Track every transaction in real time.",
            color: "bg-indigo-100 text-indigo-600",
        },
        {
            icon: MessageSquare,
            title: "WhatsApp Alerts",
            desc: "Automated order confirmations, ready notifications, and daily reports via WhatsApp.",
            color: "bg-teal-100 text-teal-600",
        },
        {
            icon: BarChart3,
            title: "Smart Analytics",
            desc: "Revenue trends, top-selling items, peak hours, and customer insights at a glance.",
            color: "bg-violet-100 text-violet-600",
        },
        {
            icon: Globe,
            title: "Multi-Language",
            desc: "Serve your menu in English, Hindi, Gujarati, and more. Reach every customer.",
            color: "bg-cyan-100 text-cyan-600",
        },
    ]

    const steps = [
        {
            num: "01",
            icon: UserPlus,
            title: "Sign Up",
            desc: "Create your free account in under 2 minutes.",
        },
        {
            num: "02",
            icon: QrCode,
            title: "Add Your Menu",
            desc: "Upload items, set prices, and generate QR codes.",
        },
        {
            num: "03",
            icon: ShoppingCart,
            title: "Receive Orders",
            desc: "Customers scan, order, and pay from their phone.",
        },
        {
            num: "04",
            icon: BarChart3,
            title: "Grow Revenue",
            desc: "Track analytics and optimize your business.",
        },
    ]

    const plans = [
        {
            name: "Starter",
            price: "₹499",
            period: "/month",
            desc: "Perfect for small restaurants",
            features: [
                "2 Branches",
                "15 Tables",
                "500 WhatsApp/month",
                "Basic Analytics",
                "Email Support",
            ],
            popular: false,
        },
        {
            name: "Professional",
            price: "₹999",
            period: "/month",
            desc: "Best for growing businesses",
            features: [
                "5 Branches",
                "Unlimited Tables",
                "2000 WhatsApp/month",
                "Advanced Analytics",
                "Priority Support",
                "Custom Domain",
            ],
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            desc: "For restaurant chains",
            features: [
                "Unlimited Everything",
                "Dedicated Manager",
                "Custom Integrations",
                "SLA Guarantee",
                "24/7 Phone Support",
                "On-site Training",
            ],
            popular: false,
        },
    ]

    const testimonials = [
        {
            name: "Ramesh Patel",
            role: "Owner, Rajkot Dhaba",
            text: "Restroly doubled our order efficiency. Customers love the QR menu and we love the zero-error billing!",
            rating: 5,
        },
        {
            name: "Priya Sharma",
            role: "Manager, Café Bliss",
            text: "The WhatsApp alerts are a game-changer. I know every order status without being in the kitchen.",
            rating: 5,
        },
        {
            name: "Amit Kumar",
            role: "Owner, Spice Garden",
            text: "Setup took 10 minutes. We went live the same day. The analytics dashboard is incredibly useful.",
            rating: 5,
        },
    ]

    const footerColumns = [
        {
            title: "Product",
            links: ["Features", "Pricing", "Integrations", "Changelog"],
        },
        { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
        {
            title: "Legal",
            links: ["Privacy Policy", "Terms of Service", "Refund Policy"],
        },
    ]

    const stats = [
        { value: "500+", label: "Restaurants" },
        { value: "1.2M+", label: "Orders Processed" },
        { value: "₹50Cr+", label: "Revenue Tracked" },
        { value: "4.9", label: "App Rating" },
    ]

    // ============================
    // RENDER
    // ============================
    return (
        <div className="min-h-screen bg-white">
            {/* ================================================ */}
            {/* NAVBAR                                           */}
            {/* ================================================ */}
            <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between sm:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-200 sm:h-10 sm:w-10">
                                <UtensilsCrossed className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                                Restro<span className="text-blue-600">ly</span>
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden items-center gap-8 md:flex">
                            {navLinks.map(link => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden items-center gap-3 md:flex">
                            <Link
                                to="/login"
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
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
                            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="border-t border-slate-100 bg-white px-4 pb-6 pt-2 md:hidden">
                        <div className="flex flex-col gap-1">
                            {navLinks.map(link => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
                            <Link
                                to="/login"
                                className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/admin"
                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm"
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
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32">
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
                        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 sm:mb-8">
                            <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                            Trusted by 5+ Restaurants across India
                        </div>

                        {/* Heading */}
                        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                            Your Restaurant,{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                Fully Digital
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-slate-600 sm:mt-8 sm:text-xl">
                            QR code menus, instant UPI payments, WhatsApp order
                            alerts, and powerful analytics — all in one
                            beautiful platform.
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
                            <button className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 sm:text-lg">
                                <Play className="h-5 w-5 fill-blue-600 text-blue-600" />
                                Watch Demo
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-12">
                            {[
                                "No credit card required",
                                "Setup in 5 minutes",
                                "Cancel anytime",
                            ].map(text => (
                                <span
                                    key={text}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500"
                                >
                                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                    {text}
                                </span>
                            ))}
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
            <section id="features" className="bg-white py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                            Features
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Everything You Need to Go Digital
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Powerful tools designed specifically for Indian
                            restaurants.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                            >
                                <div
                                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}
                                >
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900">
                                    {feature.title}
                                </h3>
                                <p className="leading-relaxed text-slate-600">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================ */}
            {/* HOW IT WORKS                                     */}
            {/* ================================================ */}
            <section id="how-it-works" className="bg-slate-50 py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                            How It Works
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Up and Running in Minutes
                        </h2>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, i) => (
                            <div key={i} className="relative text-center">
                                {/* Connector */}
                                {i < steps.length - 1 && (
                                    <div className="absolute top-10 hidden h-0.5 w-full left-1/2 bg-blue-200 lg:block" />
                                )}

                                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-100 bg-white shadow-md">
                                    <step.icon className="h-8 w-8 text-blue-600" />
                                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
                                        {step.num}
                                    </span>
                                </div>

                                <h3 className="mb-2 text-lg font-bold text-slate-900">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================ */}
            {/* PRICING                                          */}
            {/* ================================================ */}
            <section id="pricing" className="bg-white py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                            Pricing
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Start free. No credit card required. Upgrade
                            anytime.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
                                    plan.popular
                                        ? "z-10 scale-105 border-2 border-blue-600 bg-white shadow-2xl shadow-blue-200/50"
                                        : "border border-slate-200 bg-white shadow-sm hover:shadow-lg"
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-slate-900">
                                    {plan.name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {plan.desc}
                                </p>

                                <div className="my-6">
                                    <span className="text-4xl font-extrabold text-slate-900">
                                        {plan.price}
                                    </span>
                                    <span className="text-slate-500">
                                        {plan.period}
                                    </span>
                                </div>

                                <ul className="mb-8 flex-1 space-y-3">
                                    {plan.features.map((f, j) => (
                                        <li
                                            key={j}
                                            className="flex items-center gap-2.5 text-sm text-slate-700"
                                        >
                                            <Check className="h-4 w-4 shrink-0 text-blue-500" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/admin"
                                    className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                                        plan.popular
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700"
                                            : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                                >
                                    Get Started
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================ */}
            {/* TESTIMONIALS                                     */}
            {/* ================================================ */}
            <section id="testimonials" className="bg-slate-50 py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                            Testimonials
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Loved by Restaurant Owners
                        </h2>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
                            >
                                {/* Stars */}
                                <div className="mb-4 flex gap-1">
                                    {Array(t.rating)
                                        .fill(0)
                                        .map((_, j) => (
                                            <Star
                                                key={j}
                                                className="h-5 w-5 fill-amber-400 text-amber-400"
                                            />
                                        ))}
                                </div>

                                <p className="mb-6 leading-relaxed text-slate-600">
                                    "{t.text}"
                                </p>

                                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {t.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {t.role}
                                        </p>
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
            <section className="bg-white py-20 sm:py-28">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-10 text-center shadow-2xl shadow-blue-300/30 sm:p-16">
                        <Sparkles className="mx-auto mb-6 h-10 w-10 text-blue-200" />
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                            Ready to Digitize Your Restaurant?
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-lg text-blue-100/90">
                            Join 5+ restaurants across India already using
                            Restroly to serve customers faster.
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
                                    Restro
                                    <span className="text-blue-400">ly</span>
                                </span>
                            </Link>
                            <p className="mt-4 max-w-xs text-sm text-slate-400">
                                The all-in-one digital platform for modern
                                Indian restaurants.
                            </p>
                        </div>

                        {/* Link Columns */}
                        {footerColumns.map(col => (
                            <div key={col.title}>
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">
                                    {col.title}
                                </h4>
                                <ul className="space-y-3">
                                    {col.links.map(link => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                className="text-sm text-slate-400 transition-colors hover:text-white"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} Restroly. All rights
                            reserved.
                        </p>
                        <p className="text-sm text-slate-500">
                            Made with ❤️ in India
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing

// src/pages/Landing.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaChartLine,
  FaWallet,
  FaBolt,
  FaCheckCircle,
  FaBars,
  FaTimes,
  FaBox,
  FaCreditCard,
} from "react-icons/fa";

const Button = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  Icon,
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 hover:shadow-md",
  };

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        }),
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.05,
      }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

const useEnhancedSlider = ({ slideCount, interval = 6000 }) => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef(null);
  const touchStartX = useRef(0);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      next();
    }, interval);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const goTo = (newIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const next = () => goTo((index + 1) % slideCount);
  const prev = () => goTo((index - 1 + slideCount) % slideCount);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoplay();
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    startAutoplay();
  };

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    index,
    goTo,
    next,
    prev,
    startAutoplay,
    stopAutoplay,
    handleTouchStart,
    handleTouchEnd,
  };
};

const Slide = ({ title, body, isActive, direction }) => (
  <div
    className={`w-full flex-shrink-0 p-8 md:p-12 transition-all duration-700 ${
      isActive
        ? "opacity-100 translate-x-0"
        : direction === "next"
        ? "opacity-0 translate-x-full"
        : "opacity-0 -translate-x-full"
    }`}
  >
    <div
      className={`bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-100 transition-all duration-500 ${
        isActive ? "scale-100" : "scale-95"
      }`}
    >
      <div className="h-1.5 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6" />
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
        {title}
      </h2>
      <p className="text-slate-600 text-lg md:text-xl">{body}</p>
    </div>
  </div>
);

const Landing = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Turn your work into on‑chain reputation",
      body: "Karma Passport converts every verified task and delivery into a portable credit identity you own.",
    },
    {
      title: "Instant micro‑loans based on Karma Score",
      body: "No payslips, no CIBIL. Your AI‑powered Karma Score unlocks fair, transparent micro‑credit on Ethereum.",
    },
    {
      title: "Better terms as your reputation grows",
      body: "Higher scores mean lower interest, higher limits and longer tenures — fully data‑driven.",
    },
    {
      title: "One passport, many apps",
      body: "Use the same reputation across lenders, employers and platforms without re‑KYC every time.",
    },
  ];

  const {
    index,
    goTo,
    next,
    prev,
    startAutoplay,
    stopAutoplay,
    handleTouchStart,
    handleTouchEnd,
  } = useEnhancedSlider({ slideCount: slides.length });

  useScrollReveal();

  const handleDemoLogin = () => {
    const demoUser = {
      id: "demo-worker-1",
      name: "Demo Worker",
      email: "demo@worker.com",
      role: "worker",
    };
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("isAuthenticated", "true");
    navigate("/dashboard");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleParallax = () => {
      const rate = window.pageYOffset * 0.2;
      hero.style.transform = `translateY(${rate}px)`;
    };
    window.addEventListener("scroll", handleParallax);
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* soft background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-gradient-to-b from-white/80 to-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-md">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
                  Karma Passport
                </p>
                <p className="text-[11px] text-slate-500">
                  AI Reputation & Micro‑Loans
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm">
              <a
                href="#features"
                className="text-slate-600 hover:text-blue-600 font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-600 hover:text-blue-600 font-medium"
              >
                How it works
              </a>
              <a
                href="#benefits"
                className="text-slate-600 hover:text-blue-600 font-medium"
              >
                For workers
              </a>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/login")}
                Icon={FaWallet}
              >
                Login / Sign up
              </Button>
            </div>

            <button
              className="md:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden pb-4 border-t border-slate-200 animate-slideDown">
              <div className="flex flex-col gap-3 pt-3">
                <a
                  href="#features"
                  className="text-slate-700 hover:text-blue-600 px-2 py-2 rounded-lg hover:bg-slate-50"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-slate-700 hover:text-blue-600 px-2 py-2 rounded-lg hover:bg-slate-50"
                >
                  How it works
                </a>
                <a
                  href="#benefits"
                  className="text-slate-700 hover:text-blue-600 px-2 py-2 rounded-lg hover:bg-slate-50"
                >
                  For workers
                </a>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/login")}
                  Icon={FaWallet}
                >
                  Login / Sign up
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section
        ref={heroRef}
        id="hero"
        className="pt-32 md:pt-40 pb-28 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-5">
              <FaBolt className="w-3.5 h-3.5" />
              On‑chain reputation for workers & gig talent
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight reveal-on-scroll">
              Convert your work history into a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                credit passport
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 reveal-on-scroll">
              Karma Passport connects verified work logs, ratings and repayments
              to build an AI‑powered score that unlocks micro‑loans and fair
              financial access on Ethereum.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-on-scroll">
              <Button onClick={handleDemoLogin} Icon={FaCheckCircle}>
                Demo login as worker
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                Icon={FaWallet}
              >
                Continue to app
              </Button>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              No real money. This is a hackathon demo – all scores and loans are
              mocked.
            </p>
          </div>

          {/* quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {[
              {
                icon: FaShieldAlt,
                value: "10,000+",
                label: "Worker profiles simulated",
              },
              {
                icon: FaChartLine,
                value: "92%",
                label: "On‑time repayment (demo dataset)",
              },
              {
                icon: FaCreditCard,
                value: "₹15,000",
                label: "Max mock limit for Gold tier",
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="reveal-on-scroll bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Slider */}
          <div className="max-w-6xl mx-auto reveal-on-scroll">
            <div
              className="relative overflow-hidden rounded-[2.2rem] shadow-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100"
              onMouseEnter={stopAutoplay}
              onMouseLeave={startAutoplay}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
        
              <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-3">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="relative"
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full transition-all ${
                        index === i
                          ? "bg-blue-600 w-5"
                          : "bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={prev}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-slate-700 shadow hover:bg-slate-50 items-center justify-center"
              >
                {"‹"}
              </button>
              <button
                onClick={next}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-slate-700 shadow hover:bg-slate-50 items-center justify-center"
              >
                {"›"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <FaBolt className="w-3.5 h-3.5" />
              Built for gig & knowledge workers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-3">
              One reputation layer, many use‑cases
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-sm md:text-base">
              Karma Passport natively blends on‑chain identity, AI scoring and
              simple dashboards so you can prove reliability anywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: "On‑chain identity",
                desc: "Non‑transferable Passport NFT that carries your score, tiers and history across apps.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: FaChartLine,
                title: "AI Karma Score",
                desc: "Model ingests work frequency, ratings, repayments and wallet age to compute risk.",
                color: "from-indigo-500 to-indigo-600",
              },
              {
                icon: FaCreditCard,
                title: "Instant micro‑credit",
                desc: "Mock loan flows that update limits and interest in real time so judges see real UX.",
                color: "from-emerald-500 to-emerald-600",
              },
              {
                icon: FaBox,
                title: "Work log ingestion",
                desc: "Delivery proofs, shift logs and tasks are captured via simple forms and QR flows.",
                color: "from-orange-500 to-orange-600",
              },
              {
                icon: FaBolt,
                title: "Live dashboards",
                desc: "Score, loans and tasks visualized with simple charts – no external libraries.",
                color: "from-yellow-500 to-yellow-600",
              },
              {
                icon: FaCheckCircle,
                title: "Judge‑friendly API story",
                desc: "Every card on the UI maps cleanly to future /api endpoints for ML & contracts.",
                color: "from-cyan-500 to-cyan-600",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="reveal-on-scroll bg-white rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-xl transition-all p-6 flex flex-col"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-r ${f.color} text-white flex items-center justify-center mb-4`}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              From work log to loan in 4 steps
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-sm md:text-base">
              For the hackathon demo, all flows are mocked – but each step maps
              1:1 to backend and AI services your team is building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Connect wallet / login",
                desc: "User logs in, later can connect Ethereum wallet to mint a Passport NFT.",
                icon: "🔐",
              },
              {
                step: "02",
                title: "Log work & deliveries",
                desc: "Submit work proofs via “Submit Work” & “Log Delivery Proof” forms.",
                icon: "📦",
              },
              {
                step: "03",
                title: "Score refresh",
                desc: "AI service computes a new Karma Score and pushes it on‑chain + UI.",
                icon: "📈",
              },
              {
                step: "04",
                title: "Borrow & repay",
                desc: "Instant loan UI checks score threshold, calculates interest and mocks payout.",
                icon: "💰",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="reveal-on-scroll bg-white rounded-2xl border border-slate-200 p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg">
                    {s.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 flex-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / CTA */}
      <section
        id="benefits"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal-on-scroll">
            <p className="text-xs font-semibold tracking-wide mb-3 opacity-80">
              WHY KARMA PASSPORT
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Financial access that follows your work,
              <br className="hidden md:block" /> not your salary slip.
            </h2>
            <p className="text-sm md:text-base text-blue-100 mb-7">
              Students, freelancers and gig workers rarely fit into traditional
              scoring systems. Karma Passport lets them prove reliability with
              real work and repayment behaviour instead.
            </p>
            <ul className="space-y-3 text-sm text-blue-100">
              <li className="flex gap-2">
                <FaCheckCircle className="mt-0.5 text-emerald-300" />
                Ownable, portable reputation across apps and lenders.
              </li>
              <li className="flex gap-2">
                <FaCheckCircle className="mt-0.5 text-emerald-300" />
                Lower interest and higher limits as score improves.
              </li>
              <li className="flex gap-2">
                <FaCheckCircle className="mt-0.5 text-emerald-300" />
                No real KYC in demo – perfect for hackathon judging.
              </li>
            </ul>
          </div>

          <div className="reveal-on-scroll">
            <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl max-w-md ml-auto">
              <h3 className="text-xl font-bold mb-2">
                Try the worker experience
              </h3>
              <p className="text-sm text-slate-600 mb-5">
                One click demo login drops judges straight into the live
                dashboard with Karma Score, tasks, logs and loan flows.
              </p>

              <Button
                className="w-full mb-3"
                onClick={handleDemoLogin}
                Icon={FaCheckCircle}
              >
                Open demo dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => navigate("/login")}
                Icon={FaWallet}
              >
                Login as real user
              </Button>

              <p className="text-[11px] text-slate-500">
                For production, this card becomes the real onboarding flow with
                wallet connect, platform linking and consent screens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">Karma Passport</span>
            <span className="text-slate-500">· Hackathon demo build</span>
          </div>
          <div className="flex gap-4 text-slate-400">
            <span>Docs (coming soon)</span>
            <span>GitHub</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-lg transition-all ${
          scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        ↑
      </button>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.25s ease-out forwards; }
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .6s ease-out, transform .6s ease-out;
        }
        .reveal-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default Landing;

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./lib/auth/AuthContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // If user is authenticated, don't show landing page
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Enhanced Header with Login/Signup buttons */}
      <header className="flex items-center justify-between py-6 px-8 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Smartistics
          </span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#services" className="hover:text-blue-600 transition-colors">
            Services
          </a>
          <a href="#about" className="hover:text-blue-600 transition-colors">
            About
          </a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="px-8 text-center py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                🚀 Advanced Analytics Platform
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  Cut the Guesswork.
                </span>
              </h1>

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-snug">
                Discover which platforms actually bring customers to your
                business
              </h2>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get smart advertising analytics from a platform built
                specifically for your business. Track ROI across Facebook,
                Google, Instagram, TikTok, and more – all in one mobile-first
                dashboard that speaks your language.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/mailinglist")}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                Join Our Waitlist 🎯
              </button>

              <button
                onClick={() => router.push("/login")}
                className="border-2 border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                View Demo
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 pt-8">
              <p className="text-sm text-gray-500 font-medium">
                Trusted by leading brands:
              </p>
              {["Safaricom", "M-Pesa", "Airtel", "Moringa School"].map(
                (brand) => (
                  <span
                    key={brand}
                    className="text-gray-400 text-lg font-semibold hover:text-gray-600 transition-colors"
                  >
                    {brand}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <video
                src="https://www.coupler.io/images/FIN-constant-bitrate-1MB-30fps.webm"
                autoPlay
                loop
                muted
                playsInline
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover border-4 border-white"
                title="Digital Marketing Analytics Dashboard Demo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}

      {/* Services Section */}
      <section id="services" className="py-20">
        <Services />
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <CallToAction />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

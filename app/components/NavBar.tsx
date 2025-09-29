"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const NavBar = () => {
  const [shadow, setShadow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShadow(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-5 z-10 rounded-full px-4 py-3 transition-all duration-500
        ${
          shadow
            ? "bg- [rgb(255,255,255)] dark:bg-white backdrop-blur-md shadow-md border-0.5"
            : "bg-[rgb(255,255,255)] backdrop-blur-0 shadow-none"
        }
      `}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black mr-25">
          Smartistics
        </Link>

        {/* Burger menu button */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-black mb-1 transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-black mb-1 transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-1 " : ""
            }`}
          />
        </button>

        {/* Desktop menu */}
        <div className="hidden lg:flex gap-8">
          <Link
            href="/"
            className="text-black hover:underline hover:animate-bounce h-8.5"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-black hover:underline hover:animate-bounce h-8.5"
          >
            Dashboard
          </Link>
          <Link
            href="/products"
            className="text-black hover:underline hover:animate-bounce h-8.5"
          >
            Our Products
          </Link>
          <Link
            href="/about"
            className="text-black hover:underline hover:animate-bounce h-8.5"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-black hover:underline hover:animate-bounce h-8.5"
          >
            Contact Us
          </Link>
          <Link
            href="/pricing"
            className="text-black hover:underline hover:animate-bounce h-8.5"
          >
            Pricing
          </Link>
        </div>

        <div className="hidden lg:flex ml-25">
          {/* Authentication buttons */}{" "}
          <ClerkProvider>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </ClerkProvider>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden mt-4 rounded-2xl shadow-lg bg-white py-4 px-6 flex flex-col gap-4 absolute left-0 right-0 mx-4 top-full z-20">
          <Link href="/" className="text-black hover:underline">
            Home
          </Link>
          <Link href="/dashboard" className="text-black hover:underline">
            Dashboard
          </Link>
          <Link href="/products" className="text-black hover:underline">
            Our Products
          </Link>
          <Link href="/about" className="text-black hover:underline">
            About Us
          </Link>
          <Link href="/contact" className="text-black hover:underline">
            Contact Us
          </Link>
          <Link href="/pricing" className="text-black hover:underline">
            Pricing
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

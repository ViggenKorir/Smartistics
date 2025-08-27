"use client";
import React from "react";

const Header = () => (
  <header className="flex items-center justify-between py-6 px-8 bg-white rounded-t-2xl">
    <div className="flex items-center gap-2">
      <span className="font-bold text-lg">WizardZ</span>
    </div>
    <nav className="flex gap-8 text-sm">
      <a href="#" className="hover:underline">About us</a>
      <a href="#" className="hover:underline">Services</a>
      <a href="#" className="hover:underline">Use Cases</a>
      <a href="#" className="hover:underline">Pricing</a>
      <a href="#" className="hover:underline">Blog</a>
    </nav>
    <button className="border rounded-full px-4 py-2 font-medium text-sm bg-black text-white hover:bg-gray-800">Request a quote</button>
  </header>
);

export default Header;

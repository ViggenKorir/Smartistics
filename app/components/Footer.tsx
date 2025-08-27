"use client";
import React from "react";

const Footer = () => (
  <footer className="bg-black text-white py-10 px-8 rounded-t-4xl mt-12">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-bold text-lg mb-2">WizardZ</h3>
        <p className="text-gray-400 text-sm mb-4">Navigating the digital landscape for success.</p>
        <div className="flex gap-3 mt-2">
          <a href="#" aria-label="Twitter" className="hover:text-lime-400"><svg width="20" height="20" fill="currentColor"><circle cx="10" cy="10" r="10"/></svg></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-lime-400"><svg width="20" height="20" fill="currentColor"><rect x="3" y="3" width="14" height="14"/></svg></a>
          <a href="#" aria-label="Instagram" className="hover:text-lime-400"><svg width="20" height="20" fill="currentColor"><ellipse cx="10" cy="10" rx="8" ry="6"/></svg></a>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Company</h4>
        <ul className="space-y-1 text-sm text-gray-400">
          <li><a href="#" className="hover:text-lime-400">About us</a></li>
          <li><a href="#" className="hover:text-lime-400">Careers</a></li>
          <li><a href="#" className="hover:text-lime-400">Blog</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Services</h4>
        <ul className="space-y-1 text-sm text-gray-400">
          <li><a href="#" className="hover:text-lime-400">SEO</a></li>
          <li><a href="#" className="hover:text-lime-400">PPC</a></li>
          <li><a href="#" className="hover:text-lime-400">Social Media</a></li>
          <li><a href="#" className="hover:text-lime-400">Email Marketing</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Contact</h4>
        <ul className="space-y-1 text-sm text-gray-400">
          <li>Email: <a href="mailto:info@wizardz.com" className="hover:text-lime-400">info@wizardz.com</a></li>
          <li>Phone: <a href="tel:+254721164181" className="hover:text-lime-400">+254 721 164 181</a></li>
          <li>Location: Nairobi, Kenya</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs">
      &copy; {new Date().getFullYear()} WizardZ. All rights reserved.
    </div>
  </footer>
);

export default Footer;

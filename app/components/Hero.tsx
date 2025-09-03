"use client";
import React from "react";

const Hero = () => {
  // Debugging: Log rendering of Hero component
  console.log("Rendering Hero component");
  
  return (
    <section className="px-8 text-center">
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-6xl font-extrabold mb-0">
             Cut the Guesswork. </h1>
          
          <span><h1 className="text-4xl font-bold mb-6">
            <br /> Discover which platforms actually bring customers to your
            business
          </h1></span>
         
          <p className="mb-8 text-gray-700 max-w-xl mx-auto">
            Get smart advertising analytics from a platform built
            specifically for your business. Track ROI across Facebook,
            Google, Instagram, TikTok, and more – all in one mobile-first
            dashboard that speaks your language.
          </p>
          {/* <button className="bg-emerald-900 text-white font-extrabold border px-16 py-4 rounded-tr-full rounded-br-full rounded-bl-full hover:bg-emerald-800 hover:text-white hover:border animate-bounce">
            Start Free 14-Day Trial
          </button> */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/mailinglist";
            }}
          className="bg-emerald-900 text-white font-extrabold border px-16 py-4 rounded-tr-full rounded-br-full rounded-bl-full hover:bg-emerald-800 hover:text-white hover:border animate-bounce"
          >
            Join Our Waitlist
          </button>
          {/* <button className="bg-[rgba(130, 182, 62, 0.9)] text-black border px-16 py-4 rounded-full font-medium hover:bg-black hover:text-white hover:border ml-7.5 animate-bounce ">
        Get a quotation
      </button> */}
        </div>

        <div>
          <div className="flex justify-center items-center bg-transparent">
            <video
              src="https://www.coupler.io/images/FIN-constant-bitrate-1MB-30fps.webm"
              autoPlay
              loop
              muted
              playsInline
              className="mx-auto rounded-2xl shadow-none w-full max-w-lg h-auto object-cover bg-blend-overlay ml-5.5"
              style={{ background: "rgba(255,255,255,0.05)" }}
              title="Digital Marketing Overview Video source-coupler.io"
            />
          </div>
        </div>
        
      </div>
      <br />
      <div className="flex flex-wrap justify-center items-center gap-6">
        <p>Our Clients:</p>
        {["Safaricom", "Kytabu", "M-Pesa", "Airtel", "Moringa School", "Glovo"].map(
          (brand) => (
            <span key={brand} className="text-gray-500 text-lg font-semibold">
              {brand}
            </span>
          )
        )}
      </div>
    </section>
  );
};

export default Hero;

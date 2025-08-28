"use client";
import React from "react";

const services = [
  {
    title: "AI Search engine optimization & AI Integration",
    description: "Learn more",
    highlight: true,
  },
  {
    title: "Pay per click advertising",
    description: "Learn more",
    highlight: false,
  },
  {
    title: "Social media marketing",
    description: "Learn more",
    highlight: false,
  },
  {
    title: "E-mail marketing",
    description: "Learn more",
    highlight: true,
  },
];

const Services = () => (
  <section className="py-12 px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
     <div className="flex justify-center items-center bg-transparent">
    <img
      src="https://cdn.prod.website-files.com/64dc619021257128d0687cce/6581b9cd835803fe27ce3ad3_social-media-6363633_1920-p-1080.webp"
      className="mx-auto rounded-2xl shadow-xl w-full max-w-lg h-auto object-cover bg-blend-overlay"
      style={{ background: "rgba(255,255,255,0.05)" }}
      alt="Digital Marketing Services: img source-highperformr"
      title="Digital Marketing Services: img source-highperformr"
    />
    
  </div>
    <div>
    <h2 className="text-xl font-bold mb-2 text-lime-500">Services</h2>
    <p className="mb-8 text-gray-700 max-w-xl">
      At our digital marketing agency, we offer a range of services to help businesses grow and succeed online. These services include:
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service, idx) => (
        <div key={service.title} className={`rounded-xl p-6 border ${service.highlight ? 'bg-white border-lime-500 border-2' : 'bg-black text-white'}`}>
          <h3 className={`font-bold mb-2 ${service.highlight ? 'text-lime-500' : ''}`}>{service.title}</h3>
          <a href="#" className="underline text-sm">{service.description}</a>
        </div>
      ))}
    </div>
    </div>
  </section>
);

export default Services;

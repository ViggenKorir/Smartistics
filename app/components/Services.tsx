"use client";
import React from "react";
import Image from "next/image";

const services = [
  {
    title: "AI Search engine optimization & AI Integration",
    description:
      "Optimize your website's search engine rankings and integrate AI-powered features to enhance user experience.",
    link: "Learn more",
    highlight: true,
  },
  {
    title: "ROI Tracking",
    description: "Track your marketing campaigns' return on investment.",
    link: "Learn more",
    highlight: false,
  },
  {
    title: "Social media marketing",
    description: "Grow your brand's presence on social media platforms.",
    link: "Learn more",
    highlight: false,
  },
  {
    title: "E-mail marketing",
    description: "Build and engage with your email list.",
    link: "Learn more",
    highlight: true,
  },
];

const Services = () => (
  <section className="py-12 px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left side - Image */}
    <div className="flex justify-center items-center bg-transparent">
      <Image
        src="https://cdn.prod.website-files.com/64dc619021257128d0687cce/6581b9cd835803fe27ce3ad3_social-media-6363633_1920-p-1080.webp"
        alt="Digital Marketing Services: img source-highperformr"
        title="Digital Marketing Services: img source-highperformr"
        width={500}
        height={350}
        className="mx-auto rounded-2xl shadow-xl w-full max-w-lg h-auto object-cover bg-blend-overlay"
      />
    </div>

    {/* Right side - Services List */}
    <div>
      <h2 className="text-xl font-bold mb-2 text-lime-500">Services</h2>
      <p className="mb-8 text-gray-700 max-w-xl">
        At our digital marketing agency, we offer a range of services to help
        businesses grow and succeed online. These services include:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.title}
            className={`rounded-xl p-6 border ${
              service.highlight
                ? "bg-white border-lime-700 border-2"
                : "bg-black text-white"
            }`}
          >
            <h3
              className={`font-bold mb-2 ${
                service.highlight ? "text-black" : ""
              }`}
            >
              {service.title}
            </h3>
            <a href="#" className="text-sm">
              {service.description}
            </a>
            <br />
            <h4>
              <a href="#" className="underline text-sm mt-1.5">
                {service.link}
              </a>
            </h4>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;

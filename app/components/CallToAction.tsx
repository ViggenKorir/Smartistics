"use client";
import React from "react";
import Image from "next/image";

const CallToAction = () => (
  <section className="py-10 px-8 bg-gray-100 rounded-xl my-8 text-center grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Text Section */}
    <div className="flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-3">
        Let&apos;s make things happen
      </h2>
      <p className="mb-5 text-gray-700 max-w-xl mx-auto">
        Contact us today to learn more about how our digital marketing services
        can help your business grow and succeed online.
      </p>
      <button
        className="bg-black text-white px-6 py-3 w-fit mx-auto rounded-full font-medium hover:bg-gray-800 transition"
      >
        Get your free proposal
      </button>
    </div>

    {/* Image Section */}
    <div className="flex justify-center items-center">
      <Image
        src="https://res.cloudinary.com/dgu9ietkl/image/upload/v1756388889/effectiveness-of-social-media-platforms_xyfgef.webp"
        alt="Graph showing effectiveness of different social media platforms"
        width={500}
        height={350}
        className="rounded-2xl shadow-xl object-cover"
      />
    </div>
  </section>
);

export default CallToAction;

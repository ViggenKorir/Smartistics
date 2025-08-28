"use client";
import Mailing from "../components/Mailing";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function MailingPage() {
  return (
    <>
      <div className="items-center justify-items-center">
        <NavBar />
        <Mailing />
      </div>
      <Footer />
    </>
  );
}
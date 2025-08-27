import NavBar from "./components/NavBar";
import Dashboard from "./components/DashBoard";
import CallToAction from "./components/CallToAction";
import CaseStudy from "./components/CaseStudy";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuickLinks from "./components/QuickLinks";
import Services from "./components/Services";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <div className="  justify-items-center  ">
        <NavBar />
        <Hero />
        {/* <Header /> */}
        <QuickLinks />
        <Services />
        <CallToAction />
        <CaseStudy />
</div>
        
      {/* </div> */}
      <Footer />
      {/* <Dashboard /> */}
    </>
  );
}

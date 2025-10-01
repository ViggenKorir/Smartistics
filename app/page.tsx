import NavBar from "./components/NavBar";
// import Dashboard from "./components/DashBoard";
import CallToAction from "./components/CallToAction";
import CaseStudy from "./components/CaseStudy";
// import Header from "./components/Header";
import Hero from "./components/Hero";
import QuickLinks from "./components/QuickLinks";
import Services from "./components/Services";
import Mailing from "./components/Mailing";
import Footer from "./components/Footer";
import AnalyticsDashboard from "./components/Analytics";

export default function Home() {
  return (
    <>
      <div className="justify-items-center">
        <NavBar />
        <Hero />
        <QuickLinks />
        <section
          id="features"
          className="py-20 px-8 bg-white/50 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Smartistics?
            </h2>
            <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
              Our platform provides comprehensive analytics and insights to help
              you make data-driven decisions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Real-time Analytics
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get instant insights into your campaign performance with live
                  data updates and comprehensive reporting.
                </p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  ROI Tracking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Track return on investment across all platforms with precision
                  and make informed budget decisions.
                </p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  AI-Powered Insights
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Leverage machine learning to discover hidden patterns and
                  optimize your marketing strategies automatically.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Services />
        <CallToAction />
        <CaseStudy />
      </div>
      <AnalyticsDashboard/>
      <Mailing />
      <Footer />
    </>
  );
}

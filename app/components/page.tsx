"use client";

import React from "react";
import Link from "next/link";

const ComponentsIndexPage: React.FC = () => {
  const components = [
    {
      id: "payment",
      name: "Payment Methods",
      description: "Multi-payment gateway component with Card, M-Pesa & PayPal support",
      href: "/components/payment",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      features: [
        "Credit/Debit Card Processing",
        "M-Pesa Mobile Money Integration",
        "PayPal Payment Gateway",
        "Real-time Form Validation",
        "Input Formatting & Masking",
        "Currency Conversion",
        "Security & Encryption",
        "Responsive Design"
      ],
      color: "blue",
      stats: {
        methods: "3",
        validation: "Real-time",
        security: "Encrypted"
      }
    },
    {
      id: "subscription",
      name: "Subscription Management",
      description: "Smart subscription notices with role-based visibility and progressive warnings",
      href: "/components/subscription",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      features: [
        "Role-based Notice Visibility",
        "Progressive Warning Stages",
        "Account Lockout Management",
        "Auto-refresh Subscription Status",
        "Dismissible Notifications",
        "Modal Dialog Support",
        "Action Callbacks",
        "TypeScript Integration"
      ],
      color: "purple",
      stats: {
        roles: "6",
        stages: "4",
        tiers: "3"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Smartistics
              <span className="block text-2xl md:text-3xl font-normal text-blue-100 mt-2">
                Component Library
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Production-ready React components for payment processing and subscription management.
              Built with TypeScript, Tailwind CSS, and modern best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/components/payment"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Try Payment Demo
              </Link>
              <Link
                href="/components/subscription"
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Try Subscription Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Component Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Interactive Component Demos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our fully functional components with live demos, code examples,
            and comprehensive documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {components.map((component) => (
            <div
              key={component.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${
                component.color === 'blue'
                  ? 'from-blue-500 to-blue-600'
                  : 'from-purple-500 to-purple-600'
              } p-8 text-white`}>
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                    {component.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{component.name}</h3>
                    <p className="text-blue-100 opacity-90">{component.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(component.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold">{value}</div>
                      <div className="text-sm opacity-80 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                <ul className="space-y-3 mb-8">
                  {component.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full ${
                        component.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                      } flex items-center justify-center mr-3 mt-0.5`}>
                        <svg
                          className={`w-3 h-3 ${
                            component.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={component.href}
                  className={`inline-flex items-center justify-center w-full px-6 py-3 ${
                    component.color === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  } font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg`}
                >
                  <span>View Interactive Demo</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specs */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
            <p className="text-gray-600">Built with modern technologies and best practices</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "React 18+", icon: "⚛️", description: "Latest React features" },
              { name: "TypeScript", icon: "📘", description: "Full type safety" },
              { name: "Tailwind CSS", icon: "🎨", description: "Utility-first styling" },
              { name: "Next.js 14", icon: "▲", description: "App Router support" },
            ].map((tech) => (
              <div key={tech.name} className="text-center">
                <div className="text-4xl mb-3">{tech.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
            <p className="text-gray-300">Get started with these components in your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Payment Components</h3>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
{`import PaymentMethods from './PaymentMethods';

function Checkout() {
  const [method, setMethod] = useState('card');
  const [data, setData] = useState(null);

  return (
    <PaymentMethods
      selectedMethod={method}
      onMethodChange={setMethod}
      onPaymentDataChange={setData}
      amount={29.99}
      currency="USD"
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Subscription Components</h3>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
{`import {
  SubscriptionProvider,
  SubscriptionNotice
} from './subscription';

function App() {
  return (
    <SubscriptionProvider>
      <SubscriptionNotice />
      <YourAppContent />
    </SubscriptionProvider>
  );
}`}
              </pre>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-300 mb-4">Ready to integrate? Check out our interactive demos!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/components/payment"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Payment Demo
              </Link>
              <Link
                href="/components/subscription"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Subscription Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsIndexPage;

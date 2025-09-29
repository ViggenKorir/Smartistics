"use client";

import React from "react";
import Image from "next/image";
import { IVendor, ISignature } from "../../lib/types/invoice";

interface InvoiceFooterProps {
  vendor: IVendor;
  termsAndConditions: string;
  signature: ISignature;
}

const InvoiceFooter: React.FC<InvoiceFooterProps> = ({
  vendor,
  termsAndConditions,
  signature,
}) => {
  return (
    <div className="mt-12 space-y-8">
      {/* Payment Info and Terms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Info
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Account No:</span>{" "}
              {vendor.accountNumber}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {vendor.bankName}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Bank Branch:</span>{" "}
              {vendor.bankBranch}
            </p>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Terms and Conditions
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {termsAndConditions}
          </p>
        </div>
      </div>

      {/* Signature Section */}
      <div className="flex justify-between items-end pt-8 border-t border-gray-200">
        <div className="flex-1">
          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                {vendor.phone.map((phone, index) => (
                  <p key={index}>{phone}</p>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p>{vendor.address}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p>{vendor.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                  />
                </svg>
                <p>{vendor.website}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="text-center ml-8">
          {signature.image ? (
            <Image
              src={signature.image}
              alt={`${signature.name} signature`}
              width={120}
              height={64}
              className="h-16 w-auto mx-auto mb-2"
            />
          ) : (
            <div className="h-16 flex items-end justify-center mb-2">
              <div className="italic text-gray-500 text-lg font-script">
                {signature.name}
              </div>
            </div>
          )}
          <div className="border-t border-gray-300 pt-2">
            <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              {signature.name}
            </p>
            <p className="text-xs text-gray-600 mt-1">{signature.title}</p>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden mt-8 pt-6 border-t border-gray-200">
        <div className="text-center space-y-4">
          <div>
            <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              {signature.name}
            </p>
            <p className="text-xs text-gray-600">{signature.title}</p>
          </div>

          <div className="space-y-2 text-xs text-gray-600">
            {vendor.phone.map((phone, index) => (
              <p key={index}>{phone}</p>
            ))}
            <p>{vendor.email}</p>
            <p>{vendor.website}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;

"use client";

import React, { useState } from "react";

export type PaymentMethod = "card" | "mpesa" | "paypal";

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  onPaymentDataChange: (data: PaymentData) => void;
  amount: number;
  currency: string;
}

export interface PaymentData {
  method: PaymentMethod;
  isValid: boolean;
  data: CardData | MpesaData | PaypalData;
}

interface CardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface MpesaData {
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

interface PaypalData {
  email: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodChange,
  onPaymentDataChange,
  amount,
  currency,
}) => {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [mpesaData, setMpesaData] = useState<MpesaData>({
    phoneNumber: "",
    firstName: "",
    lastName: "",
  });

  const [paypalData, setPaypalData] = useState<PaypalData>({
    email: "",
  });

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      name: "Credit/Debit Card",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "mpesa" as PaymentMethod,
      name: "M-Pesa",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      description: "Pay with your mobile money",
    },
    {
      id: "paypal" as PaymentMethod,
      name: "PayPal",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.421c-.962-.6-2.393-.84-4.04-.84h-2.19c-.524 0-.968.382-1.05.9L11.25 11.7c-.082.518.24.9.762.9h2.19c3.24 0 5.755-1.31 6.565-5.685.12-.64.156-1.18.079-1.698z"/>
        </svg>
      ),
      description: "Pay with your PayPal account",
    },
  ];

  // Validation functions
  const validateCard = (data: CardData): boolean => {
    const cardNumberValid = /^\d{13,19}$/.test(data.cardNumber.replace(/\s/g, ""));
    const expiryValid = /^\d{2}\/\d{2}$/.test(data.expiryDate);
    const cvvValid = /^\d{3,4}$/.test(data.cvv);
    const nameValid = data.cardholderName.trim().length >= 2;

    return cardNumberValid && expiryValid && cvvValid && nameValid;
  };

  const validateMpesa = (data: MpesaData): boolean => {
    const phoneValid = /^(\+254|254|0)?[17]\d{8}$/.test(data.phoneNumber);
    const firstNameValid = data.firstName.trim().length >= 2;
    const lastNameValid = data.lastName.trim().length >= 2;

    return phoneValid && firstNameValid && lastNameValid;
  };

  const validatePaypal = (data: PaypalData): boolean => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    return emailValid;
  };

  // Update parent component with payment data
  const updatePaymentData = () => {
    let isValid = false;
    let data: CardData | MpesaData | PaypalData;

    switch (selectedMethod) {
      case "card":
        isValid = validateCard(cardData);
        data = cardData;
        break;
      case "mpesa":
        isValid = validateMpesa(mpesaData);
        data = mpesaData;
        break;
      case "paypal":
        isValid = validatePaypal(paypalData);
        data = paypalData;
        break;
      default:
        return;
    }

    onPaymentDataChange({
      method: selectedMethod,
      isValid,
      data,
    });
  };

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string): string => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  // Format phone number
  const formatPhoneNumber = (value: string): string => {
    let v = value.replace(/\D/g, "");
    if (v.startsWith("254")) {
      v = "+" + v;
    } else if (v.startsWith("0")) {
      v = "+254" + v.slice(1);
    } else if (!v.startsWith("+254")) {
      v = "+254" + v;
    }
    return v;
  };

  React.useEffect(() => {
    updatePaymentData();
  }, [selectedMethod, cardData, mpesaData, paypalData]);

  const CardForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <input
          type="text"
          id="cardNumber"
          value={cardData.cardNumber}
          onChange={(e) => {
            const formatted = formatCardNumber(e.target.value);
            if (formatted.replace(/\s/g, "").length <= 19) {
              setCardData({ ...cardData, cardNumber: formatted });
            }
          }}
          placeholder="1234 5678 9012 3456"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          maxLength={23}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="text"
            id="expiryDate"
            value={cardData.expiryDate}
            onChange={(e) => {
              const formatted = formatExpiryDate(e.target.value);
              if (formatted.length <= 5) {
                setCardData({ ...cardData, expiryDate: formatted });
              }
            }}
            placeholder="MM/YY"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            maxLength={5}
          />
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            value={cardData.cvv}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 4) {
                setCardData({ ...cardData, cvv: value });
              }
            }}
            placeholder="123"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            maxLength={4}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder Name
        </label>
        <input
          type="text"
          id="cardholderName"
          value={cardData.cardholderName}
          onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
          placeholder="John Doe"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const MpesaForm = () => (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              M-Pesa Payment Instructions
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <ol className="list-decimal list-inside space-y-1">
                <li>You'll receive an M-Pesa prompt on your phone</li>
                <li>Enter your M-Pesa PIN to authorize the payment</li>
                <li>You'll receive a confirmation SMS from M-Pesa</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={mpesaData.phoneNumber}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            setMpesaData({ ...mpesaData, phoneNumber: formatted });
          }}
          placeholder="+254712345678"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter your Safaricom M-Pesa number
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={mpesaData.firstName}
            onChange={(e) => setMpesaData({ ...mpesaData, firstName: e.target.value })}
            placeholder="John"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={mpesaData.lastName}
            onChange={(e) => setMpesaData({ ...mpesaData, lastName: e.target.value })}
            placeholder="Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-lg font-semibold text-gray-900">
          Amount to Pay: KES {Math.round(amount * 130)} {/* Assuming 1 USD = 130 KES */}
        </p>
        <p className="text-sm text-gray-500">
          (~${amount} USD)
        </p>
      </div>
    </div>
  );

  const PaypalForm = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              PayPal Payment
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                You'll be redirected to PayPal to complete your payment securely.
                Make sure your PayPal account has sufficient funds or a linked payment method.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">
          PayPal Email Address
        </label>
        <input
          type="email"
          id="paypalEmail"
          value={paypalData.email}
          onChange={(e) => setPaypalData({ ...paypalData, email: e.target.value })}
          placeholder="your.email@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter the email address associated with your PayPal account
        </p>
      </div>

      <div className="text-center py-4">
        <p className="text-lg font-semibold text-gray-900">
          Amount to Pay: ${amount} {currency}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedMethod === method.id
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-opacity-20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`mr-3 ${selectedMethod === method.id ? "text-blue-600" : "text-gray-400"}`}>
                  {method.icon}
                </div>
                <h4 className="font-medium text-gray-900">{method.name}</h4>
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Payment Details
        </h3>

        {selectedMethod === "card" && <CardForm />}
        {selectedMethod === "mpesa" && <MpesaForm />}
        {selectedMethod === "paypal" && <PaypalForm />}
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">Secure Payment</h4>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and secure. We never store your complete card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;

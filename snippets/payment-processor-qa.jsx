import { useState } from 'react';

export const PaymentProcessorQA = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "💰 How much cheaper is Request Network?",
      answer: (
        <div className="space-y-3">
          <p>
            Request Network charges <strong>0.05% (5 basis points)</strong> per transaction.
          </p>
          <p>
            Traditional processors like Stripe and PayPal charge <strong>2.9% + $0.30</strong> per transaction.
          </p>
          <div 
            style={{
              background: 'linear-gradient(to bottom, rgba(1, 176, 137, 0.05), rgba(1, 176, 137, 0.08))',
              borderColor: 'rgba(1, 176, 137, 0.2)'
            }}
            className="rounded-lg p-4 border dark:bg-gradient-to-b dark:from-[#002419] dark:to-[#003326] dark:border-[rgba(1,176,137,0.3)]"
          >
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Example: On a $10,000 payment
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Request Network:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">$5 fee</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Stripe/PayPal:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">$290 fee</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            That's <strong className="text-primary-600 dark:text-primary-400">58x cheaper</strong> with Request Network.
          </p>
        </div>
      ),
    },
    {
      question: "🔐 What does 'non-custodial' mean?",
      answer: (
        <div className="space-y-3">
          <p>
            With Request Network, funds go <strong>directly from payer to recipient</strong> on the blockchain.
          </p>
          {' '}
          <p>
            Traditional payment processors hold your funds for <strong>2-7 days</strong> before releasing them. This creates:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 mt-1">❌</span>
              <span>Counterparty risk (they could go bankrupt)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 mt-1">❌</span>
              <span>Delayed access to your money</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 mt-1">❌</span>
              <span>Potential freezing or seizure of funds</span>
            </li>
          </ul>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
              ✅ Request Network eliminates these risks entirely
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-2">
              You have full control and immediate access to your funds at all times.
            </p>
          </div>
        </div>
      ),
    },
    {
      question: "📊 How does reconciliation compare?",
      answer: (
        <div className="space-y-3">
          <p>
            Both Request Network and traditional processors offer payment reconciliation capabilities.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
                Request Network Advantages:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✅</span>
                  <span className="text-green-900 dark:text-green-100">Cryptographically guaranteed accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✅</span>
                  <span className="text-green-900 dark:text-green-100">Permanent on-chain records (can't be deleted)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✅</span>
                  <span className="text-green-900 dark:text-green-100">Real-time status updates via webhooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✅</span>
                  <span className="text-green-900 dark:text-green-100">No data retention limits</span>
                </li>
              </ul>
            </div>
            <div 
              style={{
                background: 'linear-gradient(to bottom, rgba(1, 176, 137, 0.05), rgba(1, 176, 137, 0.08))',
                borderColor: 'rgba(1, 176, 137, 0.2)'
              }}
              className="rounded-lg p-4 border dark:bg-gradient-to-b dark:from-[#002419] dark:to-[#003326] dark:border-[rgba(1,176,137,0.3)]"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Traditional Processors:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠️</span>
                  <span className="text-gray-700 dark:text-gray-300">Data stored in company databases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠️</span>
                  <span className="text-gray-700 dark:text-gray-300">Limited data retention (typically 7 years)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠️</span>
                  <span className="text-gray-700 dark:text-gray-300">Depends on company staying in business</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠️</span>
                  <span className="text-gray-700 dark:text-gray-300">Subject to data breaches and loss</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      question: "🌍 Which is better for crypto businesses?",
      answer: (
        <div className="space-y-3">
          <p>
            Request Network is <strong>purpose-built for crypto</strong> from the ground up:
          </p>
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5">✅</span>
                <span>
                  <strong>553+ currencies</strong> across 10 EVM chains (Ethereum, Polygon, BSC, etc.)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5">✅</span>
                <span>
                  <strong>No forced fiat conversion</strong> - stay in crypto end-to-end
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5">✅</span>
                <span>
                  <strong>Native Web3 wallet integration</strong> - connect with MetaMask, WalletConnect, etc.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5">✅</span>
                <span>
                  <strong>Crosschain payments</strong> - pay in one token, receive in another
                </span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Traditional processors treat crypto as an afterthought:
          </p>
          <ul className="space-y-2 ml-4 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠️</span>
              <span className="text-gray-700 dark:text-gray-300">
                Limited token support (usually just BTC, ETH, USDC)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠️</span>
              <span className="text-gray-700 dark:text-gray-300">
                Requires crypto-to-fiat conversion with variable fees
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠️</span>
              <span className="text-gray-700 dark:text-gray-300">
                Fiat-first architecture with crypto bolted on
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "🛡️ What about chargebacks?",
      answer: (
        <div className="space-y-3">
          <p>
            With Request Network, <strong>crypto payments are typically final</strong>—there are no chargebacks by default.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Benefits of Finality:
            </p>
            <ul className="space-y-2 text-sm text-green-900 dark:text-green-100">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>No surprise reversals 60-90 days after payment</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Perfect for digital goods and services</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Ideal for international payments where chargeback fraud is common</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>No chargeback fees ($15-25 per dispute)</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Traditional processors face significant chargeback risk, especially for digital goods. Merchants can lose both the product and the payment, plus pay dispute fees.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> Request Network supports escrow-based flows for use cases requiring buyer protection. Funds are held in smart contracts until conditions are met, enabling refunds when needed.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const ChevronDownIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                background: openIndex === index 
                  ? 'linear-gradient(to bottom, rgba(1, 176, 137, 0.04), rgba(1, 176, 137, 0.06))'
                  : 'rgba(1, 176, 137, 0.02)',
                borderColor: openIndex === index ? 'rgba(1, 176, 137, 0.3)' : 'rgba(1, 176, 137, 0.15)'
              }}
              className="rounded-lg border overflow-hidden transition-all duration-200 hover:border-[rgba(1,176,137,0.4)] dark:bg-gradient-to-b dark:from-[#002419] dark:to-[#003326] dark:border-[rgba(1,176,137,0.3)]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors duration-200"
              >
                <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-4 text-gray-700 dark:text-gray-300">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

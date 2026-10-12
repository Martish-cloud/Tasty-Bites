import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How does TastyBItes guarantee 20–30 minute delivery?',
    answer:
      'We operate decentralized micro-kitchen hubs located within high-density urban areas. Each hub has dedicated rider pods and prep workstations designed to flash-cook dishes in under 8 minutes, followed by direct thermal dispatch.',
  },
  {
    question: 'How can I track my food order in real-time?',
    answer:
      'Each confirmed demo order receives a unique order and tracking ID (e.g., TB-910243). You can track your simulated order in real-time from the Track Order navigation link or directly after checkout across five simulated fulfillment stages: Order Confirmed, Restaurant Accepted, Preparing Your Food, Delivery Partner Assigned / Out for Delivery, and Delivered.',
  },
  {
    question: 'Are ingredients sourced fresh daily?',
    answer:
      'Yes. Our produce, bakery brioche buns, and dairy are supplied daily at 5:00 AM from verified organic farm cooperatives. We never use pre-frozen meals or artificial preservatives.',
  },
  {
    question: 'What delivery locations and PIN codes are currently serviceable?',
    answer:
      'We currently operate express delivery across Bengaluru (560xxx), Mumbai (400xxx), Delhi NCR (110xxx/122xxx/201xxx), Pune (411xxx), Punjab hubs (Chandigarh, Ludhiana, Amritsar, Jalandhar), and Kolkata (700xxx). You can check your PIN code instantly using the delivery location popup.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We support all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards, Net Banking via Razorpay, and Cash on Delivery (COD) for eligible orders.',
  },
  {
    question: 'What is your refund policy if my food is delayed or unsatisfactory?',
    answer:
      'We take food quality seriously. If your order arrives cold or fails quality standards, contact our 24/7 support line within 1 hour for an instant replacement or full money-back guarantee.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { showToast } = useApp();

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full bg-[#f8f9fa] text-neutral-900 py-16 sm:py-20 border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-left">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10.5px] uppercase tracking-[0.2em] mb-2.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
            Everything you need to know about our ingredients, delivery radiuses, and payment workflows.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50/50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-amber-500 text-white' : 'text-neutral-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Strip */}
        <div className="mt-8 p-4 sm:p-5 bg-neutral-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Need personal assistance?</h4>
              <p className="text-[11px] text-neutral-400">Our customer culinary team is online 24/7</p>
            </div>
          </div>

          <button
            onClick={() => showToast('TastyBites Live Support hotline: +91 98765 43210 (Open 24/7)', 'info')}
            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md shrink-0"
          >
            Chat with Support
          </button>
        </div>
      </div>
    </section>
  );
};

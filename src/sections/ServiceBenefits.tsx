import React from 'react';
import { Leaf, Truck, ShieldCheck, Users, Headphones } from 'lucide-react';

export const ServiceBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Leaf className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
      title: 'Farm Fresh Ingredients',
      desc: 'Quality you can trust',
    },
    {
      icon: <Truck className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50 border-rose-200',
      title: 'Lightning Fast Delivery',
      desc: 'At your doorstep',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
      bg: 'bg-red-50 border-red-200',
      title: 'Safe & Secure Payments',
      desc: '100% secure transactions',
    },
    {
      icon: <Users className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50 border-rose-200',
      title: 'Loved by Thousands',
      desc: 'Happy customers',
    },
    {
      icon: <Headphones className="w-5 h-5 text-red-600" />,
      bg: 'bg-red-50 border-red-200',
      title: '24/7 Customer Support',
      desc: "We're always here",
    },
  ];

  return (
    <section id="service-benefits" className="w-full bg-white border-y border-neutral-100 py-6 sm:py-8 my-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors group cursor-default"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${item.bg} group-hover:scale-110 transition-transform`}
              >
                {item.icon}
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

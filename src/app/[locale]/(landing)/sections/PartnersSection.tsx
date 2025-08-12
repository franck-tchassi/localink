"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/locales/client";

export default function PartnersSection() {
  const [count, setCount] = useState(0);
  const targetCount = 5000;

  // Animation du compteur
  useEffect(() => {
    const duration = 2000; // 2 secondes
    const increment = targetCount / (duration / 16);
    let startValue = 0;
    
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  // Logos des partenaires
  const partners = [
    { id: 1, logo: "/entreprise/bilo.png", alt: "Bilo" },
    { id: 2, logo: "/entreprise/claudia.png", alt: "Claudia" },
    { id: 3, logo: "/entreprise/pocfly.png", alt: "Pocfly" },
    { id: 4, logo: "/entreprise/savoie.png", alt: "Savoie" },
    { id: 5, logo: "/entreprise/claudia.png", alt: "Claudia" },
    { id: 6, logo: "/entreprise/pocfly.png", alt: "Pocfly" },
  ];
  const t = useI18n();
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("landing.partnership.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("landing.partnership.subtitle")}
          </p>
        </div>

        {/* Grille de logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {partners.map((partner) => (
            <div 
              key={partner.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center h-40"
            >
              <div className="relative w-full h-full">
                <Image
                  src={partner.logo}
                  alt={partner.alt}
                  fill
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  sizes="(max-width: 768px) 100px, 150px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
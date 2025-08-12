// app/[locale]/(landing)/sections/AdvantagesSection.tsx
"use client";

import {
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaChartLine,
  FaShieldAlt,
  FaRegSmile,
} from "react-icons/fa";
import { useI18n } from "@/locales/client";

export default function AdvantagesSection() {
  const t = useI18n();
  const advantages = [
    {
      icon: <FaMapMarkerAlt className="h-10 w-10 text-blue-500 mb-4" />,
      title: t("landing.advantage_section.subtitle_1.title"),
      desc: t("landing.advantage_section.subtitle_1.description"),
    },
    {
      icon: <FaChartLine className="h-10 w-10 text-blue-500 mb-4" />,
      title: t("landing.advantage_section.subtitle_2.title"),
      desc: t("landing.advantage_section.subtitle_2.description"),
    },
    {
      icon: <FaUsers className="h-10 w-10 text-blue-500 mb-4" />,
      title: t("landing.advantage_section.subtitle_3.title"),
      desc: t("landing.advantage_section.subtitle_3.description"),
    },
    {
      icon: <FaStar className="h-10 w-10 text-blue-500 mb-4" />,
      title: t("landing.advantage_section.subtitle_4.title"),
      desc: t("landing.advantage_section.subtitle_4.description"),
    },
    {
      icon: <FaShieldAlt className="h-10 w-10 text-blue-500 mb-4" />,
      title: t("landing.advantage_section.subtitle_5.title"),
      desc: t("landing.advantage_section.subtitle_5.description"),
    },
    {
      icon: <FaRegSmile className="h-10 w-10 text-blue-500 mb-4" />,
      title: t("landing.advantage_section.subtitle_6.title"),
      desc: t("landing.advantage_section.subtitle_6.description"),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t("landing.advantage_section.title")} <span className="text-blue-500">{t("landing.advantage_section.title_2")}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {advantages.map((adv, idx) => (
            <div
              key={idx}
              className="bg-blue-50 rounded-xl p-8 shadow flex flex-col items-center hover:scale-[1.03] transition-transform duration-200"
            >
              {adv.icon}
              <h3 className="font-semibold text-lg mb-2 text-center">{adv.title}</h3>
              <p className="text-gray-600 text-center text-base">{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

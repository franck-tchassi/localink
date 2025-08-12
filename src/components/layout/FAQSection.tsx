"use client"

import { useState } from 'react'
import { Separator } from "@/components/ui/separator"
import { useI18n } from '@/locales/client';

export default function FAQSection() {
  const t = useI18n();
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const faqs = [
    {
      question: `${t("landing.faq.items.0.question")}`,
      answer: `${t("landing.faq.items.0.answer")}`
    },
    {
      question: `${t("landing.faq.items.1.question")}`,
      answer: `${t("landing.faq.items.1.answer")}`
    },
    {
      question: `${t("landing.faq.items.2.question")}`,
      answer: `${t("landing.faq.items.2.answer")}`
    },
    {
      question: `${t("landing.faq.items.3.question")}`,
      answer: `${t("landing.faq.items.3.answer")}`
    },
    {
      question: `${t("landing.faq.items.4.question")}`,
      answer: `${t("landing.faq.items.4.answer")}`
    },
    {
      question: `${t("landing.faq.items.5.question")}`,
      answer: `${t("landing.faq.items.5.answer")}`,
    },
    {
      question: `${t("landing.faq.items.6.question")}`,
      answer: `${t("landing.faq.items.6.answer")}`,
    }
  ]

  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">{t("landing.faq.title")}</h2>
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              className={`flex items-center justify-between w-full px-5 py-4 text-left ${
                activeIndex === index ? 'bg-gray-50 cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'
              } transition-colors`}
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-bold text-gray-800">
                {faq.question}
              </span>
              <span className="text-gray-500">
                {activeIndex === index ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </span>
            </button>

            <div 
              className={`transition-all duration-200 px-5 ${
                activeIndex === index 
                  ? 'opacity-100 h-px' 
                  : 'opacity-0 h-0'
              }`}
            >
              <Separator className="w-[calc(100%-2.5rem)] mx-auto bg-gray-200" />
            </div>
            
            <div
              className={`px-5 overflow-hidden transition-all duration-200 ${
                activeIndex === index
                  ? 'max-h-40 pb-4 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600 text-sm pt-2">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
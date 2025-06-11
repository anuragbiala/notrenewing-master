"use client";
import { useState, useEffect } from "react";

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-faqs`);
        const data = await res.json();

        if (data.success) {
          setFaqs(data.data);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFaqs();
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border-b border-[#e2e8f0]">
            <h3>
              <button
                type="button"
                id={`faq-${faq.id}-button`}
                aria-controls={`faq-${faq.id}-panel`}
                aria-expanded={openIndex === index}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between py-4 text-lg font-medium transition-all hover:underline cursor-pointer"
              >
                {faq.question}
                <svg
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            {openIndex === index && (
              <div
                id={`faq-${faq.id}-panel`}
                role="region"
                aria-labelledby={`faq-${faq.id}-button`}
                className="pb-4 text-sm text-gray-700"
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

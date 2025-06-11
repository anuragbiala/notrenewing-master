"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center my-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Find answers to common questions about NotRenewing.com.
          </p>

          {/* Search Input */}
          <div className="max-w-3xl mx-auto w-full mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-gray-400"
                >
                  <circle cx={11} cy={11} r={8} />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                className="h-10 w-full rounded-md border px-3 py-2 pl-10 text-base placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f366b]"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* FAQ List */}
          <div className="w-full max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
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
              ))
            ) : (
              <p className="text-center text-gray-500 mt-8">No matching FAQs found.</p>
            )}
          </div>

          {/* Contact Support */}
          <div className="text-center bg-white p-8 rounded-lg shadow-sm mt-12">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Our team is here to help. Contact us if you couldn't find the
              answer you were looking for.
            </p>
            <Link href="/contact-us" passHref legacyBehavior>
              <a
                href="/contact-us"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Contact Support
              </a>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

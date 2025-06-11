"use client";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PrivacyPolicy() {
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-privacy-policy`);
        const json = await res.json();

        if (json.status && json.data.length > 0) {
          setPolicy(json.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error);
      }
    };

    fetchPolicy();
  }, []);

  // Format plain text to HTML (paragraphs and line breaks)
  const formatDescription = (text) => {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .split('\n\n') // Paragraph breaks
      .map(paragraph =>
        `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`
      )
      .join('');
  };

  return (
    <>
      <Header />

      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center my-4">Privacy Policy</h1>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            This Privacy Policy describes how we collect, use, and share your information.
          </p>

          <div className="rounded-lg border bg-white border-[#e2e8f0] shadow-sm max-w-4xl mx-auto">
            <div className="p-8">
              {policy ? (
                <div className="prose prose-blue max-w-none">
                  <p className="text-sm text-gray-500 mb-6">
                    Last updated:{" "}
                    {new Date(policy.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric" ,
                    })}
                  </p>

                  <div
                    className="text-gray-600 max-w-5xl mx-auto space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: formatDescription(policy.description),
                    }}
                  />
                </div>
              ) : (
                <p className="text-center text-gray-500">Loading policy...</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

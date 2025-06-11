"use client";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost/notrenewing/public/api/add-home-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status) {
        Swal.fire({
          title: "Success!",
          text: data.message,
          icon: "success",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to submit the form. Try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center my-4">Contact Us</h1>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            We'd love to hear from you. Reach out with any questions or feedback.
          </p>
          

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="md:col-span-1">
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm border-[#e2e8f0] bg-white">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Contact Information</h2>
        <div className="space-y-6">
          <div className="flex items-start">
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
              className="lucide lucide-map-pin h-5 w-5 text-primary mr-3 mt-0.5"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx={12} cy={10} r={3} />
            </svg>
            <div>
              <h3 className="font-medium">Address</h3>
              <p className="text-gray-600">
                123 Domain Street
                <br />
                San Francisco, CA 94107
                <br />
                United States
              </p>
            </div>
          </div>
          <div className="flex items-start">
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
              className="lucide lucide-phone h-5 w-5 text-primary mr-3 mt-0.5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start">
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
              className="lucide lucide-mail h-5 w-5 text-primary mr-3 mt-0.5"
            >
              <rect width={20} height={16} x={2} y={4} rx={2} />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-gray-600">support@notrenewing.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
            <div className="md:col-span-2">
              <div className="rounded-lg border bg-white border-[#e2e8f0] shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                      <input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full h-10 px-3 py-2 border border-[#e2e8f0] rounded-md bg-[#f9fafb]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Your Email</label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full h-10 px-3 py-2 border border-[#e2e8f0] rounded-md bg-[#f9fafb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <input
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full h-10 px-3 py-2 border border-[#e2e8f0] rounded-md bg-[#f9fafb]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md bg-[#f9fafb]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

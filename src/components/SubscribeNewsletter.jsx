"use client";
import { useState } from "react";
import Swal from "sweetalert2";

export default function SubscribeNewsletter() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/submit-sewsletter-subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.firstName,
            email: formData.email,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Subscribed!", "You have been subscribed.", "success");
        setFormData({ firstName: "", email: "" });
      } else {
        Swal.fire("Error", data.message || "Subscription failed.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
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
              className="lucide lucide-mail mr-2 text-brand-blue"
            >
              <rect width={20} height={16} x={2} y={4} rx={2} />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Get the Hottest Domain Picks
          </h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter and get exclusive insights on expiring
            domains directly in your inbox.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="flex h-10 w-full rounded-md border border-[#e2e8f0] px-3 py-2"
                id="firstName"
                placeholder="Enter your first name"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="flex h-10 w-full rounded-md border border-[#e2e8f0] px-3 py-2"
                id="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <button
              className="bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2 w-full rounded-md"
              type="submit"
            >
              Subscribe to Newsletter
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

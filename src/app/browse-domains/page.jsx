'use client';

import { useEffect, useState } from 'react';
import DomainSearch from "@/components/CondensedView";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function BrowseDomains() {
  const [tlds, setTlds] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTlds = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-tlds`);
        const result = await res.json();
        if (result.success) {
          setTlds(result.data);
        } else {
          console.error("Failed to fetch TLDs:", result.message);
        }
      } catch (error) {
        console.error("Error fetching TLDs:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-Categories`);
        const result = await res.json();
        if (result.success) {
          setCategories(result.data); // Assuming array of { id: 1, name: "Business" }
        } else {
          console.error("Failed to fetch Categories:", result.message);
        }
      } catch (error) {
        console.error("Error fetching Categories:", error);
      }
    };

    fetchTlds();
    fetchCategories();
  }, []);

  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 py-8 bg-gray-50">
          <h1 className="text-3xl font-bold my-8">Browse Domains</h1>

          <div className="mb-8 space-y-4">
            <form className="flex flex-col gap-4 md:flex-row md:items-center">
              <input
                type="text"
                placeholder="Search domains..."
                className="w-full flex-grow rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary border-[#e2e8f0]"
              />

              <select className="w-full md:w-48 rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-[#e2e8f0]">
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.category}</option>
                ))}
              </select>

              <select className="w-full md:w-48 rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-[#e2e8f0]">
                <option value="all">All TLDs</option>
                {tlds.map((tld, index) => (
                  <option key={index} value={tld.tld}>
                    {tld.tld}
                  </option>
                ))}
              </select>

              <select className="w-full md:w-48 rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-[#e2e8f0]">
                <option value="expiration-asc">Expiration (Soon First)</option>
                <option value="expiration-desc">Expiration (Later First)</option>
                <option value="popularity">Most Popular</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="category">Category</option>
              </select>

              <button
                type="submit"
                className="h-10 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Search
              </button>
            </form>
          </div>

          <DomainSearch />
        </div>
      </main>
      <Footer />
    </>
  );
}

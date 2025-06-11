'use client';

import { useEffect, useState } from 'react';

export default function SearchBar() {
  const [tlds, setTlds] = useState([]);

  useEffect(() => {
    const fetchTlds = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-tlds`);
        const result = await res.json();
        if (result.success) {
          setTlds(result.data);
        } else {
          console.error('Failed to fetch TLDs:', result.message);
        }
      } catch (error) {
        console.error('Error fetching TLDs:', error);
      }
    };

    fetchTlds();
  }, []);

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Quick Search</h2>
          <form className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                placeholder="Search domains..."
              />
            </div>
            <div className="w-full md:w-48">
              <select defaultValue="all" className="border rounded px-3 py-2 w-full bg-white">
                <option value="all">All TLDs</option>
                {tlds.map((tld, index) => (
                  <option key={index} value={tld.tld}>{tld.tld}</option>
                ))}
              </select>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

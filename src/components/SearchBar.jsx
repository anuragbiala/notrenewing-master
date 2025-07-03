'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [tlds, setTlds] = useState([]);
  const [domainInput, setDomainInput] = useState("");
  const [selectedTld, setSelectedTld] = useState("all");
  const router = useRouter();

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

    fetchTlds();
  }, []);

  const extractTld = (domainName) => {
    if (!domainName.includes(".")) return "";
    const parts = domainName.split(".");
    return `.${parts[parts.length - 1]}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!domainInput.trim()) {
      alert("Please enter a domain name to search.");
      return;
    }

    let tld = selectedTld;
    if (domainInput.includes(".")) {
      tld = extractTld(domainInput);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/search-domain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain_name: domainInput,
          tld: tld === "all" ? "" : tld,
        }),
      });

      const result = await res.json();

      if (result.status) {
        // ✅ Store results in localStorage
        localStorage.setItem(
          "searchResults",
          JSON.stringify(result.data)
        );
        router.push("/browse-domains");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Something went wrong while searching.");
    }
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Quick Search</h2>
          <form
            className="flex flex-col md:flex-row gap-4"
            onSubmit={handleSearch}
          >
            <div className="flex-grow">
              <input
                type="text"
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                placeholder="Search domains..."
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedTld}
                onChange={(e) => setSelectedTld(e.target.value)}
                className="border rounded px-3 py-2 w-full bg-white"
              >
                <option value="all">All TLDs</option>
                {tlds.map((tld, index) => (
                  <option key={index} value={tld.tld}>
                    {tld.tld}
                  </option>
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

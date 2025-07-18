"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DomainSearch from "@/components/CondensedView";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Swal from "sweetalert2";


export default function BrowseDomains() {
  const router = useRouter();

  const [tlds, setTlds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [domainInput, setDomainInput] = useState("");
  const [selectedTld, setSelectedTld] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("expiration-asc");
  const [condensedView, setCondensedView] = useState(false);
  const [domains, setDomains] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const domainsPerPage = 4;
  const [likes, setLikes] = useState({});
  const [userId, setUserId] = useState(null);
  
    const handleCondensedToggle = () => {
      setCondensedView(!condensedView);
    };
  
      useEffect(() => {
      const searchResults = localStorage.getItem("searchResults");
      if (searchResults) {
        setIsSearchMode(true);
        setDomains(JSON.parse(searchResults));
      } else {
        fetchDomains();
      }
    }, []);
  
    const handleShowAllDomains = () => {
      localStorage.removeItem("searchResults");
      fetchDomains();
      setIsSearchMode(false);
    };
  
    const fetchDomains = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-domain`);
        const json = await res.json();
        if (json.status) {
          setDomains(json.data);
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };
  
    const handleBuyClick = (domain) => {
      setSelectedDomain(domain);
    };
  
    const handleCloseModal = () => {
      setSelectedDomain(null);
    };
  
    const getTimeUntilExpiration = (expiryDateStr) => {
      if (!expiryDateStr) return "N/A";
  
      const expiryDate = new Date(expiryDateStr);
      const now = new Date();
  
      if (isNaN(expiryDate.getTime())) return "Invalid date";
      if (expiryDate < now) return "Expired";
  
      let years = expiryDate.getFullYear() - now.getFullYear();
      let months = expiryDate.getMonth() - now.getMonth();
      let days = expiryDate.getDate() - now.getDate();
  
      if (days < 0) {
        const prevMonthDays = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), 0).getDate();
        days += prevMonthDays;
        months--;
      }
  
      if (months < 0) {
        months += 12;
        years--;
      }
  
      const parts = [];
      if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
      if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
      if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  
      if (parts.length === 0) return "Expires in 0 days";
      return `Expires in ${parts.join(", ")}`;
    };
  
    const indexOfLastDomain = currentPage * domainsPerPage;
    const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
    const currentDomains = domains.slice(indexOfFirstDomain, indexOfLastDomain);
    const totalPages = Math.ceil(domains.length / domainsPerPage);
  
const handleLikeToggle = async (domainId, createdBy) => {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    alert("You have to login to favorite this domain.");
    return;
  }

  if (parseInt(userId) === parseInt(createdBy)) {
    alert("You cannot like your own domain.");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/domain-like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        domain_id: domainId,
        user_id: userId,
      }),
    });

    const json = await res.json();

    if (json.liked !== undefined) {
      setLikes((prev) => ({
        ...prev,
        [domainId]: {
          liked: json.liked,
          count: json.like_count,
        },
      }));
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};
  
    useEffect(() => {
      const fetchLikedDomains = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-liked-domains`);
          const json = await res.json();
  
          if (json.status && Array.isArray(json.data)) {
            const userId = localStorage.getItem("user_id");
            const likeMap = {};
            json.data.forEach((like) => {
              const domainId = like.domain_id;
  
              if (!likeMap[domainId]) {
                likeMap[domainId] = {
                  count: 0,
                  liked: false,
                };
              }
  
              likeMap[domainId].count += 1;
              if (String(like.user_id) === String(userId)) {
                likeMap[domainId].liked = true;
              }
            });
  
            setLikes(likeMap);
          }
        } catch (error) {
          console.error("Error fetching liked domains:", error);
        }
      };
  
      fetchLikedDomains();
    }, []);
  
const handleDomainBooking = async () => {
  const userId = localStorage.getItem("user_id");
  const userType = localStorage.getItem("user_type");
  const domainId = selectedDomain?.id;

  // Option 1: If selectedDomain has category_id already
  const categoryId = selectedDomain?.category_id;

  // Option 2 (uncomment if only category name is available):
  /*
  const categoryList = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Health" },
    { id: 3, name: "Finance" },
  ];
  const categoryId = categoryList.find(
    (cat) =>
      cat.name.toLowerCase() === selectedDomain?.category?.toLowerCase()
  )?.id;
  */

  if (!userId || !domainId || !categoryId) {
    Swal.fire("Error", "Missing user, domain, or category info.", "error");
    return;
  }

  if (userType !== "buyer") {
    Swal.fire("Access Denied", "Only buyers can book domains.", "warning");
    return;
  }

  const bookingData = {
    domain_id: domainId,
    user_id: userId,
    category_id: categoryId, // ✅ sent correctly
    status: "Pending",
    payment: "99",
    commission: "1",
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/domain-bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      }
    );

    const data = await response.json();

    if (data.status) {
      Swal.fire("Success", data.message, "success").then(() => {
        handleCloseModal();
      });
    } else {
      Swal.fire("Error", data.message || "Booking failed", "error");
    }
  } catch (error) {
    Swal.fire("Error", "Something went wrong during booking", "error");
  }
};

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-Categories`
        );
        const result = await res.json();
        if (result.success) {
          setCategories(result.data);
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

  // Helper to extract TLD from domain name
  const extractTld = (domain) => {
    const parts = domain.split(".");
    return parts.length > 1 ? parts.pop() : "";
  };

const handleSearch = async (e) => {
  e.preventDefault();

  if (!domainInput.trim() && selectedTld === "all" && selectedCategory === "all") {
    alert("Please enter a domain name, select a TLD, or choose a category.");
    return;
  }

  let tld = selectedTld;

  if (domainInput.includes(".")) {
    tld = extractTld(domainInput);
  }

  // Optional TLD check if you want it here...

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/search-domain`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain_name: domainInput.trim(),
          tld: tld === "all" ? "" : tld,
          category_id: selectedCategory === "all" ? "" : selectedCategory,
        }),
      }
    );

    const result = await res.json();

    if (result.status) {
      localStorage.setItem(
        "searchResults",
        JSON.stringify(result.data)
      );
      window.location.href = "/browse-domains";
    } else {
      alert(result.message || "No domains found.");
    }
  } catch (error) {
    console.error("Search error:", error);
    alert("Something went wrong while searching.");
  }
};



  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 py-8 bg-gray-50">
          <h1 className="text-3xl font-bold my-8">Browse Domains</h1>

          <div className="mb-8 space-y-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-4 md:flex-row md:items-center"
            >
              <input
                type="text"
                placeholder="Search domains..."
                className="w-full flex-grow rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary border-[#e2e8f0]"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
              />

              <select
                className="w-full md:w-48 rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-[#e2e8f0]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category}
                  </option>
                ))}
              </select>

             <select
              className="w-full md:w-48 rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-[#e2e8f0]"
              value={selectedTld}
              onChange={(e) => setSelectedTld(e.target.value)}
            >
              <option value="all">All TLDs</option>
              {tlds.map((tld, index) => (
                <option key={index} value={tld.tld}>
                  {tld.tld}
                </option>
              ))}
            </select>


              <select
                className="w-full md:w-48 rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-[#e2e8f0]"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
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

          <div className="mb-8 space-y-4">
      <div className="flex justify-end mt-4">
        <label
          htmlFor="condensed-view"
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <input
            type="checkbox"
            id="condensed-view"
            className="sr-only"
            checked={condensedView}
            onChange={handleCondensedToggle}
          />
          <div
            className={`relative h-6 w-11 rounded-full transition-colors ${
              condensedView ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${
                condensedView ? "translate-x-5 left-0" : "translate-x-0 left-0.5"
              }`}
            />
          </div>
          <span>Condensed View</span>
        </label>
      </div>

       {condensedView ? (
        <div className="space-y-4">
          {currentDomains.map((domain, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded-md border border-[#e2e8f0] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 flex-grow">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg truncate">
                      {domain.domain_name}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {domain.is_sponsored === "1" && (
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold bg-[#ed8936] text-white text-xs">
                          Sponsored
                        </div>
                      )}
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-brand-blue text-white text-xs">
                      {domain.filter}
                    </div>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-gray-200 text-gray-800 text-xs">
                        .{domain.domain_name.split(".").pop()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <div className="rounded-full border px-2.5 py-0.5 font-semibold bg-[#317ac4] text-white text-xs flex items-center gap-1 w-fit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={12}
                        height={12}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-tag"
                      >
                        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                      </svg>
                      {domain.category}
                    </div>
                    <span className="mx-1">•</span>
                    <span className="text-amber-600 font-medium">
                      {getTimeUntilExpiration(domain.exipry_date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-gray-800">$99</span>
                <button
                  onClick={() => handleLikeToggle(domain.id, domain.created_by)}
                  className={`flex items-center gap-1 justify-center text-sm font-medium h-9 rounded-md px-3 transition-all ${
                    likes[domain.id]?.liked ? "text-red-500" : "text-gray-500"
                  }`}
                  aria-label="Like"
                  title="Like"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill={likes[domain.id]?.liked ? "#F56040" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart transition-colors duration-200"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>{likes[domain.id]?.count || 0}</span>
                </button>
                <button
                  onClick={() => handleBuyClick(domain)}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {currentDomains.map((domain, index) => (
            <div
              key={index}
              className="w-full sm:w-[48%] lg:w-[23%] rounded-lg border border-[#e2e8f0] bg-white shadow-sm flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="font-semibold tracking-tight text-xl break-all truncate">
                  {domain.domain_name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {domain.is_sponsored === "1" && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#ed8936] text-white">
                      Sponsored
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-200 text-gray-800">
                    .{domain.domain_name.split(".").pop()}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow pt-2">
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {domain.description}
                </p>
                <div className="mb-3 flex flex-wrap gap-2">
                  <div className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#317ac4] text-white flex items-center gap-1 w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14}
                      height={14}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                    </svg>
                    {domain.category}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm">
                    <strong>Expiration:</strong> {domain.exipry_date}
                  </p>
                  <p className="text-sm text-amber-600 font-medium">
                    {getTimeUntilExpiration(domain.exipry_date)}
                  </p>
                </div>
                <p className="text-lg font-bold">$99</p>
              </div>
              <div className="flex justify-between items-center p-6 border-t border-[#e2e8f0]">
                <button
                  onClick={() => handleLikeToggle(domain.id, domain.created_by)}
                  className={`flex items-center gap-1 justify-center text-sm font-medium h-9 rounded-md px-3 transition-all ${
                    likes[domain.id]?.liked ? "text-red-500" : "text-gray-500"
                  }`}
                  aria-label="Like"
                  title="Like"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill={likes[domain.id]?.liked ? "#F56040" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart transition-colors duration-200"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>{likes[domain.id]?.count || 0}</span>
                </button>
                <button
                  onClick={() => handleBuyClick(domain)}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <nav
          role="navigation"
          aria-label="pagination"
          className="mx-auto flex justify-center"
        >
          <ul className="flex items-center gap-2">
            <li>
              <a
                className="flex items-center gap-1 rounded-md text-sm font-medium h-10 px-3 text-gray-400 cursor-not-allowed"
                aria-label="Go to previous page"
              >
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
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>Previous</span>
                    </a>
                  </li>

                {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num + 1}
                  className={`flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ${
                    currentPage === num + 1 ? "bg-gray-200 text-gray-900" : ""
                  }`}
                  onClick={() => setCurrentPage(num + 1)}
                >
                  {num + 1}
                </button>
              ))}

            <li>
              <a
                className="flex items-center gap-1 rounded-md text-sm font-medium h-10 px-3 hover:bg-gray-100 text-gray-700"
                aria-label="Go to next page"
              >
                <span  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}>Next</span>
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
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>

     {selectedDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
             <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-md"
          tabIndex={-1}
          style={{ pointerEvents: "auto" }}
        >
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h2
              id="radix-:r2r:"
              className="text-lg font-semibold leading-none tracking-tight"
            >
              Purchase Domain
            </h2>
            <p id="radix-:r2s:" className="text-sm text-gray-500">
              You're about to purchase {selectedDomain.domain_name}
            </p>
          </div>
          <div className="py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Domain Name:</span>
                <span className="font-medium">{selectedDomain.domain_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Domain Price:</span>
                <span className="font-medium">$99.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">NotRenewing.com Fee:</span>
                <span className="font-medium">$1.00</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">Total:</span>
                <span className="font-bold text-lg">$100.00</span>
              </div>
              <button onClick={handleDomainBooking} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                Proceed to Payment
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-credit-card ml-2"
                >
                  <rect width={20} height={14} x={2} y={5} rx={2} />
                  <line x1={2} x2={22} y1={10} y2={10} />
                </svg>
              </button>
            </div>
          </div>
          <button
            type="button"  onClick={handleCloseModal}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer"
          >
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
              className="lucide lucide-x h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
           </div>
          </div>
        </div>
      )}
      <div>
      {isSearchMode && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleShowAllDomains}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Show All Domains
          </button>
        </div>
      )}
    </div>

    </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

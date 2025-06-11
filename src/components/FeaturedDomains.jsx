"use client";
import { useEffect, useState } from "react";

export default function MyDomains() {
  const [condensedView, setCondensedView] = useState(false);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
 const [likes, setLikes] = useState({});
const [userId, setUserId] = useState(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    setUserId(localStorage.getItem("user_id"));
  }
}, []);


  const handleCondensedToggle = () => {
    setCondensedView(!condensedView);
  };

  useEffect(() => {
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

    fetchDomains();
  }, []);

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


const handleLikeToggle = async (domainId) => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    alert("User not logged in.");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/domain-like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain_id: domainId, user_id: userId }),
    });

    const json = await res.json();
    if (json.liked !== undefined) {
      setLikes((prev) => ({
        ...prev,
        [domainId]: {
          liked: json.liked,
          count: prev[domainId] ? (json.liked ? prev[domainId].count + 1 : prev[domainId].count - 1) : 1,
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
              liked: false
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



  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Domains</h2>
            <div className="flex flex-wrap gap-4">
              {domains.slice(0, 8).map((domain, index) => (
                <div
                  key={index}
                  className="w-full sm:w-[48%] lg:w-[23%] rounded-lg border border-[#e2e8f0] bg-white text-card-foreground shadow-sm domain-card flex flex-col"
                >
                  <div className="flex flex-col space-y-1.5 p-6 pb-2">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold tracking-tight text-xl break-all">
                        {domain.domain_name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {domain.is_sponsored === "1" && (
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#ed8936] text-white">
                          Sponsored
                        </div>
                      )}
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-200 text-gray-800">
                        .{domain.domain_name.split(".").pop()}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-grow pt-2">
                    <p className="text-muted-foreground mb-4">{domain.description}</p>
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
                        <span className="font-semibold">Expiration:</span>{" "}
                        {domain.exipry_date}
                      </p>
                      <p className="text-sm text-amber-600 font-medium">
                        {getTimeUntilExpiration(domain.exipry_date)}
                      </p>
                    </div>

                    <p className="text-lg font-bold">$99</p>
                  </div>

                  <div className="items-center p-6 flex justify-between border-t border-[#e2e8f0] pt-4">
                    <button
                      onClick={() => handleLikeToggle(domain.id)}
                      className={`justify-center whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 flex items-center gap-1 transition-all ${
                        likes[domain.id]?.liked ? 'text-red-500' : 'text-gray-500'
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
          <div className="text-center mt-8">
            <a href="/browse-domains">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[#e2e8f0] hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:bg-[#f48134] hover:text-white bg-[#f9fafb] cursor-pointer">
                View All Domains
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

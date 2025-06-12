"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function MyDomains() {
  const [condensedView, setCondensedView] = useState(false);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const domainsPerPage = 4;
  const [likes, setLikes] = useState({});
  const [userId, setUserId] = useState(null);

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

  // Pagination logic
  const indexOfLastDomain = currentPage * domainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
  const currentDomains = domains.slice(indexOfFirstDomain, indexOfLastDomain);
  const totalPages = Math.ceil(domains.length / domainsPerPage);
  const handleLikeToggle = async (domainId) => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    alert("You have to login to favorite this domain.");
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


const handleDomainBooking = async () => {
  const userId = localStorage.getItem("user_id");
  const domainId = selectedDomain?.id;
  const userType = localStorage.getItem("user_type");

  if (!userId || !domainId) {
    Swal.fire("Error", "Missing user or domain information.", "error");
    return;
  }

  if (userType !== "buyer") {
    Swal.fire("Access Denied", "You are not a buyer. Please login as a buyer.", "warning");
    return;
  }

  const bookingData = {
    domain_id: domainId,
    user_id: userId,
    status: "Pending",
    payment: "100",
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


  return (
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

      <div className="flex flex-wrap gap-4">
        {currentDomains.map((domain, index) => (
          <div
            key={index}
            className="w-full sm:w-[48%] lg:w-[23%] rounded-lg border border-[#e2e8f0] bg-white shadow-sm flex flex-col"
          >
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
              <h3 className="font-semibold tracking-tight text-xl break-all">{domain.domain_name}</h3>
              <div className="flex flex-wrap gap-2">
                {domain.is_sponsored === "1" && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#ed8936] text-white">Sponsored</span>
                )}
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-200 text-gray-800">
                  .{domain.domain_name.split(".").pop()}
                </span>
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
    </div>
  );
}

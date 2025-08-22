"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function DomainLeaderboards() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [likes, setLikes] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-domain-leaderboards`
        );
        const data = await res.json();
        if (data.status) {
          setDomains(data.data);
        }
      } catch (err) {
        console.error("Error fetching domain leaderboards:", err);
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

  const bookingData = {
    domain_id: domainId,
    user_id: userId,
    category_id: categoryId,
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







 const renderDomains = (filter) => {
  return domains
    .filter((item) => {
      if (filter === "Sponsored") return item.is_sponsored === "1";
      if (filter === "Most Popular") return item.most_popular === "1";
      if (filter === "Staff Picks") return item.staff_picks === "1";
      return false;
    })
    .map((item) => (
      <div
        key={item.id}
        className="border-b border-[#e2e8f0] pb-2 last:border-b-0 last:pb-0 flex flex-col"
      >
        <div className="flex justify-between items-center">
          <div className="font-medium text-base break-all mr-2">
            {item.domain_name}
          </div>
          <div className="text-sm font-bold">$99</div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
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
            {item.category.toLowerCase()}
            <div className="inline-flex items-center rounded-full border px-2.5 font-semibold transition-colors border-transparent hover:bg-secondary/80 bg-gray-100 text-gray-800 text-xs py-0 h-5">
              .{item.domain_name.split(".").pop()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLikeToggle(item.id, item.created_by)}
              className={`justify-center whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 flex items-center gap-1 transition-all ${
                likes[item.id]?.liked ? "text-red-500" : "text-gray-500"
              }`}
              aria-label="Like"
              title="Like"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill={likes[item.id]?.liked ? "#F56040" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-heart transition-colors duration-200"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span>{likes[item.id]?.count || 0}</span>
            </button>

            <button
              onClick={() => handleBuyClick(item)}
              className="hover:bg-[#f48134] hover:text-white rounded-md h-6 p-1 flex items-center gap-1 text-xs cursor-pointer"
            >
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
                className="lucide lucide-shopping-cart"
              >
                <circle cx={8} cy={21} r={1} />
                <circle cx={19} cy={21} r={1} />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Buy
            </button>
          </div>
        </div>
      </div>
    ));
};


  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Domain Leaderboards</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {["Most Popular", "Staff Picks", "Sponsored"].map((title) => (
            <div key={title} className="bg-white shadow-md">
              <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-brand-blue to-brand-skyBlue text-white py-3">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  {title}
                </h3>
              </div>
              <div className="p-3 grid grid-cols-1 gap-2">
                {renderDomains(title)}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/browse-domains">
            <button className="rounded-md text-sm font-medium border border-[#e2e8f0] hover:bg-[#f48134] hover:text-white h-10 px-4 py-2 bg-[#f9fafb] cursor-pointer">
              View All Domains
            </button>
          </a>
        </div>
      </div>

      {/* ✅ Modal for Purchase */}
      {selectedDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Purchase Domain
              </h2>
              <p className="text-sm text-gray-500">
                You're about to purchase {selectedDomain.domain_name}
              </p>
            </div>
            <div className="py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Domain Name:</span>
                  <span className="font-medium">
                    {selectedDomain.domain_name}
                  </span>
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
                <button
                  onClick={handleDomainBooking}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2 w-full"
                >
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
              type="button"
              onClick={handleCloseModal}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
      )}
    </section>
  );
}

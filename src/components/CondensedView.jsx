"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function MyDomains() {
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



}

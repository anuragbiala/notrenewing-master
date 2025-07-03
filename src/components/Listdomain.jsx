"use client";

import { useState, useRef, useEffect } from "react";
import Calendar from "./Calendar";
import Swal from "sweetalert2";

export default function ListDomain() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [domainName, setDomainName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [filter, setFilter] = useState("");
  const [description, setDescription] = useState("");
  const [isSponsored, setIsSponsored] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [isDomainVerified, setIsDomainVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("user_id"));
    }
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
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
    fetchCategories();
  }, []);

  // ✅ Domain Verify Function
  const handleVerifyDomain = async () => {
    setIsVerifying(true);
    setResult(null);
    setIsDomainVerified(false);

    try {
      const apiKey = "at_TCm5VoaHg0CZQXYkFQJmPfme3AQTV";
      const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${domainName}&outputFormat=JSON`;

      const res = await fetch(url);
      const data = await res.json();

      const record = data.WhoisRecord;

      if (record && record.domainName) {
        const currentUser =
          localStorage.getItem("username")?.toLowerCase() || "";
        const currentPhone =
          localStorage.getItem("phone")?.toLowerCase() || "";
        const currentEmail =
          localStorage.getItem("email")?.toLowerCase() || "";

        const registrantName =
          record.registrant?.name?.toLowerCase() || "";
        const registrantPhone =
          record.registrant?.telephone?.toLowerCase() || "";
        const registrantEmail =
          record.registrant?.email?.toLowerCase() || "";

        const expiryDate = new Date(record.expiresDate);
        const now = new Date();

        let nameMatch = false;
        let phoneMatch = false;
        let emailMatch = false;
        let expired = false;

        if (expiryDate < now) {
          expired = true;
          Swal.fire({
            icon: "error",
            title: "Domain Expired",
            text: "This domain has already expired.",
          });
        } else {
          if (
            registrantName &&
            currentUser &&
            registrantName.includes(currentUser)
          ) {
            nameMatch = true;
            Swal.fire({
              icon: "success",
              title: "Name Match",
              text: `Domain owner name matches: ${registrantName}`,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Name Mismatch",
              text:
                "Domain owner name does not match logged-in user.",
            });
          }

          if (
            registrantPhone &&
            currentPhone &&
            registrantPhone.includes(currentPhone)
          ) {
            phoneMatch = true;
            Swal.fire({
              icon: "success",
              title: "Phone Match",
              text: `Domain owner phone matches: ${registrantPhone}`,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Phone Mismatch",
              text:
                "Domain owner phone does not match logged-in user.",
            });
          }

          if (
            registrantEmail &&
            currentEmail &&
            registrantEmail.includes(currentEmail)
          ) {
            emailMatch = true;
            Swal.fire({
              icon: "success",
              title: "Email Match",
              text: `Domain owner email matches: ${registrantEmail}`,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Email Mismatch",
              text:
                "Domain owner email does not match logged-in user.",
            });
          }

          if (nameMatch && phoneMatch && emailMatch) {
            setResult({
              domainName: record.domainName,
              createdDate: record.createdDate,
              registrarName: record.registrarName,
              status: "Domain found and verified",
            });
            setIsDomainVerified(true);

            Swal.fire({
              icon: "success",
              title: "Domain Verified & Added!",
              text: `Domain ${record.domainName} is valid and belongs to you.`,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Ownership Check Failed",
              text:
                "Domain ownership could not be fully verified.",
            });
          }
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Domain Not Found",
          text:
            "The domain is not found or an error occurred.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while verifying the domain.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDomainVerified) {
      Swal.fire({
        icon: "error",
        title: "Domain Not Verified",
        text: "Please verify the domain before proceeding.",
      });
      return;
    }

    const payload = {
      domain_name: domainName,
      category_id: categoryId,
      created_by: userId,
      filter: filter,
      exipry_date: selectedDate.toISOString().split("T")[0],
      description,
      is_sponsored: isSponsored ? 1 : 0,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/add-domain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Domain added successfully!",
        });
        setDomainName("");
        setCategoryId("");
        setFilter("");
        setDescription("");
        setSelectedDate(new Date());
        setIsSponsored(false);
        setIsDomainVerified(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to add domain: " + result.message,
        });
      }
    } catch (error) {
      console.error("Error submitting domain:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleOpenModal = () => {
    setSelectedDomain(domainName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDomain("");
  };

  return (
    <div className="rounded-lg border bg-white border-[#e2e8f0] text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">List Your Domain</h3>
        <p className="text-sm text-gray-500">Enter details about the domain you're not planning to renew</p>
      </div>
     <div className="p-6 pt-0">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Domain Name */}
        <div className="space-y-2 mb-4">
          <label
            className="text-sm font-medium"
            htmlFor="domain-name"
          >
            Domain Name
          </label>
          <div className="flex space-x-2">
            <input
              value={domainName}
              onChange={(e) => {
                setDomainName(e.target.value);
                setIsDomainVerified(false);
              }}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-base bg-[#f9fafb] border-[#e2e8f0]"
              id="domain-name"
              placeholder="example.com"
              required
            />
            <button
              type="button"
              className={`${
                isVerifying
                  ? "h-10 w-[150px] rounded-md px-2 py-2 text-sm bg-gray-400 text-white cursor-wait"
                  : "h-10 w-[150px] rounded-md border px-2 py-2 text-sm bg-[#f9fafb] border-[#e2e8f0] text-gray-500"
              }`}
              onClick={handleVerifyDomain}
              disabled={isVerifying}
            >
              {isVerifying
                ? "Verifying..."
                : "Verify Domain"}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Include the full domain name with TLD (e.g., .com,
            .org)
          </p>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor="category"
          >
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-10 w-full rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        {/* Filter */}
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor="filter"
          >
            Filter By
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 w-full rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
            required
          >
            <option value="">Select Filter</option>
            <option value="Most Popular">
              Most Popular
            </option>
            <option value="Staff Picks">
              Staff Picks
            </option>
            <option value="Sponsored">Sponsored</option>
          </select>
        </div>

        {/* Sponsor */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sponsor-domain"
              checked={isSponsored}
              onChange={(e) =>
                setIsSponsored(e.target.checked)
              }
              className="h-4 w-4"
            />
            <label
              htmlFor="sponsor-domain"
              className="text-sm font-medium"
            >
              Sponsor this domain for $5
            </label>
          </div>
          <p className="text-sm text-gray-500">
            Get more visibility in the Sponsored section
          </p>
        </div>

        {/* Expiration Date */}
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor="expiration-date"
          >
            Expiration Date
          </label>
          <div
            className="relative w-full"
            ref={wrapperRef}
          >
            <button
              type="button"
              onClick={() =>
                setShowCalendar(!showCalendar)
              }
              className="h-10 w-full rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0] text-left"
            >
              {selectedDate
                .toISOString()
                .split("T")[0]}
            </button>
            {showCalendar && (
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
            id="description"
            placeholder="Describe your domain"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isDomainVerified}
          className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-white h-10 px-4 py-2 w-full ${
            isDomainVerified
              ? "bg-primary hover:bg-primary/90 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isDomainVerified
            ? "Proceed to Payment"
            : "Verify Domain First"}
        </button>
      </form>
    </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <div
              className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg sm:max-w-md"
              tabIndex={-1}
              style={{ pointerEvents: 'auto' }}
            >
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  Purchase Domain
                </h2>
                <p className="text-sm text-gray-500">
                  You're about to purchase <strong>{selectedDomain}</strong>
                </p>
              </div>

              <div className="py-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Domain Name:</span>
                    <span className="font-medium">{selectedDomain}</span>
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
                  <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
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

              {/* Close Button */}
             <button
                type="button"
                onClick={handleCloseModal}
                className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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

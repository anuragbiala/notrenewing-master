"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function MyDomains() {
  const [domains, setDomains] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return; 

    const fetchDomains = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-domain?created_by=${userId}`
        );
        const json = await res.json();
        if (json.status) {
          setDomains(json.data);
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };

    fetchDomains();
  }, [userId]);


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
    // Borrow days from previous month
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


const handleDelete = async (domainId) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(
        `https://actyvsolutions.com/notrenewing/public/api/delete-domain/${domainId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await Swal.fire("Deleted!", "The domain has been deleted.", "success");
        // Refresh the list
        setDomains(domains.filter((d) => d.id !== domainId));
      } else {
        await Swal.fire("Error!", "Failed to delete the domain.", "error");
      }
    } catch (error) {
      await Swal.fire("Error!", "Something went wrong.", "error");
      console.error("Error:", error);
    }
  }
};





  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain, index) => (
          <div
            key={index}
            className="rounded-lg border border-[#e2e8f0] bg-white text-card-foreground shadow-sm domain-card h-full flex flex-col"
          >
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold tracking-tight text-xl break-all">
                    {domain.domain_name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center rounded-full border px-2.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-gray-100 text-gray-800 text-xs py-0 h-5">
                      .{domain.domain_name.split(".").pop()}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {domain.is_sponsored === "1" ? (
                  <div className="flex items-center space-x-1 text-green-600 text-sm">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.5 11.5L11 14l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Sponsored</span>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_BASE_URL}/domain-sponsor/${domain.id}`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        );

                        const data = await res.json();

                        if (data.success) {
                          setDomains((prev) =>
                            prev.map((d) =>
                              d.id === domain.id ? { ...d, is_sponsored: "1" } : d
                            )
                          );
                        } else {
                          alert("Failed to sponsor");
                        }
                      } catch (error) {
                        console.error("Sponsor error", error);
                        alert("Error sponsoring domain");
                      }
                    }}

                    className="flex items-center space-x-2 px-4 py-2 border border-yellow-400 text-yellow-500 font-medium rounded-md hover:bg-yellow-50 text-sm cursor-pointer"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l1.8 5.6H20l-4.6 3.4 1.8 5.6L12 13.8 6.8 16.6l1.8-5.6L4 7.6h6.2L12 2z" />
                    </svg>
                    <span>Sponsor</span>
                  </button>
                )}

                    <button
                      onClick={() => handleDelete(domain.id)}
                      className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-500 rounded-md hover:bg-red-50 text-sm min-w-[109.75px] cursor-pointer"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zm3 5a1 1 0 011 1v8a1 1 0 11-2 0V9a1 1 0 011-1zm-4 1v8a1 1 0 102 0V9a1 1 0 10-2 0zm8 0v8a1 1 0 102 0V9a1 1 0 10-2 0z" />
                      </svg>
                      <span>Delete</span>
                    </button>
                </div>
              </div>
            </div>
            <div className="p-6 flex-grow pt-2">
              <p className="text-muted-foreground mb-4">
                {domain.description}
              </p>
              <div className="mb-3 flex flex-wrap gap-2">
                <div className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#317ac4] text-white flex items-center gap-1 w-fit">
                  <svg
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
            <div className="p-6 flex justify-between border-t border-[#e2e8f0] pt-4">
              <div className="flex items-center gap-1">
                <button
                  aria-label="Like"
                  title="Like"
                  className="text-sm text-gray-500 flex items-center gap-1 hover:bg-[#f48134] p-2 rounded-md hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-colors duration-200 fill-transparent"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>0</span>
                </button>
              </div>
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
              <button  onClick={() => alert("Purchase functionality not implemented")} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
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
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function InterestedBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const sellerId = localStorage.getItem("user_id");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/interested-buyers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              seller_id: sellerId,
            }),
          }
        );

        const json = await res.json();

        if (json.status && json.buyers) {
          setBuyers(json.buyers);
        } else {
          setBuyers([]);
        }
      } catch (error) {
        console.error("Error fetching buyers", error);
        setBuyers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Interested Buyers</h1>

      {loading ? (
        <p>Loading...</p>
      ) : buyers.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead style={{ backgroundColor: "#0f366b" }}>
            <tr className="text-white">
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">User Type</th>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              {/* <th className="px-4 py-3 text-left">Username</th> */}
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Company</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {buyers.map((buyer, index) => (
              <tr key={buyer.id} className="hover:bg-gray-50 transition-all">
                <td className="px-4 py-2 font-semibold text-gray-800">
                  {index + 1}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      buyer.user_type === "seller"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {buyer.user_type || "-"}
                  </span>
                </td>
                <td className="px-4 py-2 font-medium text-gray-900">
                  {buyer.full_name || "-"}
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {buyer.email || "-"}
                </td>
                {/* <td className="px-4 py-2 text-gray-700">
                  @{buyer.username || "-"}
                </td> */}
                <td className="px-4 py-2 text-gray-700">
                  {buyer.phone || "-"}
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {buyer.company || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No interested buyers yet.</p>
      )}
    </div>
  );
}

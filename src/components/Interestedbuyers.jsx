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
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Interested Buyers</h1>
      {loading ? (
        <p>Loading...</p>
      ) : buyers.length > 0 ? (
        <ul className="space-y-4">
          {buyers.map((buyer) => (
            <li
              key={buyer.id}
              className="p-4 bg-white border rounded-md shadow-sm"
            >
              <p className="font-semibold">{buyer.full_name}</p>
              <p className="text-gray-600 text-sm">{buyer.email}</p>
              <p className="text-gray-500 text-sm">{buyer.username}</p>
              <p className="text-gray-500 text-sm">{buyer.phone}</p>
              <p className="text-gray-500 text-sm">{buyer.company}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No interested buyers yet.</p>
      )}
    </div>
  );
}

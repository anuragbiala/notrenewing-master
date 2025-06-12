"use client";

import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-all-domain-bookings`);
        const data = await res.json();

        if (data.status) {
          // Filter only bookings belonging to the logged-in user
          const userBookings = data.data.filter(
            (booking) => booking.user_id.toString() === userId
          );
          setBookings(userBookings);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border border-gray-200 bg-white shadow-md p-5 flex flex-col space-y-3"
            >
              <h2 className="text-xl font-semibold">{booking.domain_name}</h2>
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Booking Date:</span>{" "}
                  {new Date(booking.created_at).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Price:</span> ${booking.payment}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded text-white text-xs ${
                      booking.status === "Confirmed"
                        ? "bg-green-500"
                        : booking.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
              <button className="bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2 w-full rounded-md">
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No bookings found for your account.</p>
        )}
      </div>
    </div>
  );
}

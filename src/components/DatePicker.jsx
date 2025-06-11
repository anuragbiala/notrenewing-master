import { useState, useRef, useEffect } from "react";
import Calendar from "./Calendar";

export default function DatePicker() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // default to current date
  const wrapperRef = useRef(null);

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

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        className="flex h-10 w-full rounded-md border px-3 py-2 text-base placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 md:text-sm bg-[#f9fafb] border-[#e2e8f0] hover:bg-[#f48134] cursor-pointer"
        onClick={() => setShowCalendar((prev) => !prev)}
        type="button"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width={18} height={18} x={3} y={4} rx={2} />
          <path d="M3 10h18" />
        </svg>
        <span>
          {selectedDate ? selectedDate.toDateString() : "Select a date"}
        </span>
      </button>
      {showCalendar && (
        <Calendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />
      )}
    </div>
  );
}

// components/Calendar.jsx
import { useState } from "react";

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function Calendar({ selectedDate, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const startDay = startOfMonth.getDay();

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const getDates = () => {
    const daysInMonth = [];
    for (let i = 0; i < startDay; i++) daysInMonth.push(null);
    for (let d = 1; d <= endOfMonth.getDate(); d++)
      daysInMonth.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)
      );
    return daysInMonth;
  };

  const dates = getDates();

  const formatMonthYear = (date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="absolute bottom-[40px] mt-2 rounded-md shadow-lg bg-white border border-gray-300 p-4 z-10">
      <div className="flex justify-between items-center mb-2">
        <button type="button"
          className="h-7 w-7 border flex justify-center items-center rounded-md bg-[#f9fafb] border-[#e2e8f0] hover:bg-orange-500 hover:text-white cursor-pointer "
          onClick={prevMonth}
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
            className="lucide lucide-chevron-left h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="font-medium">{formatMonthYear(currentMonth)}</span>
        <button type="button" className="h-7 w-7 border flex justify-center items-center rounded-md bg-[#f9fafb] border-[#e2e8f0] hover:bg-orange-500 hover:text-white cursor-pointer " onClick={nextMonth}>

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
            className="lucide lucide-chevron-right h-4 w-4"
            >
            <path d="m9 18 6-6-6-6" />
            </svg>

        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600 mb-2">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {dates.map((date, index) => {
          const isToday =
            date &&
            selectedDate &&
            date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              onClick={() => date && onSelectDate(date)}
              className={`p-2 rounded-md cursor-pointer ${
                !date
                  ? "invisible"
                  : isToday
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {date?.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
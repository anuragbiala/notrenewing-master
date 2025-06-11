export default function Pagination() {
  return (
    <>
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
                <span>Previous</span>
              </a>
            </li>

            {[1, 2, 3, 4].map((page) => (
              <li key={page}>
                <a
                  className={`flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ${
                    page === 1
                      ? "bg-gray-200 text-gray-900"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  aria-current={page === 1 ? "page" : undefined}
                >
                  {page}
                </a>
              </li>
            ))}

            <li>
              <a
                className="flex items-center gap-1 rounded-md text-sm font-medium h-10 px-3 hover:bg-gray-100 text-gray-700"
                aria-label="Go to next page"
              >
                <span>Next</span>
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
    </>
  );
}
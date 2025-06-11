"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white py-2">
        <nav className=" w-full z-20">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 py-1">
            <Link href="/" passHref legacyBehavior>
              <a className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-2xl font-bold text-brand-blue">
                  NotRenewing.com
                </span>
              </a>
            </Link>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <div className="flex items-center space-x-4">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:bg-[#f48134] cursor-pointer">
                  Sign In
                </button>

                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
                  Register
                </button>
              </div>

              <button
                data-collapse-toggle="navbar-sticky"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-controls="navbar-sticky"
                aria-expanded={isOpen}
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
            <div
              className={`items-center justify-between ${
                isOpen ? "block" : "hidden"
              } w-full md:flex md:w-auto md:order-1`}
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-4  rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                <li>
                  <Link href="/" passHref legacyBehavior>
                    <a
                      className={`block py-2 px-3 rounded-sm md:p-0  ${
                        activeItem === "Home"
                          ? "text-gray-800-white"
                          : "text-gray-800  "
                      }`}
                      aria-current="page"
                      onClick={() => handleItemClick("myAccount")}
                    >
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/" passHref legacyBehavior>
                    <a
                      className={`block py-2 px-3 rounded-sm md:p-0  ${
                        activeItem === "alltrip"
                          ? "text-gray-800"
                          : "text-gray-800  "
                      }`}
                      aria-current="page"
                      onClick={() => handleItemClick("alltrip")}
                    >
                      Browse Domains
                    </a>
                  </Link>
                </li>

                <li>
                  <Link href="/" passHref legacyBehavior>
                    <a
                      className={`block py-2 px-3 rounded-sm md:p-0  ${
                        activeItem === "offter"
                          ? "text-gray-800"
                          : "text-gray-800  "
                      }`}
                      aria-current="page"
                      onClick={() => handleItemClick("offter")}
                    >
                      How It Works
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

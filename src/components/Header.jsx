    "use client";

    import { useState, useEffect } from "react";
    import { useRouter } from "next/navigation";
    import Link from "next/link";
    import Swal from "sweetalert2";

    export default function Header() {
      const [isOpen, setIsOpen] = useState(false);
      const [activeItem, setActiveItem] = useState(null);
      const [showSignIn, setShowSignIn] = useState(false);
      const [showRegister, setShowRegister] = useState(false);
      const [userType, setUserType] = useState("Buyer");
      const router = useRouter();


       useEffect(() => {
        const type = localStorage.getItem("user_type") || "buyer";
        setUserType(type);
      }, []);

      const handleClick = () => {
        if (userType === "seller") {
          router.push("/seller-dashboard");
        } else {
          router.push("/buyer-dashboard");
        }
      };

      const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        user_type: "",
        email: "",
        password: "",
        password_confirmation: "",
      });

      const [loginData, setLoginData] = useState({
        email: "",
        password: "",
      });

      const [username, setUsername] = useState("");

      useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
      }, []);

      const toggleMenu = () => {
        setIsOpen(!isOpen);
      };

      const handleItemClick = (item) => {
        setActiveItem(item);
      };

      const closeModals = () => {
        setShowSignIn(false);
        setShowRegister(false);
      };

      const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleLoginInputChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
      };

      const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          const data = await res.json();

          if (res.ok) {
            Swal.fire("Success!", "Registration successful.", "success");
            closeModals();
            setFormData({
              full_name: "",
              username: "",
              user_type: "",
              email: "",
              password: "",
              password_confirmation: "",
            });
          } else {
            const errors = Object.values(data.errors).flat().join("\n");
            Swal.fire("Error", errors, "error");
          }
        } catch (error) {
          Swal.fire("Error", "Something went wrong!", "error");
        }
      };

    const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await res.json();
    console.log('Login response:', data);

    if (res.ok) {
      Swal.fire("Success!", "Login successful.", "success");
      closeModals();
      setLoginData({ email: "", password: "" });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username || data.user.full_name || "User");
      localStorage.setItem("useremail", data.user.email || "User");
      localStorage.setItem("user_id", data.user.id || "User");
      localStorage.setItem("user_type", data.user.user_type || "User");
      setUsername(data.user.username || data.user.full_name || "User");
      window.location.reload();
    } else {
      Swal.fire("Error", data.message || "Login failed.", "error");
    }
  } catch (error) {
    Swal.fire("Error", "Something went wrong!", "error");
  }
};


      const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      Swal.fire("Logged out", "You have been logged out.", "success").then(() => {
        window.location.href = "/"; 
      });
    } else {
      Swal.fire("Error", data.message || "Logout failed", "error");
    }
  } catch (err) {
    Swal.fire("Error", "An error occurred during logout", "error");
  }
};




      return (
        <>
        <header className="fixed top-0 left-0 w-full z-50 bg-white py-2 shadow">
        <nav className="w-full z-20">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto lg:p-4 py-1 p-2">
            <Link href="/" passHref legacyBehavior>
              <a className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="lg:text-2xl text-[16px] font-bold text-brand-blue">
                  NotRenewing.com
                </span>
              </a>
            </Link>

            <div className="flex md:order-2 space-x-2 md:space-x-0 rtl:space-x-reverse">
            <div className="flex items-center space-x-4">
            {username ? (
              <>
                 <button
                  onClick={handleClick}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 bg-gray-100 text-gray-800"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 bg-[#0f366b] text-white hover:bg-[#0f366b]/90 cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 hover:bg-[#f48134] hover:text-white bg-white cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 bg-[#0f366b] text-white hover:bg-[#0f366b]/90 cursor-pointer"
                >
                  Register
                </button>
              </>
            )}
          </div>



              <button
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-controls="navbar-sticky"
                aria-expanded={isOpen}
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
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
              <ul className="flex flex-col p-4 md:p-0 mt-4 rounded-lg md:space-x-8 md:flex-row md:mt-0">
                <li>
                  <Link href="/" passHref legacyBehavior>
                    <a
                      onClick={() => handleItemClick("Home")}
                      className={`block py-2 px-3 rounded-sm md:p-0 ${
                        activeItem === "Home"
                          ? "text-blue-600 font-semibold"
                          : "text-gray-800"
                      }`}
                    >
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="browse-domains" passHref legacyBehavior>
                    <a
                      onClick={() => handleItemClick("Browse")}
                      className={`block py-2 px-3 rounded-sm md:p-0 ${
                        activeItem === "Browse"
                          ? "text-blue-600 font-semibold"
                          : "text-gray-800"
                      }`}
                    >
                      Browse Domains
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="how-it-works" passHref legacyBehavior>
                    <a
                      onClick={() => handleItemClick("HowItWorks")}
                      className={`block py-2 px-3 rounded-sm md:p-0 ${
                        activeItem === "HowItWorks"
                          ? "text-blue-600 font-semibold"
                          : "text-gray-800"
                      }`}
                    >
                      How It Works
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Modals for SignIn/Register can go here (not included for brevity) */}

      </header>

      {/* Sign In Modal */}
     {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Sign In
              </h2>
              <p className="text-sm text-[#64748b]">
                Enter your credentials to access your account
              </p>
            </div>

            <button
              type="button"
              onClick={closeModals}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
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

            <form className="space-y-4 mt-10" onSubmit={handleLoginSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  required
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f366b]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginInputChange}
                  required
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f366b]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 px-4 py-2 text-sm font-medium text-white bg-[#0f366b] rounded-lg transition cursor-pointer"
              >
                Sign In
              </button>

              {/* <button
                type="button"
                className="w-full text-sm text-[#0f366b] hover:underline mt-1 cursor-pointer"
              >
                Forgot your password?
              </button> */}
            </form>
          </div>
        </div>
      )}
      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 ">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Create an Account
              </h2>
              <p className="text-sm text-[#64748b]">
                Register to list your expiring domains
              </p>
            </div>

            <button
              type="button"
              onClick={closeModals}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
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

            <form className="space-y-4 mt-10" onSubmit={handleRegisterSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="full_name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f366b]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f366b]"
                />
              </div>

              <div className="space-y-1 mt-4">
              <label
                htmlFor="user_type"
                className="text-sm font-medium text-gray-700"
              >
                User Type
              </label>
              <select
                id="user_type"
                name="user_type"
                value={formData.user_type}
                onChange={handleInputChange}
                required
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f366b]"
              >
                <option value="">Select User Type</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f366b]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f366b]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password_confirmation"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f366b]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 px-4 py-2 text-sm font-medium text-white bg-[#0f366b] rounded-lg transition cursor-pointer"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

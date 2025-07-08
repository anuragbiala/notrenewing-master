  "use client";

    import { useState, useEffect } from "react";
    import { useRouter } from "next/navigation";
   export default function Footer() {
      const [userType, setUserType] = useState("Buyer");
      const router = useRouter();

     useEffect(() => {
          const type = localStorage.getItem("user_type") || "buyer";
          setUserType(type);
        }, []);
  
       const handleClick = () => {
        const userId = localStorage.getItem("user_id");
  
        if (!userId) {
          alert("Please log in First.");
          return;
        }
  
        if (userType === "seller") {
          router.push("/seller-dashboard");
        } else {
          router.push("/buyer-dashboard");
        }
      };

  return (
    <>
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">NotRenewing.com</h2>
              <p className="max-w-md">
                The marketplace for soon-to-expire domain names.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a className="hover:underline" href="/">
                      Home
                    </a>
                  </li>
                  <li>
                    <a className="hover:underline" href="browse-domains">
                      Browse Domains
                    </a>
                  </li>
                 <li>
                  <button
                    onClick={handleClick}
                    className="text-white hover:underline font-medium"
                  >
                    My Account
                  </button>
                </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a className="hover:underline" href="how-it-works">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a className="hover:underline" href="/faq">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a className="hover:underline" href="contact-us">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a className="hover:underline" href="terms-service">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a className="hover:underline" href="privacy-policy">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>© 2025 NotRenewing.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

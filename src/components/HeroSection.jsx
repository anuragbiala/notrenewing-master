    "use client";

    import { useState, useEffect } from "react";
    import { useRouter } from "next/navigation";
    import Link from "next/link";
    import Swal from "sweetalert2";

    export default function HeroSection() {
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
  return (
    <>
      <main>
        <section className="hero-gradient text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Domain Before It Expires
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Discover soon-to-expire domains at a fixed price of $99. No
              bidding, no hassle.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/browse-domains">
                <button className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 h-11 rounded-md px-8 border bg-background border-white hover:bg-white hover:text-accent-foreground text-[#0f366b] cursor-pointer">
                  Browse Domains
                </button>
              </a>
              <a>
                <button onClick={handleClick} className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 h-11 rounded-md px-8 border bg-background border-white hover:bg-white hover:text-accent-foreground text-[#0f366b] cursor-pointer">
                  List Your Domain
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

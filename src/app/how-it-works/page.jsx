"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Faq from "@/components/Faq";

export default function HowitWorks() {
  const [benefits, setBenefits] = useState([]);
  const [sellersbenefits, setSellersBenefits] = useState([]);
  const [workBuyers, setWorkBuyers] = useState([]);
  const [workSellers, setWorkSellers] = useState([]);
  const [activeTab, setActiveTab] = useState("buyers");

  useEffect(() => {
    const fetchBuyerBenefits = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-benefits-buyer`);
        const data = await res.json();

        if (data.status && Array.isArray(data.data)) {
          setBenefits(data.data);
        }
      } catch (error) {
        console.error("Error fetching buyer benefits:", error);
      }
    };

    fetchBuyerBenefits();
  }, []);

  useEffect(() => {
    const fetchSellerBenefits = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-benefits-seller`);
        const data = await res.json();

        if (data.status && Array.isArray(data.data)) {
          setSellersBenefits(data.data);
        }
      } catch (error) {
        console.error("Error fetching seller benefits:", error);
      }
    };

    fetchSellerBenefits();
  }, []);

  useEffect(() => {
  const fetchWorkBuyers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-work-buyers`);
      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        setWorkBuyers(data.data);
      }
    } catch (error) {
      console.error("Error fetching work for buyers:", error);
    }
  };

  fetchWorkBuyers();
}, []);


  useEffect(() => {
  const fetchWorkSellers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-work-sellers`);
      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        setWorkSellers(data.data);
      }
    } catch (error) {
      console.error("Error fetching work for Sellers:", error);
    }
  };

  fetchWorkSellers();
}, []);
  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center my-4">
            How NotRenewing.com Works
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Our platform connects domain buyers with sellers who don't plan to
            renew their domains, creating a win-win marketplace.
          </p>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div
              role="tablist"
              className="grid w-full max-w-md grid-cols-2 rounded-md bg-[#f1f5f9] text-muted-foreground p-2"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "buyers"}
                onClick={() => setActiveTab("buyers")}
                className={`px-3 py-1.5 text-sm font-medium rounded-sm transition focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 cursor-pointer ${
                  activeTab === "buyers" ? "bg-white text-black shadow-sm" : ""
                }`}
              >
                For Buyers
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "sellers"}
                onClick={() => setActiveTab("sellers")}
                className={`px-3 py-1.5 text-sm font-medium rounded-sm transition focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 cursor-pointer ${
                  activeTab === "sellers" ? "bg-white text-black shadow-sm" : ""
                }`}
              >
                For Sellers
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="  mx-auto text-center">
            {activeTab === "buyers" && (
              <div id="buyers-tab" role="tabpanel">
                <div
                  data-state="active"
                  data-orientation="horizontal"
                  role="tabpanel"
                  aria-labelledby="radix-:rq:-trigger-buyers"
                  id="radix-:rq:-content-buyers"
                  tabIndex={0}
                  className="mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {workBuyers.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg bg-card text-card-foreground border-2 transition-all shadow-sm border-[#e2e8f0] hover:border-[#bcc5d2] bg-white"
                        >
                          <div className="p-6">
                            <div className="flex justify-center items-center mb-4">
                              <img src={item.image} className="w-10 h-10" />
                            </div>

                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-sm mt-8 text-left">
                      <h2 className="text-2xl font-bold mb-6">Benefits For Buyers</h2>
                      <ul className="list-disc pl-5 space-y-4">
                        {benefits.map((item) => (
                          <li key={item.id} className="text-gray-800">
                            {item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                </div>
              </div>
            )}

            {activeTab === "sellers" && (
              <div id="sellers-tab" role="tabpanel">
                <div
                  data-state="active"
                  data-orientation="horizontal"
                  role="tabpanel"
                  aria-labelledby="radix-:r3:-trigger-sellers"
                  id="radix-:r3:-content-sellers"
                  tabIndex={0}
                  className="mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {workSellers.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg bg-card text-card-foreground border-2 transition-all shadow-sm border-[#e2e8f0] hover:border-[#bcc5d2] bg-white"
                        >
                          <div className="p-6">
                            <div className="flex justify-center items-center mb-4">
                              <img src={item.image} className="w-10 h-10" />
                            </div>

                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                  <div className="bg-white p-8 rounded-lg shadow-sm mt-8 text-left">
                      <h2 className="text-2xl font-bold mb-6">Benefits For Sellers</h2>
                      <ul className="list-disc pl-5 space-y-4">
                        {sellersbenefits.map((item) => (
                          <li key={item.id} className="text-gray-800">
                            {item.content}
                          </li>
                        ))}
                      </ul>
                    </div>

                </div>
              </div>
            )}
          </div>

          <Faq />

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Whether you're looking to buy domains before they expire or sell
              domains you don't plan to renew, NotRenewing.com is your
              marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="" passHref>
                <span className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90">
                  Browse Domains
                </span>
              </Link>
              <Link href=" " passHref>
                <span className="border border-primary text-primary px-6 py-3 rounded-md font-medium bg-white hover:bg-gray-100">
                  Sell Your Domain
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
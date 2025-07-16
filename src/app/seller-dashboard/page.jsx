"use client";
import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MyDomains from "@/components/Mydomains";
import ListDomain from "@/components/Listdomain";
// import InterestedBuyers from "@/components/Interestedbuyers";
import AccountSettings from "@/components/Accountsettings";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("my-domains");

  const tabs = [
    { key: "my-domains", label: "My Domains" },
    { key: "list-domain", label: "List a Domain" },
    // { key: "interested-buyers", label: "Interested Buyers" },
    { key: "account", label: "Account Settings" },
  ];

  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold my-8">My Dashboard</h1>

          {/* Tab buttons */}
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground bg-[#f1f5f9]"
            tabIndex={0}
            data-orientation="horizontal"
            style={{ outline: "none" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-background text-foreground shadow-sm"
                    : ""
                }`}
                tabIndex={activeTab === tab.key ? 0 : -1}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-6">
            {activeTab === "my-domains" && (
              <div>
                <MyDomains />
              </div>
            )}
            {activeTab === "list-domain" && (
              <div>
                <ListDomain />
              </div>
            )}
            {/* {activeTab === "interested-buyers" && (
              <div>
                <InterestedBuyers />
              </div>
            )} */}
            {activeTab === "account" && (
              <div>
                <AccountSettings />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
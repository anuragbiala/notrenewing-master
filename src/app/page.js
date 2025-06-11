import DomainLeaderboards from "@/components/DomainLeaderboards";
import FeaturedDomains from "@/components/FeaturedDomains";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import SearchBar from "@/components/SearchBar";
import SubscribeNewsletter from "@/components/SubscribeNewsletter";
import Image from "next/image";

export default function Home() {
  return (
     <>
     <Header/>
     <HeroSection/>
     <SearchBar/>
     <HowItWorks/>
     <DomainLeaderboards/>
     <FeaturedDomains/>
     <SubscribeNewsletter/>
     <Footer/>
     </> 
  );
}

"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";

const HeroSection = () => {

    const imageRef = useRef(null);

    useEffect(() => {
        const imageElement = imageRef.current;  

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold) {
              imageElement.classList.add("hero-image-scrolled");
            } else {
              imageElement.classList.remove("hero-image-scrolled");
            }

        };

        window.addEventListener("scroll", handleScroll)
        
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          {" "}
          Manage Your Finances <br /> With Intelligence{" "}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          GrowEasy is a personal finance management app that helps you track your expenses, set budgets, and achieve your financial goals. With GrowEasy, you can easily manage your money and make informed financial decisions.
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started Now !
            </Button>
          </Link>
          <Link href="https://www.youtube.com/watch?v=egS6fnZAdzk&t=5144s">
            <Button size="lg" variant="outline  " className="px-8">
              Watch Demo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <div ref={imageRef} className="hero-image">
            <Image 
            src="/banner.jpeg" 
            width={1280} 
            height={720} 
            alt="Dashboard Preview" 
            className="rounded-lg shadow-2xl border mx-auto" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

// Counter component for animated number counting
const Counter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const startAnimation = (timestamp: number) => {
      startTime = timestamp;
      animate(timestamp);
    };

    const animate = (timestamp: number) => {
      const runtime = timestamp - startTime;
      const relativeProgress = runtime / duration;

      if (relativeProgress < 1) {
        setCount(Math.floor(end * relativeProgress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(startAnimation);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}</>;
};

export default function HeroSection() {
  return (
      <div className="px-4 sm:px-6 lg:pl-24 lg:pr-0">


      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center text-center lg:text-left mb-2 relative">
        <div className="w-full lg:w-1/2 z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-tight">Your Gateway To Medical</h1>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight">Device Safety Reporting</h1>

          <div className="mt-4 sm:mt-6">
            <p className="text-base sm:text-lg font-bold text-black">Simplifying the process of reporting</p>
            <p className="text-base sm:text-lg font-bold text-black">adverse medical device events for</p>
            <p className="text-base sm:text-lg font-bold text-black">everyone</p>
          </div>
        </div>

        {/* Image */}
        <div className="w-full lg:w-1/2 max-w-xs sm:max-w-md lg:max-w-lg mt-6 lg:mt-0 lg:ml-auto relative">
          <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square">
            <Image 
              src="/image/landing-right-Banner1.png" 
              alt="" 
              fill
              className="object-contain lg:mr-[-90px]"
            />
          </div>
        </div>

        {/* Background decorative elements - hidden on mobile */}
        <div className="hidden lg:block absolute top-[-700px] right-0 w-[640px] h-[960px] bg-blue-500/10 rounded-bl-[500px] -z-10"></div>
        <div className="hidden lg:block absolute top-[-320px] right-0 w-[640px] h-[1040px] border border-green-600 rounded-bl-[3000px] rounded-tl-[2000px] -z-10"></div>
      </div>

      {/* Learn More Button */}
      <div className="mt-4 sm:mt-6 flex justify-center lg:justify-start">
        <button className="bg-blue-600 bg-gradient-to-r from-blue-400 to-blue hover:bg-blue-600 cursor-pointer px-8 sm:px-12 lg:px-15 py-2 text-black text-base sm:text-lg rounded-full border-none font-bold transition-colors">
          LEARN MORE
        </button>
      </div>

      {/* Business Solutions Section */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start mt-8 space-y-6 sm:space-y-0 sm:space-x-4 lg:space-x-8">
        <div className="text-center sm:text-left max-w-xs sm:max-w-none">
          <h1 className="text-lg font-bold text-blue-800">Business Solution</h1>
          <p className="text-sm text-gray-600">Understand the importance of reporting</p>
          <p className="text-sm text-gray-600">adverse events to improve device safety</p>
          <p className="text-sm text-gray-600">and regulatory compliance.</p>
          <div className="w-full h-1 bg-blue-500 rounded-full my-2"></div>
        </div>

        {/* Vertical Line (Hidden on small screens) */}
        <div className="hidden sm:block w-[1px] h-20 bg-gray-300"></div>

        <div className="text-center sm:text-left max-w-xs sm:max-w-none">
          <h1 className="text-xl text-black">Who Can Report?</h1>
          <p className="text-sm text-gray-600">Patients, Caretakers, Healthcare</p>
          <p className="text-sm text-gray-600">Professionals, and many more .....</p>
        </div>

        {/* Vertical Line (Hidden on small screens) */}
        <div className="hidden sm:block w-[1px] h-20 bg-gray-300"></div>

        <div className="text-center sm:text-left max-w-xs sm:max-w-none">
          <h1 className="text-xl text-black">Event Types</h1>
          <p className="text-sm text-gray-600">Report any adverse events, including device</p>
          <p className="text-sm text-gray-600">malfunctions, injuries, or safety concerns</p>
          <p className="text-sm text-gray-600">and many more...</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 lg:gap-x-20 xl:gap-x-60 mt-8 mb-5">
        {/* First Item */}
        <div className="flex items-center justify-center sm:justify-start space-x-4">
          <Image src="/image/landing-middle-people.png" alt="" width={50} height={50} className="flex-shrink-0" />
          <div>
            <h2 className="text-2xl text-green-800 font-bold">+<Counter end={1500} /></h2>
            <p className="text-sm text-gray-600">Reports Submitted</p>
          </div>
        </div>

        {/* Second Item */}
        <div className="flex items-center justify-center sm:justify-start space-x-4">
          <Image src="/image/landing-middle-home.png" alt="" width={50} height={50} className="flex-shrink-0" />
          <div>
            <h2 className="text-2xl text-green-800 font-bold">+<Counter end={500} /></h2>
            <p className="text-sm text-gray-600">Verified Users</p>
          </div>
        </div>

        {/* Third Item */}
        <div className="flex items-center justify-center sm:justify-start space-x-4">
          <Image src="/image/landing-middle-plus.png" alt="" width={50} height={50} className="flex-shrink-0" />
          <div>
            <h2 className="text-2xl text-green-800 font-bold">+<Counter end={100} /></h2>
            <p className="text-sm text-gray-600">Devices Monitored</p>
          </div>
        </div>
      </div>
    </div>
  );
}
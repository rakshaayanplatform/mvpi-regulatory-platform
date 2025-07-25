"use client";

import { useRouter } from "next/navigation";
import { HomeIcon, ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="bg-white relative h-screen flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="relative z-20">
      </div>

      {/* Full Height Background only behind '0' */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-screen flex justify-center z-0">
        <img
          src="/image/ErrorRectangle.png"
          className="h-screen object-cover 
            w-24 sm:w-36 md:w-48 lg:w-64 xl:w-80"
          alt="Background Rectangle"
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center flex-grow px-2 sm:px-4 md:px-8 z-10">
        {/* Error Images */}
        <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 relative items-center">
          {/* Left 4 */}
          <div className="w-full flex justify-center items-center">
            <span className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] xl:text-[24rem] font-extrabold text-lime-500 leading-none select-none">
              4
            </span>
          </div>
          {/* Middle 0 */}
          <div className="flex justify-center items-center w-full">
            <div
              className="rounded-full"
              style={{
                width: "clamp(100px, 25vw, 300px)", // responsive width
                height: "clamp(100px, 25vw, 300px)", // responsive height
                backgroundImage: "linear-gradient(135deg, #A3E635, #3B82F6)", // lime to blue
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="bg-white rounded-full"
                style={{
                  width: "60%",
                  height: "60%",
                }}
              />
            </div>
          </div>

          {/* Right 4 */}
          <div className="w-full flex justify-center items-center">
            <span className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] xl:text-[24rem] font-extrabold text-blue-500 leading-none select-none">
              4
            </span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mt-[-10px] sm:mt-[-15px] md:mt-[-5px] text-center relative">
          <h1 className="font-itim text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-blue-500">
            Something went Wrong!
          </h1>
        </div>

        {/* Go Back Button */}
        <button
          className="mt-4 sm:mt-6 md:mt-8 lg:mt-12 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[240px] 
            h-[30px] sm:h-[35px] md:h-[40px] lg:h-[50px] 
            bg-[#72D500] rounded-full hover:bg-green-700 
            font-itim text-white font-bold text-lg sm:text-xl md:text-2xl transition duration-300"
          type="button"
        >
          Go Back
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-600">
        © 2024 Rakshaayan. All rights reserved.
      </footer>
      <div className="w-full mt-auto">
      </div>
    </div>
  );
}

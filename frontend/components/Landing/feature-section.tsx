"use client";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function FeatureSection() {
    return (
        <div className="relative px-4 sm:px-8 md:px-12 lg:px-24 overflow-hidden">
            <h1 className="text-2xl sm:text-3xl font-bold mt-10 mb-4">Feature</h1>
            <div className="flex justify-end mb-4">
                <button className="cursor-pointer flex items-center gap-1 text-base sm:text-lg text-blue-500 font-bold hover:text-blue-600 transition-colors">
                    SEE ALL
                    <ArrowRight className="w-6 h-5 sm:w-7 sm:h-6" />
                </button>
            </div>

            {/* Background decorative circle - adjusted for mobile */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start">
                {/* Left Image */}
                <div className="w-full lg:w-auto mb-12 lg:mb-0">
  <div className="relative w-[550px] h-[550px] rounded-full border border-gray-300 overflow-visible ml-[-100px]">
    <div className="absolute inset-0 flex items-center justify-center">
      <Image 
        src="/image/landing-left-sevices.png" 
        alt="" 
        width={300} 
        height={300} 
        className="object-contain" 
      />
    </div>
  </div>
</div>


                {/* Feature Cards Container */}
                <div className="w-full flex flex-col sm:flex-row lg:flex-row justify-center lg:justify-end items-center gap-6 sm:gap-4 lg:gap-8 xl:gap-32 p-4">
                    {/* Feature Card 1 */}
                    <div className="bg-sky-300 w-full max-w-[250px] h-[350px] rounded-[25px] shadow-lg shadow-gray-700/40">
                        <Image
                            src="/image/landing-middle-feature1.png"
                            alt="Secure Data Handling"
                            width={200}
                            height={70}
                            className="w-full h-auto rounded-tr-[25px] rounded-tl-[25px] rounded-br-[10px]"
                        />
                        <h1 className="text-sm text-center mt-3 font-bold px-2">Secure Data Handling</h1>
                        <p className="text-xs text-center mt-3 px-4">
                            Your reports are encrypted and kept confidential to protect patient privacy.
                        </p>
                        <div className="flex justify-center mt-3 mb-4">
                            <button className="text-xs w-24 h-9 bg-lime-400 border-none rounded-br-[25px] rounded-tl-[25px] cursor-pointer hover:bg-lime-500 transition-colors">
                                SEE DETAILS
                            </button>
                        </div>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="bg-sky-300 w-full max-w-[250px] h-[350px] rounded-[25px] shadow-lg shadow-gray-700/40">
                        <Image
                            src="/image/landing-middle-feature2.png"
                            alt="Real-Time Alerts"
                            width={200}
                            height={70}
                            className="w-full h-auto rounded-tr-[25px] rounded-tl-[25px] rounded-br-[10px]"
                        />
                        <h1 className="text-sm text-center mt-3 font-bold px-2">Real-Time Alerts</h1>
                        <p className="text-xs text-center mt-3 px-4">
                            Get notified immediately about critical updates on reported events.
                        </p>
                        <div className="flex justify-center mt-3 mb-4">
                            <button className="text-xs w-24 h-9 bg-lime-400 border-none rounded-br-[25px] rounded-tl-[25px] cursor-pointer hover:bg-lime-500 transition-colors">
                                SEE DETAILS
                            </button>
                        </div>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="bg-sky-300 w-full max-w-[250px] h-[350px] rounded-[25px] shadow-lg shadow-gray-700/40">
                        <Image
                            src="/image/landing-middle-feature3.png"
                            alt="User-Friendly Interface"
                            width={200}
                            height={70}
                            className="w-full h-auto rounded-tr-[25px] rounded-tl-[25px] rounded-br-[10px]"
                        />
                        <h1 className="text-sm text-center mt-3 font-bold px-2">User-Friendly Interface</h1>
                        <p className="text-xs text-center mt-3 px-4">
                            "Intuitive" design for seamless reporting even for non-technical users.
                        </p>
                        <div className="flex justify-center mt-3 mb-4">
                            <button className="text-xs w-24 h-9 bg-lime-400 border-none rounded-br-[25px] rounded-tl-[25px] cursor-pointer hover:bg-lime-500 transition-colors">
                                SEE DETAILS
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center sm:justify-start mt-6 gap-2 pl-0 sm:pl-40">
                <button className="cursor-pointer text-blue-500 font-bold hover:text-blue-600 transition-colors p-1">
                    <ArrowRight className="w-8 h-7 sm:w-9 sm:h-8" />
                </button>
                <button className="cursor-pointer text-blue-500 font-bold hover:text-blue-600 transition-colors p-1">
                    <ArrowLeft className="w-8 h-7 sm:w-9 sm:h-8" />
                </button>
            </div>
        </div>
    );
}
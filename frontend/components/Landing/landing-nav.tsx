"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState , useEffect } from "react";

export default function LandingNav() {
    const [lang, setLang] = useState<string>("english");
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const navMap = [
        { title: "Home", path: "/", audioSrc: "/audio/homeEnglish.mp3" },
        { title: "Clinic Facilities", path: "/", audioSrc: "/audio/clinicFecilitiesEnglish.mp3" },
        { title: "Testimonials", path: "/" , audioSrc: "/audio/testimonialEngllish.mp3"},
        { title: "Trusted by", path: "/", audioSrc: "/audio/trustedByEnglish.mp3" },
        { title: "Try Now", path: "/", audioSrc: "/audio/tryNowEnglish.mp3" },
    ];

    // Additional audio mappings
    const audioMappings = {
        logo: "/audio/nimhans.mp3",
        signin: "/audio/signin-signup.mp3",
        language: "/audio/language-selection.mp3",
        english: "/audio/english.mp3",
        kannada: "/audio/kannada.mp3"
    };

    // Function to play pre-recorded audio
    const playAudio = (audioSrc: string): void => {
        stopAudio(); // Stop any currently playing audio
        
        if (typeof window !== 'undefined') {
            // Create a new audio element if it doesn't exist
            if (!audioRef.current) {
                audioRef.current = new Audio();
            }
            
            // Set the source and play
            audioRef.current.src = audioSrc;
            audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error);
            });
        }
    };

    // Function to stop audio
    const stopAudio = (): void => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Cleanup when component unmounts
    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className="flex w-full flex-wrap items-center justify-between">
            {/* Logo and Institution Name */}
            <div className="flex items-center gap-x-2 sm:gap-x-3 z-10">
                <Image src="/image/nav-left-logo.png" alt="Logo" width={50} height={50} className="sm:w-[60px] sm:h-[60px]" />
                <div className="flex flex-col">
                    <span className="playFair text-lg sm:text-2xl font-medium font-serif">NIMHANS</span>
                    <span className="belleFair text-xs font-serif hidden sm:block">
                        An Institute of National Importance
                    </span>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="lg:hidden text-gray-600 focus:outline-none z-10"
                onClick={toggleMobileMenu}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    className="w-6 h-6"
                >
                    {mobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Navigation and Authentication */}
            <div
  className={`${mobileMenuOpen ? 'flex bg-white shadow-lg px-6 py-4 rounded-md mx-4' : 'hidden'} 
    flex-col lg:flex lg:flex-row lg:bg-transparent 
    w-[calc(100%-2rem)] lg:w-auto 
    mt-4 lg:mt-0 
    lg:items-center lg:justify-end 
    absolute lg:relative 
    top-20 lg:top-0 
    left-0 right-0 
    z-30`}
>
<div className="flex flex-col lg:flex-row text-sm gap-3 lg:gap-4 xl:gap-6 font-bold mb-4 lg:mb-0 lg:ml-8">
  {navMap.map((nav, index) => (
    <Link href={nav.path} key={index}>
      <span
        className="hover:cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl block hover:text-blue-600 transition-colors"
        onMouseEnter={() => nav.audioSrc && playAudio(nav.audioSrc)}
      >
        {nav.title}
      </span>
    </Link>
  ))}
    </div>

                {/* Sign In/Sign Up and Language Selector */}
                <div className="flex flex-col lg:flex-row cursor-pointer items-start lg:items-center gap-y-3 lg:gap-x-2 xl:gap-x-4 lg:ml-auto">
                    <button className="bg-lime-400 hover:bg-lime-600 px-3 sm:px-4 py-1 text-black text-sm sm:text-lg rounded-full border-none font-bold cursor-pointer mb-3 lg:mb-0 lg:mx-2 xl:mx-6 transition-colors">
                        SIGN IN / SIGNUP
                    </button>
                    <div className="relative flex items-center border-2 border-blue-400 rounded-md px-2 sm:px-3 py-1">
                        <Image src="/image/nav-right-world.png" alt="Globe Icon" width={15} height={18} className="mr-1 sm:mr-2 sm:w-[17px] sm:h-[20px]" />
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            className="bg-blue-100/10 text-sm sm:text-lg font-bold cursor-pointer focus:outline-none"
                        >
                            <option disabled>Select language</option>
                            <option value="english">English - En</option>
                            <option value="kannada">Kannada - Kn</option>
                        </select>
                    </div>
                </div>
            </div>
        </nav>
    );
}
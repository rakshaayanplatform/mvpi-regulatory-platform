"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";

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
      const relativeProgress = runtime / duration!;
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

function LandingNav() {
  const [lang, setLang] = useState<string>("english");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navMap = [
    { title: "Home", path: "/", audioSrc: "/audio/homeEnglish.mp3" },
    { title: "Clinic Facilities", path: "/", audioSrc: "/audio/clinicFecilitiesEnglish.mp3" },
    { title: "Testimonials", path: "/", audioSrc: "/audio/testimonialEngllish.mp3" },
    { title: "Trusted by", path: "/", audioSrc: "/audio/trustedByEnglish.mp3" },
    { title: "Try Now", path: "/", audioSrc: "/audio/tryNowEnglish.mp3" },
  ];
  const audioMappings = {
    logo: "/audio/nimhans.mp3",
    signin: "/audio/signin-signup.mp3",
    language: "/audio/language-selection.mp3",
    english: "/audio/english.mp3",
    kannada: "/audio/kannada.mp3"
  };
  const playAudio = (audioSrc: string): void => {
    stopAudio();
    if (typeof window !== 'undefined') {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = audioSrc;
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };
  const stopAudio = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return (
    <nav className="flex w-full flex-wrap items-center justify-between px-5 py-3">
      {/* Logo and Institution Name */}
      <div className="flex items-center gap-x-3 z-10">
        <Image src="/image/nav-left-logo.png" alt="Logo" width={60} height={60} />
        <div className="flex flex-col">
          <span className="playFair text-2xl font-medium font-serif">NIMHANS</span>
          <span className="belleFair text-xs font-serif">
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
      <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex lg:flex-1 flex-col lg:flex-row w-full lg:w-auto mt-4 lg:mt-0 lg:items-center lg:justify-end`}>
        {/* Navigation Links */}
        <div className="flex flex-col lg:flex-row text-sm gap-3 lg:gap-6 font-bold mb-4 lg:mb-0 lg:ml-8">
          {navMap.map((nav, index) => (
            <Link href={nav.path} key={index}>
              <span
                className="hover:cursor-pointer text-gray-600 block py-2 lg:py-0"
                onMouseEnter={() => nav.audioSrc && playAudio(nav.audioSrc)}
              >
                {nav.title}
              </span>
            </Link>
          ))}
        </div>
        {/* Sign In/Sign Up and Language Selector */}
        <div className="flex flex-col lg:flex-row cursor-pointer items-start lg:items-center gap-y-3 lg:gap-x-4 lg:ml-auto">
          <button className="bg-lime-400 hover:bg-lime-600 px-2 text-black text-lg rounded-full border-none font-bold cursor-pointer mb-3 lg:mb-0 lg:mx-6">
            SIGN IN / SIGNUP
          </button>
          <div className="relative flex items-center border-2 border-blue-400 rounded-md px-3 py-1">
            <Image src="/image/nav-right-world.png" alt="Globe Icon" width={17} height={20} className="mr-2" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-blue-100/10 text-lg font-bold cursor-pointer focus:outline-none"
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

function HeroSection() {
  return (
    <div className="md:px-12 lg:px-24">
        {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center text-center lg:text-left mb-2">
        <div className="">
          <h1 className="text-3xl sm:text-4xl font-serif">Your Gateway To Medical</h1>
          <h1 className="font-serif text-3xl sm:text-4xl">Device Safety Reporting</h1>
          <p className="text-lg font-bold mt-2 text-black">Simplifying the process of reporting</p>
          <p className="text-lg font-bold text-black">adverse medical device events for</p>
          <p className="text-lg font-bold text-black">everyone</p>
            </div>
        {/* Image */}
        <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg mt-6 lg:ml-auto mr-[-90px]">
          <Image src="/image/hospital.png" alt="Medical Illustration" width={450} height={300} layout="responsive" />
                </div>
        <div className="hidden lg:block absolute top-[-700px] right-0 left-156 w-160 h-240 bg-blue-500/10 rounded-bl-[500px]"></div>
        <div className="hidden lg:block absolute top-[-320px] right-0 left-156 w-160 h-260 border border-green-600 rounded-bl-[3000px] rounded-tl-[2000px]"></div>
              </div>
      {/* Learn More Button */}
      <div className="mt-1 flex justify-center lg:justify-start">
        <button className="bg-blue-600 bg-gradient-to-r from-blue-400 to-blue hover:bg-blue-600 cursor-pointer px-15 py-1 text-black text-lg rounded-full border-none font-bold">
          LEARN MORE
                </button>
              </div>
      {/* Business Solutions Section */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start mt-8 space-y-6 sm:space-y-0 sm:space-x-8">
        <div className="text-center mr-20 sm:text-left">
          <h1 className="text-lg font-bold text-blue-800">Business Solution</h1>
          <p className="text-sm text-gray-600">Understand the importance of reporting</p>
          <p className="text-sm text-gray-600">adverse events to improve device safety</p>
          <p className="text-sm text-gray-600">and regulatory compliance.</p>
          <div className="w-full h-1 bg-blue-500 rounded-full my-2"></div>
            </div>
        {/* Vertical Line (Hidden on small screens) */}
        <div className="hidden sm:block w-[1px] h-20 bg-gray-300"></div>
        <div className="text-center ml-10 mr-20 sm:text-left">
          <h1 className="text-xl text-black">Who Can Report?</h1>
          <p className="text-sm text-gray-600">Patients, Caretakers, Healthcare</p>
          <p className="text-sm text-gray-600">Professionals, and many more .....</p>
                </div>
        {/* Vertical Line (Hidden on small screens) */}
        <div className="hidden sm:block w-[1px] h-20 bg-gray-300"></div>
        <div className="text-center ml-10 sm:text-left">
          <h1 className="text-xl text-black">Event Types</h1>
          <p className="text-sm text-gray-600">Report any adverse events, including device</p>
          <p className="text-sm text-gray-600">malfunctions, injuries, or safety concerns</p>
          <p className="text-sm text-gray-600">and many more...</p>
                </div>
              </div>
      {/* Statistics Section */}
      <div className="flex flex-col lg:flex lg:gap-x-60 sm:flex-row flex-wrap justify-center gap-x-20 mt-8 mb-5">
        {/* First Item */}
        <div className="flex items-center space-x-4">
          <Image src="/image/landing-middle-people.png" alt="Report Submitted" width={50} height={50} />
          <div>
            <h2 className="text-2xl text-green-800 font-bold">+<Counter end={1500} /></h2>
            <p className="text-sm text-gray-600">Reports Submitted</p>
                </div>
              </div>
        {/* Second Item */}
        <div className="flex ml-[-20px] items-center space-x-5">
          <Image src="/image/landing-middle-home.png" alt="Verified Users" width={50} height={50} />
          <div>
            <h2 className="text-2xl text-green-800 font-bold">+<Counter end={500} /></h2>
            <p className="text-sm text-gray-600">Verified Users</p>
            </div>
                </div>
        {/* Third Item */}
        <div className="flex ml-[-20px] items-center space-x-4">
          <Image src="/image/landing-middle-plus.png" alt="Devices Monitored" width={50} height={50} />
          <div>
            <h2 className="text-2xl text-green-800 font-bold">+<Counter end={100} /></h2>
            <p className="text-sm text-gray-600">Devices Monitored</p>
                </div>
              </div>
            </div>
          </div>
  );
}

function FeatureSection() {
  return (
    <div>
      <h1 className="ml-24 text-3xl font-bold mt-10">Features</h1>
      <button className="mt-8 mb-2 ml-230 cursor-pointer flex items-center gap-1 text-lg text-blue-500 font-bold">
        SEE ALL
        <ArrowRight className="w-7 h-6" />
            </button>
      <div className="absolute top-[680px] right-0 left-[-40px] w-140 h-130 border-1 border-gray-500 rounded-full -z-10"></div>
      <div className="flex">
        <div className="bg-sky-300 ml-10 mt-2 w-60 h-70 rounded-[25px] shadow-lg shadow-gray-700/40 flex flex-col items-center">
          <Image src="/lock.png" alt="Secure Data Handling" width={80} height={80} className="mt-4" />
          <h1 className="text-sm text-center mt-3 font-bold">Secure Data Handling</h1>
          <p className="text-xs text-center mt-3 ml-4 mr-4">
            Your reports are encrypted and kept confidential to protect patient privacy.
          </p>
          <button className="text-xs w-24 h-9 bg-lime-400 py-3 px-2 mt-2 rounded-br-[25px] rounded-tl-[25px] cursor-pointer">SEE DETAILS</button>
          </div>
        <div className="bg-sky-300 w-60 h-70 mt-10 ml-20 rounded-[25px] shadow-lg shadow-gray-700/40 flex flex-col items-center">
          <Image src="/image/alert.png" alt="Real-Time Alerts" width={80} height={80} className="mt-4" />
          <h1 className="text-sm text-center mt-3 font-bold">Real-Time Alerts</h1>
          <p className="text-xs text-center mt-3 ml-4 mr-4">
            Get notified immediately about critical updates on reported events.
          </p>
          <button className="text-xs w-24 h-9 bg-lime-400 py-3 px-2 mt-6 rounded-br-[25px] rounded-tl-[25px] cursor-pointer">SEE DETAILS</button>
                </div>
        <div className="bg-sky-300 w-60 mt-2 h-70 ml-20 rounded-[25px] shadow-lg shadow-gray-700/40 flex flex-col items-center">
          <Image src="/image/interface.png" alt="User-Friendly Interface" width={80} height={80} className="mt-4" />
          <h1 className="text-sm text-center mt-3 font-bold">User-Friendly Interface</h1>
          <p className="text-xs text-center mt-3 ml-4 mr-4">Intuitive design for seamless reporting even for non-technical users.</p>
          <button className="text-xs w-24 h-9 bg-lime-400 py-3 px-2 mt-6 rounded-br-[25px] rounded-tl-[25px] cursor-pointer">SEE DETAILS</button>
                </div>
                </div>
      <div className="flex ml-5">
        <button className="mt-1 ml-40 cursor-pointer text-blue-500 font-bold">
          <ArrowRight className="w-9 h-8" />
              </button>
        <button className="mt-1 ml-2 cursor-pointer text-blue-500 font-bold">
          <ArrowLeft className="w-9 h-8" />
                      </button>
                    </div>
                  </div>
  );
}

const testimonials = [
  {
    text: "It’s simple and efficient. I can submit incident reports without interrupting my workflow.",
    name: "Avinash T",
    role: "Senior Medical Officer",
    image: "/image/user1.jpg",
  },
  {
    text: "Having an anonymous option is a huge relief. It lets us be honest without fear of backlash.",
    name: "Sindu M G",
    role: "External Mentor",
    image: "/image/user2.png",
  },
  {
    text: "This platform made it so easy to report an issue. I feel like my concerns are taken seriously!",
    name: "Krishna Gudi",
    role: "Internal Mentor",
    image: "/image/user3.png",
  },
];

function Testimonials() {
  return (
    <div className="mt-3 bg-white text-black p-10">
      <h2 className="text-4xl font-bold text-left mb-12">"What Our Users Say"</h2>
      <div className="flex justify-start gap-10 flex-wrap relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2"></div>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="relative bg-[#59D5F7] p-8 w-70 h-70 flex flex-col items-center text-center shadow-lg rounded-tl-none rounded-tr-full rounded-bl-full rounded-br-full">
            <p className="text-lg leading-tight text-left">{testimonial.text}</p>
            <div className="flex justify-start mt-5 ml-[-100px]">
              {Array(5).fill("⭐").map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
            <div className="absolute right-1/2 bottom-2 transform  translate-x-1/2 flex flex-col items-center p-2">
              <p className="font-bold text-left">{testimonial.name}</p>
              <p className="text-xs text-gray-700 text-left">{testimonial.role}</p>
            </div>
            <div className={`absolute right-2 bottom-3 flex flex-col items-end p-2 ${index === 0 ? 'right-1' : ''}`}>
              <Image src={testimonial.image} alt={testimonial.name} width={50} height={50} className="rounded-tl-[200px] rounded-tr-[200px] rounded-bl-[200px]" />
            </div>
          </div>
        ))}
        <div className="absolute ml-2 right-[-40px] top-1/2 transform -translate-y-1/2">
          <Image src="/image/landing-right-banner2.png" alt="Illustration" width={260} height={250} className="rounded-lg" />
        </div>
          </div>
      <div className="flex ml-10 mr-10 justify-between items-center mt-16 p-6 bg-gradient-to-r from-[#03ACF2] to-[#C8E6C9] rounded-xl shadow-md">
        <p className="text-xl font-bold text-left text-black">Ready to get started ?</p>
        <button className="bg-white text-blue-500 py-1 mr-10 px-15 rounded-full font-semibold shadow cursor-pointer">REPORT NOW</button>
      </div>
      {/* Footer section can be added here if needed */}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <div className="relative z-50">
        <LandingNav />
      </div>
      <HeroSection />
      <FeatureSection />
      <Testimonials />
      {/* Running illustration at the bottom right */}
      <div className="absolute bottom-0 right-0 z-0 pointer-events-none select-none">
        <Image src="/running.png" width={400} height={360} alt="People running" />
      </div>
    </>
  );
}
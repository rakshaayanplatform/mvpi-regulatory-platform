"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { StatsCard } from "@/components/ui/stats-card";
import { FeatureCard } from "@/components/ui/feature-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
/*
import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Storage keys for persisting data
const STORAGE_KEYS = {
  REPORTS_SUBMITTED: 'cached_reports_submitted',
  VERIFIED_USERS: 'cached_verified_users',
  DEVICES_MONITORED: 'cached_devices_monitored',
  LAST_FETCH_SUCCESS: 'last_fetch_success_timestamp',
};

// Helper functions for data persistence (using memory storage for Claude.ai compatibility)
let memoryStorage: { [key: string]: string } = {};

const setStorageItem = (key: string, value: string) => {
  try {
    memoryStorage[key] = value;
  } catch (error) {
    console.warn('Failed to store data:', error);
  }
};

const getStorageItem = (key: string): string | null => {
  try {
    return memoryStorage[key] || null;
  } catch (error) {
    console.warn('Failed to retrieve stored data:', error);
    return null;
  }
};

interface StatsData {
  reportsSubmitted: number;
  verifiedUsers: number;
  devicesMonitored: number;
}
*/

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stats, setStats] = useState({
    reportsSubmitted: 0,
    verifiedUsers: 0,
    devicesMonitored: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const featureScrollRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: "🔒",
      title: "Secure Data Handling",
      description: "Your reports are encrypted and kept confidential to protect patient privacy.",
      bgColor: "bg-[#4A90E2]",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop&crop=center"
    },
    {
      icon: "⚡",
      title: "Real-Time Alerts",
      description: "Get notified immediately about critical updates on reported events.",
      bgColor: "bg-[#1A365D]",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&crop=center"
    },
    {
      icon: "💻",
      title: "User-Friendly Interface",
      description: "Intuitive design for seamless reporting, even for non-technical users.",
      bgColor: "bg-[#8B5CF6]",
      image: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=300&h=200&fit=crop&crop=center"
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Comprehensive reporting and analytics to track device safety trends.",
      bgColor: "bg-[#10B981]",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&crop=center"
    },
    {
      icon: "🔍",
      title: "Smart Detection",
      description: "AI-powered system to detect potential safety issues before they escalate.",
      bgColor: "bg-[#F59E0B]",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center"
    },
  ];

  const testimonials = [
    {
      text: "It's simple and efficient. I can submit incident reports without interrupting my workflow.",
      name: "Avinash T",
      role: "Senior Medical Officer",
      image: require("../../../figma exports/Rectangle 3.jpg"),
    },
    {
      text: "Having an anonymous option is a huge relief. It lets us be honest without fear of backlash.",
      name: "Sindu M G",
      role: "External Mentor", 
      image: require("../../../figma exports/Rectangle 3 (1).jpg"),
    },
    {
      text: "This platform made it so easy to report an issue. I feel like my concerns are taken seriously!",
      name: "Krishna Gudi",
      role: "Internal Mentor",
      image: require("../../../figma exports/Rectangle 4.png"),
    },
  ];

  // Load cached data on component mount
  // const loadCachedStats = (): StatsData => {
  //   const cachedReports = getStorageItem(STORAGE_KEYS.REPORTS_SUBMITTED);
  //   const cachedUsers = getStorageItem(STORAGE_KEYS.VERIFIED_USERS);
  //   const cachedDevices = getStorageItem(STORAGE_KEYS.DEVICES_MONITORED);

  //   return {
  //     reportsSubmitted: cachedReports ? parseInt(cachedReports, 10) : 0,
  //     verifiedUsers: cachedUsers ? parseInt(cachedUsers, 10) : 0,
  //     devicesMonitored: cachedDevices ? parseInt(cachedDevices, 10) : 0,
  //   };
  // };

  // Cache stats data
  // const cacheStats = (statsData: StatsData) => {
  //   setStorageItem(STORAGE_KEYS.REPORTS_SUBMITTED, statsData.reportsSubmitted.toString());
  //   setStorageItem(STORAGE_KEYS.VERIFIED_USERS, statsData.verifiedUsers.toString());
  //   setStorageItem(STORAGE_KEYS.DEVICES_MONITORED, statsData.devicesMonitored.toString());
  //   setStorageItem(STORAGE_KEYS.LAST_FETCH_SUCCESS, Date.now().toString());
  // };

  // Fetch stats from API with enhanced error handling
  // const fetchStats = async () => {
  //   setLoadingStats(true);
  //   setFetchError(null);

  //   try {
  //     console.log('Fetching stats from:', `${API_BASE_URL}/api/v1/analytics/summary`);
      
  //     const response = await apiClient.get('/api/v1/analytics/summary');
      
  //     if (response.status === 200 && response.data) {
  //       const newStats: StatsData = {
  //         reportsSubmitted: response.data.reports_submitted || 0,
  //         verifiedUsers: response.data.verified_users || 0,
  //         devicesMonitored: response.data.devices_monitored || 0,
  //       };

  //       setStats(newStats);
  //       cacheStats(newStats);
  //       console.log('Stats fetched successfully:', newStats);
  //     } else {
  //       throw new Error(`Unexpected response status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch stats:', error);
      
  //     // Load cached data as fallback
  //     const cachedStats = loadCachedStats();
  //     setStats(cachedStats);
      
  //     // Set appropriate error message
  //     if (axios.isAxiosError(error)) {
  //       if (error.code === 'ECONNABORTED') {
  //         setFetchError('Request timeout - using cached data');
  //       } else if (error.response) {
  //         setFetchError(`Server error (${error.response.status}) - using cached data`);
  //       } else if (error.request) {
  //         setFetchError('Network error - using cached data');
  //       } else {
  //         setFetchError('Request failed - using cached data');
  //       }
  //     } else {
  //       setFetchError('Failed to fetch data - using cached data');
  //     }

  //     console.log('Using cached stats:', cachedStats);
  //   } finally {
  //     setLoadingStats(false);
  //   }
  // };

  // Retry mechanism for failed requests
  // const retryFetch = () => {
  //   fetchStats();
  // };

  // useEffect(() => {
  //   // Load cached data first for immediate display
  //   const cachedStats = loadCachedStats();
  //   if (cachedStats.reportsSubmitted > 0 || cachedStats.verifiedUsers > 0 || cachedStats.devicesMonitored > 0) {
  //     setStats(cachedStats);
  //     setLoadingStats(false);
  //   }

  //   // Then fetch fresh data
  //   fetchStats();
  // }, []);

  useEffect(() => {
    if (searchParams.get("all") === "true") {
      setShowAllFeatures(true);
    }
  }, [searchParams]);

  const handleSeeAll = () => {
    setShowAllFeatures(true);
    router.push("?all=true");
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    if (isAtEnd && !showAllFeatures) {
      setShowAllFeatures(true);
      router.push("?all=true");
    }
  };

  useEffect(() => {
    if (!showAllFeatures && featureScrollRef.current) {
      const interval = setInterval(() => {
        if (featureScrollRef.current) {
          featureScrollRef.current.scrollBy({ left: 3, behavior: "smooth" });
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [showAllFeatures]);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <div>
              <div className="font-bold text-lg">NIMHANS</div>
              <div className="text-xs text-gray-600">An Institute of National Importance</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">HOME</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">ABOUT</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">CONTACT</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">FEATURES</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">SIGN IN / SIGNUP</button>
            <div className="flex items-center space-x-1 text-sm">
              <span>🌐</span>
              <span>English - EN</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <section className="relative mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Your Gateway To Medical Device Safety Reporting
              </h1>
              <p className="text-xl text-gray-700 mb-6 max-w-lg">
                Simplifying the process of reporting adverse medical device events for everyone
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full">
                LEARN MORE
              </Button>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 relative overflow-hidden">
                {/* Medical illustration placeholder - replace with actual image */}
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="text-6xl">🏥</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Cards Below Hero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">Business Solution</h3>
              <p className="text-sm text-blue-800">
                Understand the importance of reporting adverse events to improve device safety and regulatory compliance.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">Who Can Report?</h3>
              <p className="text-sm text-blue-800">
                Patients, Caretakers, Healthcare Professionals, and many more.....
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">Event Types</h3>
              <p className="text-sm text-blue-800">
                Report any adverse events, including device malfunctions, injuries, or safety concerns and many more.....
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          {/* Error message and retry button */}
          {/* {fetchError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">{fetchError}</p>
                  </div>
                </div>
                <button 
                  onClick={retryFetch}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                  disabled={loadingStats}
                >
                  {loadingStats ? 'Retrying...' : 'Retry'}
                </button>
              </div>
            </div>
          )} */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-green-600">
                    {loadingStats && stats.reportsSubmitted === 0 ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      `${stats.reportsSubmitted}+`
                    )}
                  </div>
                  <div className="text-gray-700 font-medium">Reports Submitted</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-green-600">
                    {loadingStats && stats.verifiedUsers === 0 ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      `${stats.verifiedUsers}+`
                    )}
                  </div>
                  <div className="text-gray-700 font-medium">Verified Users</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🏥</span>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-green-600">
                    {loadingStats && stats.devicesMonitored === 0 ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      `${stats.devicesMonitored}+`
                    )}
                  </div>
                  <div className="text-gray-700 font-medium">Devices Monitored</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16 relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Features</h2>
            <button 
              onClick={handleSeeAll}
              className="flex items-center text-blue-500 font-semibold hover:text-blue-600 transition-colors"
            >
              SEE ALL <span className="ml-2">→</span>
            </button>
          </div>
          
          <div className="relative">
            {/* Large circular background with medical illustration */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-96 h-96 border-2 border-gray-200 rounded-full flex items-center justify-center bg-white">
              {/* Medical illustration - stethoscope with heart */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Heart shape */}
                <div className="absolute w-48 h-40 bg-pink-200 rounded-full transform rotate-45 top-16 left-16"></div>
                <div className="absolute w-48 h-40 bg-pink-200 rounded-full transform -rotate-45 top-16 left-16"></div>
                <div className="absolute w-40 h-32 bg-pink-300 rounded-full transform rotate-45 top-20 left-20"></div>
                
                {/* EKG line */}
                <div className="absolute top-32 left-12 w-60 h-1 bg-pink-500 z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-600 to-transparent"></div>
                </div>
                
                {/* Stethoscope */}
                <div className="absolute top-8 left-32 w-4 h-32 bg-teal-400 rounded-full transform rotate-12"></div>
                <div className="absolute top-6 left-36 w-6 h-6 bg-teal-500 rounded-full"></div>
                
                {/* Medical professionals */}
                <div className="absolute bottom-8 left-4">
                  <div className="w-12 h-16 bg-blue-400 rounded-t-full"></div>
                  <div className="w-8 h-8 bg-orange-300 rounded-full mx-auto -mt-2"></div>
                </div>
                <div className="absolute bottom-8 left-20">
                  <div className="w-12 h-16 bg-white rounded-t-full border-2 border-gray-300"></div>
                  <div className="w-8 h-8 bg-orange-300 rounded-full mx-auto -mt-2"></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-16 right-8 w-8 h-16 bg-green-400 rounded-full transform rotate-45"></div>
                <div className="absolute bottom-12 right-4 w-6 h-12 bg-green-300 rounded-full transform -rotate-12"></div>
              </div>
              
              {/* Navigation arrows */}
              <button className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                ←
              </button>
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                →
              </button>
            </div>
            
            {/* Feature cards */}
            <div className="ml-80 pl-16">
              <div className="flex gap-6 overflow-x-auto pb-4">
                {(showAllFeatures ? features : features.slice(0, 3)).map((feature, idx) => (
                  <div key={idx} className={`${feature.bgColor} rounded-2xl shadow-lg min-w-[280px] max-w-[320px] text-white overflow-hidden`}>
                    {/* Feature image */}
                    <div className="h-32 bg-cover bg-center relative" style={{backgroundImage: `url(${feature.image})`}}>
                      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                      <div className="absolute top-4 left-4 text-4xl">{feature.icon}</div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-[20px] font-semibold leading-6 mb-3">{feature.title}</h3>
                      <p className="text-[16px] mb-4 opacity-90 leading-relaxed">{feature.description}</p>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
                        SEE DETAILS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">"What Our Users Say"</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl p-6 text-white text-center shadow-lg">
                <p className="text-[16px] mb-4 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Image
                    src={testimonial.image}
                    width={48}
                    height={48}
                    alt={testimonial.name}
                    className="rounded-full border-2 border-white shadow"
                  />
                  <div className="text-left">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm opacity-90">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to get started ?</h2>
            <button className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
              REPORT NOW
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">N</span>
                </div>
                <div>
                  <div className="font-bold">NIMHANS</div>
                  <div className="text-xs text-gray-600">An Institute of National Importance</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Institute of National Importance Operating Autonomously under the Ministry of Health and Family Welfare
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-4">COMPANY</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-4">SERVICES</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Reporting Guidelines</li>
                <li>FAQs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-4">RESOURCES</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Knowledge Base</li>
                <li>Latest Updates</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            © 2024 Rakshaayan. All rights reserved
          </div>
        </footer>
      </div>
      
      {/* Decorative running image at bottom right */}
      <div className="absolute bottom-0 right-0 z-0 pointer-events-none select-none">
        <Image
          src={require("../../../figma exports/image 1.png")}
          width={400}
          height={360}
          alt="People running"
        />
      </div>
    </div>
  );
}
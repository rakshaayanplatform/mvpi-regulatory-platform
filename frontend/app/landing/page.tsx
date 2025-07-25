"use client";
import LandingNav from "@/components/Landing/landing-nav";
import HeroSection from "@/components/Landing/hero-section";
import FeatureSection from "@/components/Landing/feature-section";
import Testimonials from "@/components/Landing/users";

export default function HomePage() {
    return (
        <>
            <div className="relative z-50">
                <LandingNav />
            </div>

            <HeroSection />
            <FeatureSection />
            <Testimonials/>
            
        </>
    );
}
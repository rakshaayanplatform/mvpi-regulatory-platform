import Image from 'next/image';

export default function Testimonials() {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-white text-black">
            <div className="p-4 sm:p-6 lg:p-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-left mb-8 sm:mb-12">"What Our Users Say"</h2>
                
                <div className="flex flex-col lg:flex-row justify-start gap-6 sm:gap-8 lg:gap-10 relative">
                    {/* Testimonials Container */}
                    <div className="flex flex-col sm:flex-row lg:flex-row gap-4 sm:gap-6 lg:gap-8 flex-wrap lg:flex-nowrap w-full lg:w-auto">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="relative bg-[#59D5F7] p-6 sm:p-8 w-full sm:w-[280px] lg:w-[250px] xl:w-[280px] h-[280px] sm:h-[300px] lg:h-[280px] flex flex-col items-center text-center shadow-lg rounded-tl-none rounded-tr-full rounded-bl-full rounded-br-full mx-auto sm:mx-0">
                                <p className="text-sm sm:text-base lg:text-lg leading-tight text-left flex-grow">{testimonial.text}</p>
                                
                                <div className="flex justify-start mt-4 self-start">
                                    {Array(5).fill("⭐").map((star, i) => (
                                        <span key={i} className="text-sm">{star}</span>
                                    ))}
                                </div>
                                
                                <div className="absolute left-1/2 bottom-12 sm:bottom-14 transform -translate-x-1/2 flex flex-col items-center">
                                    <p className="font-bold text-sm sm:text-base">{testimonial.name}</p>
                                    <p className="text-xs text-gray-700">{testimonial.role}</p>
                                </div>
                                
                                <div className="absolute right-2 bottom-2 flex flex-col items-end p-2">
                                    <Image 
                                        src={testimonial.image} 
                                        alt={testimonial.name} 
                                        width={40} 
                                        height={40} 
                                        className="sm:w-[50px] sm:h-[50px] rounded-full object-cover" 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Right Image - Hidden on mobile, adjusted for tablet and desktop */}
                    <div className="hidden lg:block absolute right-[-20px] xl:right-[-40px] top-1/2 transform -translate-y-1/2">
                        <Image 
                            src="/image/landing-right-banner2.png" 
                            alt="Illustration" 
                            width={220} 
                            height={200} 
                            className="xl:w-[260px] xl:h-[250px] rounded-lg" 
                        />
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-12 sm:mt-16 p-4 sm:p-6 bg-gradient-to-r from-[#03ACF2] to-[#C8E6C9] rounded-xl shadow-md mx-2 sm:mx-4 lg:mx-10">
                    <p className="text-lg sm:text-xl font-bold text-center sm:text-left text-black mb-4 sm:mb-0">Ready to get started ?</p>
                    <button className="bg-white text-blue-500 py-2 px-8 sm:px-12 lg:px-15 rounded-full font-semibold shadow cursor-pointer hover:bg-gray-50 transition-colors">
                        REPORT NOW
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white text-center">
                <div className="flex flex-col lg:flex-row justify-between items-start max-w-6xl mx-auto gap-8 lg:gap-16 p-6 sm:p-8 lg:p-10">
                    {/* Logo and Description */}
                    <div className="flex flex-col items-center w-full lg:w-auto">
                        <Image 
                            src="/image/nav-left-nimhansLogo.png" 
                            alt="NIMHANS Logo" 
                            width={150} 
                            height={50} 
                            className="sm:w-[180px] sm:h-[60px] mb-4" 
                        />
                        <div className="font-poppins text-sm max-w-lg text-center">
                            <p>Institute of National Importance Operating</p>
                            <p>Autonomously under the Ministry of</p>
                            <p>Health and Family Welfare</p>
                        </div>
                    </div>
                    
                    {/* Footer Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 text-sm font-semibold max-w-2xl mx-auto gap-8 sm:gap-12 lg:gap-16 w-full lg:w-auto">
                        <div className="text-center sm:text-left">
                            <p className="font-poppins text-blue-600 mb-4">COMPANY</p>
                            <p className="font-poppins text-xs text-gray-600 mb-2">About Us</p>
                            <p className="font-poppins text-xs text-gray-600">Careers</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-poppins text-blue-600 mb-4">SERVICES</p>
                            <p className="font-poppins text-xs text-gray-600 mb-2">Reporting Guidelines</p>
                            <p className="font-poppins text-xs text-gray-600">FAQs</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-poppins text-blue-600 mb-4">RESOURCES</p>
                            <p className="font-poppins text-xs text-gray-600 mb-2">Knowledge Base</p>
                            <p className="font-poppins text-xs text-gray-600">Latest Updates</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center py-4 text-sm text-gray-600 border-t border-gray-200">
                    © 2024 Rakshaayan. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

const testimonials = [
    {
        text: "It's simple and efficient. I can submit incident reports without interrupting my workflow.",
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
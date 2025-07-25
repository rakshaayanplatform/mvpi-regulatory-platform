import Image from "next/image";


export default function Maintenance() {
  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/image/MaintenanceBackgroundImage.svg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
        />
      </div>

      {/* Top Decorative Images */}
      {/* <div className="absolute top-0 right-0 z-0 overflow-hidden">
        <img
          src="/ContactUsTopOval.png"
          alt="Top Semicircle"
          className="w-[200px] sm:w-[250px] md:w-[300px]"
        />
        <img
          src="/ContactUsTopCircle.png"
          alt="Top Line"
          className="absolute top-[40px] left-[30px] w-[200px] sm:w-[250px] md:w-[300px]"
        />
      </div>

      {/* Bottom Decorative Images */}
      {/* <div className="absolute bottom-0 left-0 z-0 overflow-hidden">
        <img
          src="/ContactUsBottomOval.png"
          alt="Bottom Semicircle"
          className="w-[200px] sm:w-[250px] md:w-[300px]"
        />
        <img
          src="/ContactUsBottomCircle.png"
          alt="Bottom Line"
          className="absolute top-[50px] right-[30px] w-[200px] sm:w-[250px] md:w-[300px]"
        />
      </div>  */}

      {/* Logo */}
      

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-10 sm:pt-36 md:pt-40 relative z-10 flex-grow">
        {/* Maintenance Icons */}
        <div className="flex gap-6 sm:gap-10 mb-8 flex-wrap justify-center z-10">
          <div className="bg-cyan-300 bg-opacity-25 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <Image
              src="/image/MaintenanceToolIcon.svg"
              alt="Tool Icon"
              width={50}
              height={50}
            />
          </div>
          <div className="bg-cyan-300 bg-opacity-25 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <Image
              src="/image/MaintenanceFrown.svg"
              alt="Frown Icon"
              width={50}
              height={50}
            />
          </div>
          <div className="bg-cyan-300 bg-opacity-25 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <Image
              src="/image/MaintenanceSettingsSymbol.svg"
              alt="Settings Icon"
              width={50}
              height={50}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black z-10">
          Under Maintenance
        </h1>
        <p className="text-base sm:text-lg md:text-xl mt-3 text-black/80 max-w-[90%] sm:max-w-[70%] z-10">
          Our website is under maintenance. We will be back shortly.
        </p>

        {/* Coffee Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 max-w-[90%] z-10">
          <Image
            src="/image/MaintenanceCoffee.png"
            alt="Coffee Icon"
            width={60}
            height={60}
          />
          <p className="text-base sm:text-lg text-black/80 text-center sm:text-left">
            Please sip a cup of coffee/tea until we are back.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-600">
        © 2024 Rakshaayan. All rights reserved.
      </footer>
      <div className="mt-auto w-full z-10">
       
      </div>
    </main>
  );
}

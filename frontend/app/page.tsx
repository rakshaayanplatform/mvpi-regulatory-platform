import ServiceStatus from "@/components/ServiceStatus";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Rakshaayan Platform
          </h1>
          <p className="text-xl text-gray-600">
            India&apos;s National Medical Device Adverse Event Reporting Platform
          </p>
        </header>

        <main className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Rakshaayan</h2>
            <p className="text-gray-600 mb-4">
              A corruption-proof, AI-enabled, MvPI-compliant platform for medical device safety.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Patients</h3>
                <p className="text-sm text-blue-700">Report adverse events</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Hospitals</h3>
                <p className="text-sm text-green-700">Review and manage cases</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Manufacturers</h3>
                <p className="text-sm text-purple-700">Track device safety</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">Government</h3>
                <p className="text-sm text-orange-700">Regulatory oversight</p>
              </div>
            </div>
          </div>

          <ServiceStatus />
        </main>

        <footer className="mt-12 text-center text-gray-500">
          <p>© 2024 Rakshaayan Platform. Built for India&apos;s medical device safety.</p>
        </footer>
      </div>
    </div>
  );
}

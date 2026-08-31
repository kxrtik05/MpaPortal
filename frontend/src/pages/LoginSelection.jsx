import { useNavigate } from "react-router-dom";
import { User, Wrench, ShieldCheck } from "lucide-react";

function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/ship.mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#003B73]/30"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">

        <div className="w-full max-w-6xl">

          {/* Header */}
          <div className="text-center text-white mb-12">

            <img
            src="/images/mpa_logo.jpg"
            alt="MPA Logo"
            className="mx-auto mb-5 h-24 w-24 rounded-full bg-white p-2 shadow-lg"
          />

            <h1 className="text-5xl md:text-6xl font-extrabold">
              MPA Complaint Portal
            </h1>

            <p className="text-blue-100 text-lg mt-4">
              Mormugao Port Authority
            </p>

            <p className="text-white/80 mt-2">
              Select your account type to continue
            </p>

          </div>

          {/* Login Cards */}
          <div className="grid md:grid-cols-3 gap-7">

            {/* Employee */}
            <button
              onClick={() => navigate("/user-login")}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-8
              shadow-2xl text-left
              hover:-translate-y-2 hover:bg-white
              transition-all duration-300 group"
            >

              <div className="w-16 h-16 rounded-2xl
                bg-blue-100 flex items-center justify-center
                group-hover:bg-[#003B73] transition">

                <User
                  size={32}
                  className="text-[#003B73]
                  group-hover:text-white"
                />

              </div>

              <h2 className="text-2xl font-bold text-[#003B73] mt-6">
                Employee
              </h2>

              <p className="text-gray-500 mt-2">
                Register and track your complaints.
              </p>

              <div className="mt-6 text-[#003B73] font-bold">
                Continue →
              </div>

            </button>


            {/* Engineer */}
            <button
              onClick={() => navigate("/engineer-login")}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-8
              shadow-2xl text-left
              hover:-translate-y-2 hover:bg-white
              transition-all duration-300 group"
            >

              <div className="w-16 h-16 rounded-2xl
                bg-cyan-100 flex items-center justify-center
                group-hover:bg-cyan-600 transition">

                <Wrench
                  size={32}
                  className="text-cyan-700
                  group-hover:text-white"
                />

              </div>

              <h2 className="text-2xl font-bold text-[#003B73] mt-6">
                Engineer
              </h2>

              <p className="text-gray-500 mt-2">
                Manage and resolve assigned complaints.
              </p>

              <div className="mt-6 text-cyan-700 font-bold">
                Continue →
              </div>

            </button>


            {/* Admin */}
            <button
              onClick={() => navigate("/admin-login")}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-8
              shadow-2xl text-left
              hover:-translate-y-2 hover:bg-white
              transition-all duration-300 group"
            >

              <div className="w-16 h-16 rounded-2xl
                bg-blue-100 flex items-center justify-center
                group-hover:bg-[#003B73] transition">

                <ShieldCheck
                  size={32}
                  className="text-[#003B73]
                  group-hover:text-white"
                />

              </div>

              <h2 className="text-2xl font-bold text-[#003B73] mt-6">
                Administrator
              </h2>

              <p className="text-gray-500 mt-2">
                Manage complaints, engineers and reports.
              </p>

              <div className="mt-6 text-[#003B73] font-bold">
                Continue →
              </div>

            </button>

          </div>

          {/* Footer */}
          <p className="text-center text-white/70 mt-10">
          Developed By AKM Developers.
          </p>

        </div>

      </div>

    </div>
  );
}

export default LoginSelection;
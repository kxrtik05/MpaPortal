import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    if (username === "admin" && password === "admin123") {
      navigate("/admin/dashboard");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/mpa.jpg')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65"></div>

      {/* Login Card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">

        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-8">

          {/* Logo */}
          <img
            src="/images/mpa_logo.jpg"
            alt="MPA Logo"
            className="mx-auto mb-5 h-24 w-24 rounded-full bg-white p-2 shadow-lg"
          />

          <h1 className="text-center text-4xl font-bold text-white">
            MPA Admin Portal
          </h1>

          <p className="mt-2 mb-8 text-center text-gray-200">
            Mormugao Port Authority
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block mb-2 text-white font-semibold">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/20 p-3 text-white placeholder-gray-300 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-white font-semibold">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/20 p-3 text-white placeholder-gray-300 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-500 py-3 text-lg font-semibold text-white transition duration-300 hover:scale-105 hover:bg-cyan-600 shadow-lg"
            >
              Login
            </button>

          </form>

          <div className="mt-8 border-t border-white/20 pt-4 text-center">
            <p className="text-gray-300 text-sm">
              Mormugao Port Authority
            </p>

            <p className="text-cyan-300 text-xs mt-1">
              Developved by AKM Developers.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
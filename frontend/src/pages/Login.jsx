import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!employeeId || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          employeeId,
          password,
        }
      );

      if (res.data.success) {
        localStorage.setItem(
          "employee",
          JSON.stringify(res.data.employee)
        );

        navigate("/dashboard");
      }
    } catch (err) {
      alert(
        err.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Video */}
      <video
         autoPlay
         loop
         muted
         playsInline
        className="absolute inset-0 w-full h-full object-cover"
           src="/videos/ship.mp4"
        />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login Card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">

        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

          {/* Logo */}
          <img
            src="/images/mpa_logo.jpg"
            alt="MPA Logo"
            className="mx-auto mb-5 h-24 w-24 rounded-full bg-white p-2 shadow-lg"
          />

          <h1 className="text-center text-4xl font-bold text-white">
            MPA Complaint Portal
          </h1>

          <p className="mt-2 mb-8 text-center text-gray-200">
            Mormugao Port Authority
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>
              <label className="mb-2 block text-white font-medium">
                Employee ID
              </label>

              <input
                type="text"
                placeholder="EMP001"
                value={employeeId}
                onChange={(e) =>
                  setEmployeeId(e.target.value)
                }
                className="w-full rounded-xl border border-white/30 bg-white/20 p-3 text-white placeholder-gray-300 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-white font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-white/30 bg-white/20 p-3 text-white placeholder-gray-300 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-cyan-600"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="mt-8 text-center">

            <p className="text-gray-200">
              New Employee?
            </p>

            <Link
              to="/register"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Register Here
            </Link>

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

    </div>
  );
}

export default Login;
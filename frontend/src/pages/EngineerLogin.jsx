import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EngineerLogin() {
  const navigate = useNavigate();

  const [engineerId, setEngineerId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/engineers/login",
        {
          engineerId,
          password,
        }
      );

      if (res.data.success) {
        localStorage.setItem(
          "engineer",
          JSON.stringify(res.data.engineer)
        );

        navigate("/engineer/dashboard");
      }

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[url('/images/mpa.jpg')] bg-cover bg-center flex items-center justify-center">

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-[420px] border border-white/20">

        <img
          src="/images/mpa_logo.jpg"
          className="w-24 h-24 mx-auto mb-5 rounded-full bg-white p-2"
          alt=""
        />

        <h1 className="text-4xl font-bold text-center text-white">
          Engineer Login
        </h1>

        <p className="text-center text-gray-200 mb-8">
          Mormugao Port Authority
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Engineer ID"
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-200 border border-white/30"
            value={engineerId}
            onChange={(e) =>
              setEngineerId(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-200 border border-white/30"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-bold transition"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default EngineerLogin;
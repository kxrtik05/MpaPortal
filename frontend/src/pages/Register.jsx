import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: "",
    username: "",
    department: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      if (res.data.success) {
        alert("Registration Successful!");

        navigate("/");
      }
    } catch (err) {
      alert(
        err.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          Employee Registration
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Create your MPA Employee Account
        </p>

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="font-medium">Employee ID</label>

            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="EMP001"
              required
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Username</label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter Username"
              required
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Department</label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="">Select Department</option>
              <option>IT</option>
              <option>Electrical</option>
              <option>Mechanical</option>
              <option>Civil</option>
              <option>Finance</option>
              <option>Administration</option>
              <option>Operations</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <div className="text-center mt-6">

          <p className="text-gray-600">
            Already have an account?
          </p>

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login Here
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;
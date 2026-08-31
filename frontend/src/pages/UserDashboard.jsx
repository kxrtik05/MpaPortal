import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  LogOut,
  Bell,
  User,
  Building2,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Anchor,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard() {
  const navigate = useNavigate();

  const employee =
    JSON.parse(localStorage.getItem("employee")) || {};

  const [complaints, setComplaints] = useState([]);

  const [showProfile, setShowProfile] = useState(false);

const [profileData, setProfileData] = useState({
  employeeId: employee.employeeId || "",
  employeeName: employee.employeeName || "",
  email: employee.email || "",
  phone: employee.phone || "",
  department: employee.department || "",
  designation: employee.designation || "",
  password: "",
});

const handleProfileChange = (e) => {
  setProfileData({
    ...profileData,
    [e.target.name]: e.target.value,
  });
};

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      if (!employee.employeeId) return;

      const res = await axios.get(
        `http://localhost:5000/api/complaints/employee/${employee.employeeId}`
      );

      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("employee");
    navigate("/");
  };

  // =========================
  // Complaint Statistics
  // =========================

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <nav className="bg-[#003B73] text-white shadow-xl">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="h-20 flex items-center justify-between">

            {/* Logo */}

            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                <Anchor size={30} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-wide">
                  MPA
                </h1>

                <p className="text-blue-200 text-xs">
                  Complaint Management System
                </p>
              </div>

            </div>

            {/* Navigation */}

            <div className="hidden md:flex items-center gap-2">

              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>

              <button
                onClick={() => navigate("/register-complaint")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/10 transition"
              >
                <FilePlus2 size={18} />
                Register Complaint
              </button>

              <button
                onClick={() => navigate("/complaints")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/10 transition"
              >
                <ClipboardList size={18} />
                My Complaints
              </button>

            </div>

            {/* Right side */}

            <div className="flex items-center gap-4">

              <div className="hidden sm:flex items-center gap-3">

                <div className="bg-white/10 p-2.5 rounded-full">
                  <User size={20} />
                </div>

                <div className="hidden lg:block">

                  <p className="font-semibold text-sm">
                    {employee.employeeName ||
                      employee.username ||
                      "Employee"}
                  </p>

                  <p className="text-xs text-blue-200">
                    {employee.employeeId || "Employee"}
                  </p>

                </div>

              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2.5 rounded-xl font-semibold transition shadow-lg"
              >
                <LogOut size={18} />
                <span className="hidden sm:block">
                  Logout
                </span>
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8">

        {/* Welcome Section */}

        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-blue-600 font-semibold mb-1">
                EMPLOYEE PORTAL
              </p>

              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800  shadow-indigo-500/20
                hover:-translate-y-0.5
                transition">

                Welcome,{" "}
                {employee.employeeName ||
                  employee.username ||
                  "Employee"}{" "}
                👋

              </h2>

              <p className="text-slate-500 mt-2">
                Manage and track your complaints with Mormugao Port
                Authority.
              </p>

            </div>

        

          </div>

        </div>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-slate-500 font-medium">
                  Total Complaints
                </p>

                <h3 className="text-4xl font-extrabold text-slate-800 mt-2">
                  {totalComplaints}
                </h3>

              </div>

              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <ClipboardList size={24} />
              </div>

            </div>

            <p className="text-sm text-slate-400 mt-4">
              All complaints submitted
            </p>

          </div>

          {/* Pending */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-slate-500 font-medium">
                  Pending
                </p>

                <h3 className="text-4xl font-extrabold text-orange-500 mt-2">
                  {pendingComplaints}
                </h3>

              </div>

              <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                <AlertCircle size={24} />
              </div>

            </div>

            <p className="text-sm text-slate-400 mt-4">
              Awaiting assignment
            </p>

          </div>

          {/* In Progress */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-slate-500 font-medium">
                  In Progress
                </p>

                <h3 className="text-4xl font-extrabold text-purple-600 mt-2">
                  {inProgressComplaints}
                </h3>

              </div>

              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                <Clock3 size={24} />
              </div>

            </div>

            <p className="text-sm text-slate-400 mt-4">
              Currently being handled
            </p>

          </div>

          {/* Resolved */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-slate-500 font-medium">
                  Resolved
                </p>

                <h3 className="text-4xl font-extrabold text-green-600 mt-2">
                  {resolvedComplaints}
                </h3>

              </div>

              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <CheckCircle2 size={24} />
              </div>

            </div>

            <p className="text-sm text-slate-400 mt-4">
              Successfully resolved
            </p>

          </div>

        </div>

        

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <div className="grid md:grid-cols-2 gap-6">

          {/* Register */}

          <div className="group bg-white rounded-2xl p-7 shadow-sm border border-slate-200 hover:shadow-xl transition">

            <div className="flex items-start justify-between">

              <div>

                <div className="bg-blue-100 text-blue-600 w-fit p-4 rounded-2xl">
                  <FilePlus2 size={30} />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mt-5">
                  Register a Complaint
                </h2>

                <p className="text-slate-500 mt-2">
                  Report a new issue or problem to the Mormugao
                  Port Authority.
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/register-complaint")}
              className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <FilePlus2 size={18} />
              Register Complaint
            </button>

          </div>

          {/* View Complaints */}

          <div className="group bg-white rounded-2xl p-7 shadow-sm border border-slate-200 hover:shadow-xl transition">

            <div className="bg-green-100 text-green-600 w-fit p-4 rounded-2xl">
              <ClipboardList size={30} />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mt-5">
              Track My Complaints
            </h2>

            <p className="text-slate-500 mt-2">
              View your complaints, assigned engineers, current
              status and resolution details.
            </p>

            <button
              onClick={() => navigate("/complaints")}
              className="mt-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <ClipboardList size={18} />
              View My Complaints
            </button>

          </div>

        </div>

        {/* =====================================================
            RECENT COMPLAINTS
        ===================================================== */}

        {complaints.length > 0 && (

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-8 overflow-hidden">

            <div className="p-6 border-b border-slate-200 flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  Recent Complaints
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your latest submitted complaints
                </p>

              </div>

              <button
                onClick={() => navigate("/complaints")}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All →
              </button>

            </div>

            <div className="divide-y">

              {complaints
                .slice()
                .reverse()
                .slice(0, 5)
                .map((complaint) => (

                  <div
                    key={complaint._id}
                    className="p-5 hover:bg-slate-50 transition"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>

                        <p className="font-bold text-blue-600">
                          {complaint.ticketNo}
                        </p>

                        <p className="font-semibold text-slate-800 mt-1">
                          {complaint.category || "Complaint"}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {complaint.location || "Location not specified"}
                        </p>

                      </div>

                      <div className="flex items-center gap-4">

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            complaint.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : complaint.status === "In Progress"
                              ? "bg-purple-100 text-purple-700"
                              : complaint.status === "Assigned"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {complaint.status || "Pending"}
                        </span>

                        <span className="text-sm text-slate-500">
                          {complaint.priority || "Normal"}
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

            </div>

          </div>

        )}

      </main>

      {/* Footer */}

      <footer className="border-t border-slate-200 bg-white mt-10">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-3">

            <p className="text-sm text-slate-500">
              Developed by AKM Developers.
            </p>

            <p className="text-sm text-slate-400">
              MPA Complaint Management System
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default UserDashboard;
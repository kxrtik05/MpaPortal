import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Anchor,
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileBarChart,
  LogOut,
  Search,
  UserRound,
  Users,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchComplaints();
    fetchEngineers();
  }, []);

  // =========================
  // FETCH COMPLAINTS
  // =========================
  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/complaints"
      );

      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FETCH ENGINEERS
  // =========================
  const fetchEngineers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/engineers"
      );

      setEngineers(res.data.engineers || []);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // ASSIGN ENGINEER
  // =========================
  const assignEngineer = async (id, engineer) => {
    if (!engineer) return;

    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/assign`,
        {
          assignedEngineer: engineer,
        }
      );

      fetchComplaints();
    } catch (err) {
      console.log(err);
      alert("Unable to assign engineer");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  // =========================
  // SEARCH
  // =========================
  const filteredComplaints = complaints.filter((c) => {
    const ticket = String(c.ticketNo || "").toLowerCase();

    const name = String(
      c.employeeName || c.fullName || ""
    ).toLowerCase();

    const category = String(
      c.category || ""
    ).toLowerCase();

    const searchValue = search.toLowerCase();

    return (
      ticket.includes(searchValue) ||
      name.includes(searchValue) ||
      category.includes(searchValue)
    );
  });

  // =========================
  // STATISTICS
  // =========================
  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const assigned = complaints.filter(
    (c) => c.status === "Assigned"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";

      case "Assigned":
        return "bg-blue-50 text-blue-700 border border-blue-200";

      case "In Progress":
        return "bg-violet-50 text-violet-700 border border-violet-200";

      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";

      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  // =========================
  // PRIORITY STYLE
  // =========================
  const getPriorityStyle = (priority) => {
    switch (String(priority).toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-600 border border-red-200";

      case "medium":
        return "bg-orange-50 text-orange-600 border border-orange-200";

      case "low":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";

      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="bg-white border-b border-slate-200 shadow-sm">

        <div className="px-6 md:px-10 py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            {/* LEFT */}

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Anchor size={30} />
              </div>

              <div>

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#082344]">
                  MPA Admin Dashboard
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Mormugao Port Authority Complaint Management System
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Developed By AKM Developers.
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">

              

            

              {/* Admin */}

              <div className="hidden sm:flex items-center gap-3 px-3">

                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UserRound size={19} />
                </div>

                <div>

                  <p className="text-sm font-bold text-slate-700">
                    Administrator
                  </p>

                  <p className="text-xs text-slate-400">
                    MPA Admin
                  </p>

                </div>

              </div>

              {/* Monthly Reports */}

              <button
                onClick={() => navigate("/admin/reports")}
                className="hidden md:flex items-center gap-2
                bg-gradient-to-r from-indigo-600 to-purple-600
                text-white px-5 py-3 rounded-xl
                font-semibold shadow-lg shadow-indigo-500/20
                hover:-translate-y-0.5 hover:shadow-xl
                transition"
              >

                <FileBarChart size={18} />

                Monthly Reports

              </button>

              {/* Logout */}

              <button
                onClick={logout}
                className="flex items-center gap-2
                bg-red-50 text-red-600
                border border-red-100
                px-4 py-3 rounded-xl
                font-semibold
                hover:bg-red-100 transition"
              >

                <LogOut size={17} />

                <span className="hidden sm:block">
                  Logout
                </span>

              </button>

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="px-5 md:px-8 lg:px-10 py-8">

        {/* PAGE TITLE */}

        <div className="mb-7">

          <p className="text-sm font-medium text-blue-600 mb-1">
            Overview
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Complaint Management
          </h2>

          <p className="text-slate-500 mt-1">
            Monitor complaints, assign engineers and track resolutions.
          </p>

        </div>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">

          {/* TOTAL */}

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg shadow-blue-600/10  shadow-indigo-500/20
                hover:-translate-y-0.5 hover:shadow-xl
                transition">

            <div className="flex justify-between items-start ">

              <div>

                <p className="text-blue-100 text-sm font-medium">
                  Total Complaints
                </p>

                <p className="text-4xl font-extrabold mt-2">
                  {total}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                <ClipboardList size={22} />
              </div>

            </div>

            <p className="text-xs text-blue-100 mt-5">
              All registered complaints
            </p>

          </div>

          {/* PENDING */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition shadow-indigo-500/20
                hover:-translate-y-0.5 hover:shadow-xl transition">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-slate-500 text-sm font-medium">
                  Pending
                </p>

                <p className="text-4xl font-extrabold mt-2 text-slate-800">
                  {pending}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock3 size={22} />
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-5">
              Awaiting assignment
            </p>

          </div>

          {/* ASSIGNED */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm  shadow-indigo-500/20
                hover:-translate-y-0.5 hover:shadow-xl transition ">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-slate-500 text-sm font-medium">
                  Assigned
                </p>

                <p className="text-4xl font-extrabold mt-2 text-slate-800">
                  {assigned}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={22} />
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-5">
              Assigned to engineers
            </p>

          </div>

          {/* IN PROGRESS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm  shadow-indigo-500/20
                hover:-translate-y-0.5 hover:shadow-xl
                transition">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-slate-500 text-sm font-medium">
                  In Progress
                </p>

                <p className="text-4xl font-extrabold mt-2 text-slate-800">
                  {inProgress}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <BarChart3 size={22} />
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-5">
              Currently being handled
            </p>

          </div>

          {/* RESOLVED */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm  shadow-indigo-500/20
                hover:-translate-y-0.5 hover:shadow-xl
                transitionn">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-slate-500 text-sm font-medium">
                  Resolved
                </p>

                <p className="text-4xl font-extrabold mt-2 text-emerald-600">
                  {resolved}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-5">
              Successfully completed
            </p>

          </div>

        </div>

        {/* =====================================================
            COMPLAINT TABLE
        ===================================================== */}

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* TABLE HEADER */}

          <div className="px-6 py-5 border-b border-slate-200">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  All Complaints
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Manage assignments and view complaint analysis.
                </p>

              </div>

              {/* SEARCH */}

              <div className="relative w-full lg:w-96">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search by ticket, name or category..."
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-3
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    outline-none
                    focus:bg-white
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    transition
                  "
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px]">

              <thead>

                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ticket
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Employee
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Engineer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assign
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Analysis
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredComplaints.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="text-center py-16"
                    >

                      <div className="flex flex-col items-center">

                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">

                          <ClipboardList
                            size={26}
                            className="text-slate-400"
                          />

                        </div>

                        <p className="font-semibold text-slate-600">
                          No complaints found
                        </p>

                        <p className="text-sm text-slate-400 mt-1">
                          Try changing your search.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  filteredComplaints.map((c) => (

                    <tr
                      key={c._id}
                      className="hover:bg-blue-50/40 transition"
                    >

                      {/* TICKET */}

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            navigate(`/analysis/${c._id}`)
                          }
                          className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {c.ticketNo}
                        </button>

                      </td>

                      {/* EMPLOYEE */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">

                            {(
                              c.employeeName ||
                              c.fullName ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <span className="font-semibold text-slate-700">

                            {c.employeeName ||
                              c.fullName ||
                              "Unknown"}

                          </span>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-4 text-slate-600">
                        {c.category || "-"}
                      </td>

                      {/* PRIORITY */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getPriorityStyle(
                            c.priority
                          )}`}
                        >
                          {c.priority || "-"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                            c.status
                          )}`}
                        >

                          <span className="w-1.5 h-1.5 rounded-full bg-current" />

                          {c.status || "Pending"}

                        </span>

                      </td>

                      {/* ENGINEER */}

                      <td className="px-6 py-4">

                        {c.assignedEngineer ? (

                          <div className="flex items-center gap-2">

                            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                              <UserRound size={15} />
                            </div>

                            <span className="font-medium text-slate-700">
                              {c.assignedEngineer}
                            </span>

                          </div>

                        ) : (

                          <span className="text-sm text-slate-400">
                            Not Assigned
                          </span>

                        )}

                      </td>

                      {/* ASSIGN */}

                      <td className="px-6 py-4">

                        <select
                          className="
                            border border-slate-200
                            bg-white
                            rounded-xl
                            px-3 py-2
                            text-sm
                            outline-none
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-500/10
                          "
                          value=""
                          onChange={(e) =>
                            assignEngineer(
                              c._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="">
                            Assign Engineer
                          </option>

                          {engineers.map((eng) => (

                            <option
                              key={eng._id}
                              value={eng.name}
                            >
                              {eng.name}
                            </option>

                          ))}

                        </select>

                      </td>

                      {/* ANALYSIS */}

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            navigate(
                              `/analysis/${c._id}`
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            gap-2
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            px-4 py-2
                            rounded-xl
                            text-sm
                            font-semibold
                            shadow-sm
                            hover:shadow-md
                            transition
                          "
                        >

                          <BarChart3 size={15} />

                          View

                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}

          <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">

            <p className="text-sm text-slate-400">

              Showing{" "}

              <span className="font-bold text-slate-700">
                {filteredComplaints.length}
              </span>{" "}

              of{" "}

              <span className="font-bold text-slate-700">
                {total}
              </span>{" "}

              complaints

            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
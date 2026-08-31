import { useEffect, useState } from "react";
import axios from "axios";
import {
  Wrench,
  LogOut,
  Search,
  ClipboardList,
  Clock3,
  CircleCheck,
  LoaderCircle,
  MapPin,
  Tag,
  X,
  Save,
  UserRound,
  AlertTriangle,
} from "lucide-react";

function EngineerDashboard() {
  const engineer =
    JSON.parse(localStorage.getItem("engineer")) || {};

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  // =========================
  // FETCH COMPLAINTS
  // =========================

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/complaints/engineer/${engineer.name}`
      );

      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // UPDATE COMPLAINT
  // =========================

  const updateStatus = async () => {
    if (!selectedComplaint) return;

    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${selectedComplaint._id}/status`,
        {
          status,
          remark,
          engineer: engineer.name,
        }
      );

      alert("Complaint Updated Successfully");

      setShowModal(false);
      setSelectedComplaint(null);
      setRemark("");

      fetchComplaints();
    } catch (err) {
      console.log(err);
      alert("Unable to update complaint");
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredComplaints = complaints.filter((c) => {
    const ticket = c.ticketNo || "";
    const category = c.category || "";
    const location = c.location || "";

    const value = search.toLowerCase();

    return (
      ticket.toLowerCase().includes(value) ||
      category.toLowerCase().includes(value) ||
      location.toLowerCase().includes(value)
    );
  });

  // =========================
  // STATISTICS
  // =========================

  const total = complaints.length;

  const assigned = complaints.filter(
    (c) => c.status === "Assigned"
  ).length;

  const progress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  // =========================
  // STATUS STYLE
  // =========================

  const statusStyle = (status) => {
    switch (status) {
      case "Assigned":
        return {
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
        };

      case "In Progress":
        return {
          badge:
            "bg-orange-50 text-orange-700 border-orange-200",
          dot: "bg-orange-500",
        };

      case "Resolved":
        return {
          badge:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };

      default:
        return {
          badge:
            "bg-gray-50 text-gray-700 border-gray-200",
          dot: "bg-gray-500",
        };
    }
  };

  // =========================
  // PRIORITY STYLE
  // =========================

  const priorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200";

      case "Medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Low":
        return "bg-green-50 text-green-700 border-green-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("engineer");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-white/20 bg-gradient-to-r from-[#003B73] via-[#075985] to-cyan-600 text-white shadow-xl">

        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            {/* Logo / Title */}

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-md">

                <Wrench size={30} />

              </div>

              <div>

                <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                  Engineer Portal
                </h1>

                <p className="mt-1 text-sm text-cyan-100">
                  Mormugao Port Authority
                </p>

              </div>

            </div>

            {/* Engineer + Logout */}

            <div className="flex items-center gap-4">

              <div className="hidden items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md sm:flex">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">

                  <UserRound size={20} />

                </div>

                <div>

                  <p className="text-sm font-bold">
                    {engineer.name || "Engineer"}
                  </p>

                  <p className="text-xs text-cyan-100">
                    {engineer.department || "Engineering"}
                  </p>

                </div>

              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold shadow-lg transition hover:bg-red-600 hover:shadow-xl"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

        {/* Welcome */}

        <div className="mb-8">

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Engineer Dashboard
          </p>

          <h2 className="text-3xl font-extrabold text-slate-800 md:text-4xl  shadow-indigo-500/20
                hover:-translate-y-0.5 
                transition">
            Welcome, {engineer.name || "Engineer"} 👋
          </h2>

          <p className="mt-2 text-slate-500">
            Manage your assigned complaints and update their
            current status.
          </p>

        </div>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}

          <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-cyan-50" />

            <div className="relative">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <ClipboardList size={24} />
                </div>

                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                  All
                </span>

              </div>

              <p className="text-sm font-medium text-slate-500">
                Assigned To Me
              </p>

              <h3 className="mt-1 text-4xl font-extrabold text-slate-800">
                {total}
              </h3>

            </div>

          </div>

          {/* Assigned */}

          <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-50" />

            <div className="relative">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Clock3 size={24} />
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  New
                </span>

              </div>

              <p className="text-sm font-medium text-slate-500">
                Assigned
              </p>

              <h3 className="mt-1 text-4xl font-extrabold text-slate-800">
                {assigned}
              </h3>

            </div>

          </div>

          {/* Progress */}

          <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-orange-50" />

            <div className="relative">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <LoaderCircle size={24} />
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  Active
                </span>

              </div>

              <p className="text-sm font-medium text-slate-500">
                In Progress
              </p>

              <h3 className="mt-1 text-4xl font-extrabold text-slate-800">
                {progress}
              </h3>

            </div>

          </div>

          {/* Resolved */}

          <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-50" />

            <div className="relative">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CircleCheck size={24} />
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Complete
                </span>

              </div>

              <p className="text-sm font-medium text-slate-500">
                Resolved
              </p>

              <h3 className="mt-1 text-4xl font-extrabold text-slate-800">
                {resolved}
              </h3>

            </div>

          </div>

        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

          <div className="relative">

            <Search
              size={21}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by ticket, category or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />

          </div>

        </div>

        {/* =====================================================
            COMPLAINT TABLE
        ===================================================== */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">

          {/* Table Header */}

          <div className="flex flex-col gap-2 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                My Assigned Complaints
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complaints currently assigned to you
              </p>

            </div>

            <div className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              {filteredComplaints.length} complaint
              {filteredComplaints.length !== 1 ? "s" : ""}
            </div>

          </div>

          {/* Responsive Table */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">

                  <th className="px-6 py-4 font-bold">
                    Ticket
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Category
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Location
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Priority
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center font-bold">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredComplaints.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center"
                    >

                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <ClipboardList size={30} />
                      </div>

                      <h3 className="mt-4 font-bold text-slate-700">
                        No complaints found
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        There are currently no complaints matching
                        your search.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredComplaints.map((c) => {

                    const currentStatus =
                      statusStyle(c.status);

                    return (

                      <tr
                        key={c._id}
                        className="group transition hover:bg-cyan-50/40"
                      >

                        {/* Ticket */}

                        <td className="px-6 py-5">

                          <div className="font-bold text-slate-800">
                            {c.ticketNo}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            Complaint ID
                          </div>

                        </td>

                        {/* Category */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                              <Tag size={15} />
                            </div>

                            <span className="font-medium text-slate-700">
                              {c.category || "-"}
                            </span>

                          </div>

                        </td>

                        {/* Location */}

                        <td className="px-6 py-5">

                          <div className="flex max-w-[200px] items-center gap-2">

                            <MapPin
                              size={16}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="truncate text-slate-600">
                              {c.location || "-"}
                            </span>

                          </div>

                        </td>

                        {/* Priority */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${priorityStyle(
                              c.priority
                            )}`}
                          >
                            {c.priority || "Normal"}
                          </span>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${currentStatus.badge}`}
                          >

                            <span
                              className={`h-2 w-2 rounded-full ${currentStatus.dot}`}
                            />

                            {c.status || "Unknown"}

                          </span>

                        </td>

                        {/* Action */}

                        <td className="px-6 py-5 text-center">

                          <div className="flex items-center justify-center gap-2">

                            <button
                              onClick={() =>
                                window.location.href =
                                  `/engineer/complaint/${c._id}`
                              }
                              className="rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100"
                            >
                              View
                            </button>

                            <button
                              onClick={() => {
                                setSelectedComplaint(c);
                                setStatus(c.status);
                                setRemark("");
                                setShowModal(true);
                              }}
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                              <Wrench size={16} />
                              Update
                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* =====================================================
          UPDATE MODAL
      ===================================================== */}

      {showModal && selectedComplaint && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#003B73] to-cyan-600 p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Wrench size={24} />
                </div>

                <div>

                  <h2 className="text-2xl font-extrabold">
                    Update Complaint
                  </h2>

                  <p className="mt-1 text-sm text-cyan-100">
                    Update the current condition of this complaint
                  </p>

                </div>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
              >
                <X size={22} />
              </button>

            </div>

            {/* Modal Content */}

            <div className="p-6 md:p-8">

              {/* Complaint Information */}

              <div className="mb-7 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Ticket Number
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-slate-800">
                    {selectedComplaint.ticketNo}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-800">
                    {selectedComplaint.category || "-"}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 flex items-center gap-2 font-semibold text-slate-700">

                    <MapPin size={16} />

                    {selectedComplaint.location || "-"}

                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Priority
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${priorityStyle(
                      selectedComplaint.priority
                    )}`}
                  >
                    {selectedComplaint.priority || "Normal"}
                  </span>

                </div>

              </div>

              {/* Status */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Complaint Status
                </label>

                <select
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-medium text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >

                  <option value="Assigned">
                    Assigned
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                </select>

              </div>

              {/* Remark */}

              <div className="mb-7">

                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <FileTextIcon />
                  Engineer Remarks
                </label>

                <textarea
                  rows="6"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  placeholder="Describe the work completed, issue found, action taken, or current condition..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Add clear remarks so the administrator can track
                  the progress of the complaint.
                </p>

              </div>

              {/* Warning */}

              {status === "Resolved" && (

                <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

                  <CircleCheck
                    size={22}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>

                    <p className="font-bold text-emerald-800">
                      Marking as Resolved
                    </p>

                    <p className="mt-1 text-sm text-emerald-700">
                      Make sure your remarks clearly explain how
                      the complaint was resolved.
                    </p>

                  </div>

                </div>

              )}

              {status === "In Progress" && (

                <div className="mb-6 flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">

                  <AlertTriangle
                    size={22}
                    className="mt-0.5 shrink-0 text-orange-600"
                  />

                  <div>

                    <p className="font-bold text-orange-800">
                      Complaint Still In Progress
                    </p>

                    <p className="mt-1 text-sm text-orange-700">
                      Add a remark describing the work currently
                      being carried out.
                    </p>

                  </div>

                </div>

              )}

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={updateStatus}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >

                  <Save size={18} />

                  Save Changes

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

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

// Small helper icon component
function FileTextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h2" />
    </svg>
  );
}

export default EngineerDashboard;
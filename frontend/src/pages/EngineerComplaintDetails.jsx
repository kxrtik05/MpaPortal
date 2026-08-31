import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  MapPin,
  UserRound,
  Tag,
  AlertTriangle,
  Paperclip,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Download,
  Wrench,
  Clock,
} from "lucide-react";

function EngineerComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH COMPLAINT
  // =====================================================

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/complaints/${id}`
      );

      if (res.data.success) {
        setComplaint(res.data.complaint);
      }
    } catch (err) {
      console.error("Error loading complaint:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const statusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "Assigned":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "In Progress":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // =====================================================
  // PRIORITY STYLE
  // =====================================================

  const priorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";

      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "Low":
        return "bg-green-100 text-green-700 border-green-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-xl font-semibold text-slate-600">
          Loading complaint...
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">

        <ClipboardList
          size={60}
          className="text-slate-400 mb-4"
        />

        <h1 className="text-3xl font-bold text-slate-700">
          Complaint Not Found
        </h1>

        <p className="text-slate-500 mt-2 mb-6">
          The requested complaint could not be found.
        </p>

        <button
          onClick={() => navigate("/engineer/dashboard")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-gradient-to-r from-[#003B73] via-[#075985] to-cyan-600 text-white shadow-xl">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">

                <Wrench size={30} />

              </div>

              <div>

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  Complaint Details
                </h1>

                <p className="text-cyan-100 mt-1">
                  Mormugao Port Authority Engineer Portal
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                navigate("/engineer/dashboard")
              }
              className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 px-5 py-3 rounded-xl font-semibold transition"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">

        {/* =====================================================
            TITLE
        ===================================================== */}

        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Complaint
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                {complaint.ticketNo}
              </h2>

              <p className="text-slate-500 mt-2">
                Detailed information and supporting documents
              </p>

            </div>

            <span
              className={`inline-flex w-fit rounded-full border px-5 py-2 font-bold ${statusStyle(
                complaint.status
              )}`}
            >
              {complaint.status || "Pending"}
            </span>

          </div>

        </div>

        {/* =====================================================
            BASIC INFORMATION
        ===================================================== */}

        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-100 p-6 md:p-8 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ClipboardList size={22} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Complaint Information
              </h2>

              <p className="text-sm text-slate-400">
                Details submitted by the complainant
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Employee */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <UserRound size={16} />
                Employee
              </div>

              <p className="font-bold text-slate-800">
                {complaint.employeeName ||
                  complaint.fullName ||
                  "Not available"}
              </p>

            </div>

            {/* Employee ID */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <p className="text-sm text-slate-400 mb-2">
                Employee ID
              </p>

              <p className="font-bold text-slate-800">
                {complaint.employeeId || "-"}
              </p>

            </div>

            {/* Department */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <p className="text-sm text-slate-400 mb-2">
                Department
              </p>

              <p className="font-bold text-slate-800">
                {complaint.department || "-"}
              </p>

            </div>

            {/* Category */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Tag size={16} />
                Category
              </div>

              <p className="font-bold text-slate-800">
                {complaint.category || "-"}
              </p>

            </div>

            {/* Priority */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <AlertTriangle size={16} />
                Priority
              </div>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${priorityStyle(
                  complaint.priority
                )}`}
              >
                {complaint.priority || "Normal"}
              </span>

            </div>

            {/* Location */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <MapPin size={16} />
                Location
              </div>

              <p className="font-bold text-slate-800">
                {complaint.location || "-"}
              </p>

            </div>

            {/* Date */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Clock size={16} />
                Complaint Raised
              </div>

              <p className="font-bold text-slate-800">
                {formatDate(
                  complaint.createdAt ||
                    complaint.raisedAt
                )}
              </p>

            </div>

            {/* Assigned Engineer */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Wrench size={16} />
                Assigned Engineer
              </div>

              <p className="font-bold text-green-700">
                {complaint.assignedEngineer ||
                  "Not Assigned"}
              </p>

            </div>

            {/* Assigned At */}

            <div className="bg-slate-50 rounded-2xl p-5">

              <p className="text-sm text-slate-400 mb-2">
                Assigned At
              </p>

              <p className="font-bold text-slate-800">
                {formatDate(complaint.assignedAt)}
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-100 p-6 md:p-8 mb-6">

          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Complaint Description
          </h2>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">

            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {complaint.description ||
                "No description provided."}
            </p>

          </div>

        </div>

        {/* =====================================================
            ATTACHMENTS
        ===================================================== */}

        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-100 p-6 md:p-8 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Paperclip size={22} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Supporting Documents & Photos
              </h2>

              <p className="text-sm text-slate-400">
                Files submitted with this complaint
              </p>

            </div>

          </div>

          {!complaint.attachments ||
          complaint.attachments.length === 0 ? (

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center">

              <Paperclip
                size={35}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-slate-500">
                No attachments were submitted.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {complaint.attachments.map(
                (file, index) => {

                  const fileUrl =
                    `http://localhost:5000${file.filePath}`;

                  const isImage =
                    file.mimeType?.startsWith(
                      "image/"
                    );

                  return (

                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition"
                    >

                      {/* IMAGE PREVIEW */}

                      {isImage ? (

                        <div className="bg-slate-100 p-3">

                          <img
                            src={fileUrl}
                            alt={file.originalName}
                            className="w-full h-64 object-contain rounded-xl bg-white"
                          />

                        </div>

                      ) : (

                        <div className="h-64 bg-red-50 flex flex-col items-center justify-center">

                          <FileText
                            size={55}
                            className="text-red-500"
                          />

                          <p className="mt-3 text-sm font-semibold text-red-700">
                            Document
                          </p>

                        </div>

                      )}

                      {/* FILE INFO */}

                      <div className="p-5">

                        <div className="flex items-center gap-3">

                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                              isImage
                                ? "bg-blue-100 text-blue-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >

                            {isImage ? (
                              <ImageIcon size={21} />
                            ) : (
                              <FileText size={21} />
                            )}

                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="font-bold text-slate-700 truncate">
                              {file.originalName}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              {(
                                file.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>

                          </div>

                        </div>

                        {/* BUTTONS */}

                        <div className="flex gap-3 mt-5">

                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-3 rounded-xl font-semibold transition"
                          >

                            <ExternalLink size={17} />

                            Open

                          </a>

                          <a
                            href={fileUrl}
                            download={file.originalName}
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-3 rounded-xl font-semibold transition"
                          >

                            <Download size={17} />

                            Download

                          </a>

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>

        {/* =====================================================
            ENGINEER REMARKS
        ===================================================== */}

        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-100 p-6 md:p-8 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Wrench size={22} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Engineer Remarks
              </h2>

              <p className="text-sm text-slate-400">
                Notes recorded during complaint handling
              </p>

            </div>

          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">

            {complaint.engineerRemarks ? (

              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {complaint.engineerRemarks}
              </p>

            ) : (

              <p className="text-slate-400">
                No engineer remarks added yet.
              </p>

            )}

          </div>

        </div>

        {/* =====================================================
            TIMELINE
        ===================================================== */}

        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-100 p-6 md:p-8">

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Complaint Timeline
          </h2>

          {!complaint.history ||
          complaint.history.length === 0 ? (

            <p className="text-slate-400">
              No timeline information available.
            </p>

          ) : (

            <div className="space-y-5">

              {complaint.history.map(
                (event, index) => (

                  <div
                    key={index}
                    className="flex gap-4"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">

                        <ClipboardList size={18} />

                      </div>

                      {index !==
                        complaint.history.length -
                          1 && (
                        <div className="w-0.5 flex-1 bg-slate-200 mt-2" />
                      )}

                    </div>

                    <div className="pb-5">

                      <h3 className="font-bold text-slate-800">
                        {event.status}
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        {formatDate(event.time)}
                      </p>

                      {event.remark && (

                        <p className="text-slate-600 mt-2">
                          {event.remark}
                        </p>

                      )}

                      {event.updatedBy && (

                        <p className="text-xs text-slate-400 mt-2">
                          Updated by:{" "}
                          <span className="font-semibold">
                            {event.updatedBy}
                          </span>
                        </p>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-200 bg-white mt-10">

        <div className="max-w-7xl mx-auto px-6 py-6">

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

export default EngineerComplaintDetails;
import { useEffect, useState } from "react";
import {
  Paperclip,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Download,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ComplaintAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.log("Error loading complaint:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // DATE FORMAT
  // ============================

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

  // ============================
  // RESOLUTION TIME
  // ============================

  const calculateResolutionTime = () => {
    if (!complaint?.createdAt || !complaint?.resolvedAt) {
      return "Not resolved yet";
    }

    const start = new Date(complaint.createdAt);
    const end = new Date(complaint.resolvedAt);

    const difference = end - start;

    const totalMinutes = Math.floor(
      difference / (1000 * 60)
    );

    const days = Math.floor(totalMinutes / 1440);

    const hours = Math.floor(
      (totalMinutes % 1440) / 60
    );

    const minutes = totalMinutes % 60;

    if (days > 0) {
      return `${days} day(s), ${hours} hour(s), ${minutes} minute(s)`;
    }

    if (hours > 0) {
      return `${hours} hour(s), ${minutes} minute(s)`;
    }

    return `${minutes} minute(s)`;
  };

  // ============================
  // STATUS STYLE
  // ============================

  const statusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-purple-100 text-purple-700";

      case "Assigned":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">
          Loading complaint analysis...
        </div>
      </div>
    );
  }

  // ============================
  // NOT FOUND
  // ============================

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Complaint Not Found
        </h1>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Back to Dashboard
        </button>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-extrabold text-[#003B73]">
            ⚓ Complaint Analysis
          </h1>

          <p className="text-gray-600 mt-2">
            Detailed complaint history and resolution timeline
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg"
        >
          ← Back
        </button>

      </div>

      {/* ================= COMPLAINT SUMMARY ================= */}

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <div className="flex justify-between items-start">

          <div>

            <p className="text-sm text-gray-500">
              Ticket Number
            </p>

            <h2 className="text-3xl font-bold text-blue-700">
              {complaint.ticketNo}
            </h2>

          </div>

          <span
            className={`px-4 py-2 rounded-full font-semibold ${statusStyle(
              complaint.status
            )}`}
          >
            {complaint.status || "Pending"}
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div>
            <p className="text-gray-500 text-sm">
              Employee
            </p>

            <p className="font-semibold text-lg">
              {complaint.employeeName ||
                complaint.fullName ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Category
            </p>

            <p className="font-semibold text-lg">
              {complaint.category || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Priority
            </p>

            <p className="font-semibold text-lg">
              {complaint.priority || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Location
            </p>

            <p className="font-semibold text-lg">
              {complaint.location || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Assigned Engineer
            </p>

            <p className="font-semibold text-lg">
              {complaint.assignedEngineer ||
                "Not Assigned"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Resolution Time
            </p>

            <p className="font-semibold text-lg text-green-600">
              {calculateResolutionTime()}
            </p>
          </div>

        </div>

      </div>

      {/* ================= DESCRIPTION ================= */}

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Complaint Description
        </h2>

        <div className="bg-gray-50 border rounded-xl p-5 text-gray-700 leading-relaxed">
          {complaint.description ||
            "No description provided."}
        </div>

      </div>

      {/* ================= TIMELINE ================= */}

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-8">
          Complaint Timeline
        </h2>

        <div className="space-y-8">

          {/* RAISED */}

          <div className="flex gap-5">

            <div className="flex flex-col items-center">

              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl">
                📝
              </div>

              <div className="w-1 bg-gray-200 h-full mt-2"></div>

            </div>

            <div className="pb-8">

              <h3 className="text-xl font-bold text-blue-700">
                Complaint Raised
              </h3>

              <p className="text-gray-500 mt-1">
                {formatDate(complaint.createdAt)}
              </p>

              <p className="text-gray-600 mt-3">
                Complaint was submitted by the employee.
              </p>

            </div>

          </div>

          {/* ASSIGNED */}

          <div className="flex gap-5">

            <div className="flex flex-col items-center">

              <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl">
                👨‍🔧
              </div>

              <div className="w-1 bg-gray-200 h-full mt-2"></div>

            </div>

            <div className="pb-8">

              <h3 className="text-xl font-bold text-purple-700">
                Engineer Assigned
              </h3>

              <p className="text-gray-500 mt-1">
                {formatDate(complaint.assignedAt)}
              </p>

              <p className="text-gray-600 mt-3">
                Engineer:{" "}
                <span className="font-semibold">
                  {complaint.assignedEngineer ||
                    "Not Assigned"}
                </span>
              </p>

            </div>

          </div>

          {/* IN PROGRESS */}

          <div className="flex gap-5">

            <div className="flex flex-col items-center">

              <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl">
                🔧
              </div>

              <div className="w-1 bg-gray-200 h-full mt-2"></div>

            </div>

            <div className="pb-8">

              <h3 className="text-xl font-bold text-orange-600">
                Work In Progress
              </h3>

              <p className="text-gray-500 mt-1">
                {formatDate(complaint.workStartedAt)}
              </p>

              <p className="text-gray-600 mt-3">
                Engineer started working on the complaint.
              </p>

            </div>

          </div>

          {/* RESOLVED */}

          <div className="flex gap-5">

            <div>

              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl">
                ✓
              </div>

            </div>

            <div>

              <h3 className="text-xl font-bold text-green-700">
                Complaint Resolved
              </h3>

              <p className="text-gray-500 mt-1">
                {formatDate(complaint.resolvedAt)}
              </p>

              <p className="text-gray-600 mt-3">
                {complaint.status === "Resolved"
                  ? "Complaint has been resolved by the engineer."
                  : "Complaint has not been resolved yet."}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
    ATTACHMENTS
========================================== */}

{complaint.attachments &&
  complaint.attachments.length > 0 && (

    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Paperclip size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Supporting Documents & Photos
          </h2>

          <p className="text-sm text-slate-400">
            Evidence submitted with this complaint
          </p>
        </div>

      </div>


      {/* FILES */}

      <div className="grid md:grid-cols-2 gap-6">

        {complaint.attachments.map((file, index) => {

          const fileUrl =
            `http://localhost:5000${file.filePath}`;

          const isImage =
            file.mimeType?.startsWith("image/");

          return (

            <div
              key={index}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition"
            >

              {/* =========================
                  IMAGE
              ========================= */}

              {isImage ? (

                <div>

                  {/* IMAGE PREVIEW */}

                  <div className="bg-slate-100 p-3">

                    <img
                      src={fileUrl}
                      alt={file.originalName}
                      className="w-full h-64 object-contain rounded-xl bg-white border"
                    />

                  </div>


                  {/* IMAGE INFORMATION */}

                  <div className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <ImageIcon size={20} />
                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="font-bold text-slate-700 truncate">
                          {file.originalName}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                      </div>

                    </div>


                    {/* OPEN FULL IMAGE */}

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                    >

                      <ExternalLink size={16} />

                      Open Full Image

                    </a>

                  </div>

                </div>

              ) : (

                /* =========================
                   DOCUMENT
                ========================= */

                <div className="p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">

                      <FileText size={28} />

                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="font-bold text-slate-700 truncate">
                        {file.originalName}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>

                    </div>

                  </div>


                  {/* DOCUMENT BUTTONS */}

                  <div className="flex gap-2 mt-5">

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
                    >

                      <ExternalLink size={16} />

                      View

                    </a>


                    <a
                      href={fileUrl}
                      download={file.originalName}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
                    >

                      <Download size={16} />

                      Download

                    </a>

                  </div>

                </div>

              )}

            </div>

          );

        })}

      </div>

    </div>

)}

      {/* ================= ENGINEER REMARK ================= */}

      {/* ENGINEER REMARKS */}

<div className="bg-white rounded-2xl shadow-lg p-8 mt-6">

  <div className="flex items-center gap-3 mb-5">

    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
      🔧
    </div>

    <div>
      <h2 className="text-xl font-bold text-gray-800">
        Engineer Remarks
      </h2>

      <p className="text-sm text-gray-500">
        Notes added by the assigned engineer
      </p>
    </div>

  </div>

  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">

    {complaint.engineerRemarks ? (

      <div>

        <p className="text-gray-800 leading-relaxed">
          {complaint.engineerRemarks}
        </p>

        {complaint.assignedEngineer && (
          <p className="text-sm text-gray-500 mt-4">
            Added by:{" "}
            <span className="font-semibold text-gray-700">
              {complaint.assignedEngineer}
            </span>
          </p>
        )}

      </div>

    ) : (

      <p className="text-gray-500">
        No engineer remarks added yet.
      </p>

    )}

  </div>

</div>

    </div>
  );
}

export default ComplaintAnalysis;
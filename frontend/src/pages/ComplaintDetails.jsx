import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Paperclip,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Download,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const loadComplaint = async () => {
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

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Assigned":
        return "bg-blue-100 text-blue-700";

      case "In Progress":
        return "bg-purple-100 text-purple-700";

      case "Resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-orange-100 text-orange-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xl font-semibold text-gray-600">
          Loading complaint...
        </p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">

        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Complaint Not Found
        </h1>

        <button
          onClick={() => navigate("/complaints")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Back to Complaints
        </button>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 p-6 md:p-10">

      {/* HEADER */}

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-extrabold text-[#003B73]">
              Complaint Details
            </h1>

            <p className="text-gray-500 mt-2">
              View your complaint and submitted evidence
            </p>

          </div>

          <button
            onClick={() => navigate("/complaints")}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-xl"
          >
            <ArrowLeft size={18} />
            Back
          </button>

        </div>

        {/* SUMMARY */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">

          <div className="flex justify-between items-start mb-8">

            <div>

              <p className="text-sm text-gray-500">
                Ticket Number
              </p>

              <h2 className="text-3xl font-bold text-blue-700">
                {complaint.ticketNo}
              </h2>

            </div>

            <span
              className={`px-5 py-2 rounded-full font-bold ${statusColor(
                complaint.status
              )}`}
            >
              {complaint.status}
            </span>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="font-bold text-lg">
                {complaint.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Priority
              </p>

              <span
                className={`inline-block mt-1 px-4 py-2 rounded-full font-semibold ${priorityColor(
                  complaint.priority
                )}`}
              >
                {complaint.priority}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="font-bold text-lg">
                {complaint.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Assigned Engineer
              </p>

              <p className="font-bold text-lg">
                {complaint.assignedEngineer ||
                  "Not Assigned"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Date Submitted
              </p>

              <p className="font-semibold">
                {new Date(
                  complaint.createdAt
                ).toLocaleString("en-IN")}
              </p>
            </div>

          </div>

        </div>

        {/* DESCRIPTION */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">

          <h2 className="text-2xl font-bold text-[#003B73] mb-4">
            Complaint Description
          </h2>

          <div className="bg-slate-50 border rounded-2xl p-5 text-gray-700 leading-relaxed">
            {complaint.description}
          </div>

        </div>

        {/* ==========================================
            ATTACHMENTS
        ========================================== */}

        {complaint.attachments &&
          complaint.attachments.length > 0 && (

            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Paperclip size={22} />
                </div>

                <div>

                  <h2 className="text-2xl font-bold text-[#003B73]">
                    Supporting Documents & Photos
                  </h2>

                  <p className="text-sm text-gray-500">
                    Files submitted with your complaint
                  </p>

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-6">

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
                        className="border border-slate-200 rounded-2xl overflow-hidden"
                      >

                        {isImage ? (

                          <>

                            {/* ACTUAL IMAGE */}

                            <div className="bg-slate-100 p-3">

                              <img
                                src={fileUrl}
                                alt={file.originalName}
                                className="w-full h-72 object-contain rounded-xl bg-white border"
                              />

                            </div>

                            <div className="p-4">

                              <div className="flex items-center gap-3">

                                <ImageIcon
                                  size={22}
                                  className="text-blue-600"
                                />

                                <div>

                                  <p className="font-bold text-gray-700">
                                    {file.originalName}
                                  </p>

                                  <p className="text-xs text-gray-400">
                                    {(
                                      file.size /
                                      1024 /
                                      1024
                                    ).toFixed(2)}{" "}
                                    MB
                                  </p>

                                </div>

                              </div>

                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold"
                              >
                                <ExternalLink size={16} />
                                Open Full Image
                              </a>

                            </div>

                          </>

                        ) : (

                          <div className="p-5">

                            <div className="flex items-center gap-4">

                              <div className="w-14 h-14 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                <FileText size={28} />
                              </div>

                              <div className="min-w-0">

                                <p className="font-bold text-gray-700 truncate">
                                  {file.originalName}
                                </p>

                                <p className="text-xs text-gray-400">
                                  {(
                                    file.size /
                                    1024 /
                                    1024
                                  ).toFixed(2)}{" "}
                                  MB
                                </p>

                              </div>

                            </div>

                            <div className="flex gap-2 mt-5">

                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2.5 rounded-xl font-semibold"
                              >
                                <ExternalLink size={16} />
                                View
                              </a>

                              <a
                                href={fileUrl}
                                download={file.originalName}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-gray-700 hover:bg-slate-200 py-2.5 rounded-xl font-semibold"
                              >
                                <Download size={16} />
                                Download
                              </a>

                            </div>

                          </div>

                        )}

                      </div>

                    );
                  }
                )}

              </div>

            </div>

          )}

        {/* ENGINEER REMARKS */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-[#003B73] mb-4">
            Engineer Remarks
          </h2>

          <div className="bg-slate-50 border rounded-2xl p-5">

            {complaint.engineerRemarks ? (
              <p className="text-gray-700">
                {complaint.engineerRemarks}
              </p>
            ) : (
              <p className="text-gray-400">
                No engineer remarks yet.
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ComplaintDetails;
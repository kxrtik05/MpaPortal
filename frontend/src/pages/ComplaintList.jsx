import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  ClipboardList,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const employee = JSON.parse(
        localStorage.getItem("employee")
      );

      if (!employee) return;

      const res = await axios.get(
        `http://localhost:5000/api/complaints/employee/${employee.employeeId}`
      );

      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.log(err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 p-8">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div className="flex items-center gap-4">

          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg">
            <ClipboardList size={34} />
          </div>

          <div>

            <h1 className="text-4xl font-bold text-[#003B73]">
              My Complaints
            </h1>

            <p className="text-gray-600">
              View and track all complaints submitted by you
            </p>

          </div>

        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-[#003B73] text-white px-6 py-5">

          <h2 className="text-2xl font-bold">
            Complaint History
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr className="text-gray-700 uppercase text-sm">

                <th className="p-4">
                  Ticket No
                </th>

                <th>
                  Category
                </th>

                <th>
                  Priority
                </th>

                <th>
                  Status
                </th>

                <th>
                  Engineer
                </th>

                <th>
                  Date
                </th>

                <th>
                  Details
                </th>

              </tr>

            </thead>

            <tbody>

              {complaints.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-16 text-gray-500"
                  >
                    No complaints submitted yet.
                  </td>

                </tr>

              ) : (

                complaints.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b hover:bg-cyan-50 transition text-center"
                  >

                    <td className="p-5 font-bold text-blue-700">
                      {item.ticketNo}
                    </td>

                    <td>
                      {item.category}
                    </td>

                    <td>

                      <span
                        className={`px-4 py-2 rounded-full font-semibold ${priorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`px-4 py-2 rounded-full font-semibold ${statusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td>

                      {item.assignedEngineer ? (

                        <span className="font-semibold text-green-700">
                          {item.assignedEngineer}
                        </span>

                      ) : (

                        <span className="text-red-500">
                          Not Assigned
                        </span>

                      )}

                    </td>

                    <td>

                      {new Date(
                        item.createdAt
                      ).toLocaleDateString("en-IN")}

                    </td>

                    <td>

                      <button
                        onClick={() =>
                          navigate(
                            `/complaints/${item._id}`
                          )
                        }
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        <Eye size={16} />
                        View
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default ComplaintList;
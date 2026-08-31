import { useEffect, useState } from "react";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComplaints(data.complaints);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const priorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 p-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div className="flex items-center gap-4">

          <div className="bg-[#003B73] text-white p-4 rounded-2xl shadow-lg">

            <ClipboardList size={34} />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-[#003B73]">
              All Complaints
            </h1>

            <p className="text-gray-600">
              Mormugao Port Authority Complaint Records
            </p>

          </div>

        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

      </div>

      {/* Total */}

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl shadow-xl p-6 mb-8">

        <h2 className="text-lg">
          Total Complaints
        </h2>

        <h1 className="text-5xl font-bold mt-2">
          {complaints.length}
        </h1>

      </div>

      {/* Table */}

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-[#003B73] text-white px-6 py-5">

          <h2 className="text-2xl font-bold">
            Complaint Register
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              <tr className="uppercase text-gray-700 text-sm">

                <th className="px-5 py-4">Ticket</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Location</th>

              </tr>

            </thead>

            <tbody>

              {complaints.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-12 text-gray-500"
                  >
                    No complaints available.
                  </td>

                </tr>

              ) : (

                complaints.map((c) => (

                  <tr
                    key={c._id}
                    className="border-b hover:bg-cyan-50 transition duration-300 text-center"
                  >

                    <td className="px-5 py-4 font-bold text-blue-700">
                      {c.ticketNo}
                    </td>

                    <td>
                      {c.employeeName || c.fullName}
                    </td>

                    <td>
                      {c.department || "-"}
                    </td>

                    <td>
                      {c.category}
                    </td>

                    <td>

                      <span
                        className={`px-4 py-2 rounded-full font-semibold ${priorityColor(
                          c.priority
                        )}`}
                      >
                        {c.priority}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`px-4 py-2 rounded-full font-semibold ${statusColor(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>

                    </td>

                    <td>
                      {c.location}
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

export default AdminComplaints;
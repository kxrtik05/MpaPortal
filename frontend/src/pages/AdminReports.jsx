import { useState } from "react";
import axios from "axios";
import { FileChartColumn, FileText } from "lucide-react";

function AdminReports() {
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================
  // DOWNLOAD MONTHLY PDF
  // ==========================
  const downloadPDF = async () => {
    if (!month) {
      alert("Please select a month first.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/reports/monthly/pdf?month=${month}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `MPA_Complaint_Report_${month}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to generate PDF.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // DOWNLOAD COMPLETE EXCEL
  // ==========================
  const downloadExcel = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/reports/excel",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = "MPA_Complete_Complaint_Report.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to generate Excel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#003B73]">
            📊 Complaint Reports
          </h1>

          <p className="text-gray-600 mt-2">
            Generate complaint reports
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Reports
          </h2>

          <p className="text-gray-500 mb-8">
            Download monthly PDF or complete Excel report.
          </p>

          <div className="mb-8">
            <label className="block font-semibold text-gray-700 mb-2">
              Select Month 
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full md:w-80"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <button
              onClick={downloadPDF}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-xl"
            >
              <div className="flex items-center justify-center">
                <FileText/>
              </div>
              <div className="text-xl font-bold mt-2">
                Download PDF
              </div>
            </button>

            <button
              onClick={downloadExcel}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-xl"
            >
              <div className="flex items-center justify-center">
                <FileChartColumn/>
              </div>
              <div className="text-xl font-bold mt-2">
                Download Excel
              </div>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminReports;
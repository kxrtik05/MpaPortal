import { useState } from "react";
import {
  Upload,
  FileText,
  Image,
  X,
  Paperclip,
  CheckCircle2,
} from "lucide-react";

function RegisterComplaint() {
  const [complainantType, setComplainantType] =
    useState("");

  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    designation: "",
    fullName: "",
    organization: "",
    email: "",
    phone: "",
    category: "",
    priority: "",
    location: "",
    description: "",
  });

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // HANDLE FILE SELECTION
  // ==========================================

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }

    for (const file of selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        alert(
          `${file.name} is larger than 10 MB.`
        );
        return;
      }
    }

    setFiles(selectedFiles);
  };

  // ==========================================
  // REMOVE FILE
  // ==========================================

  const removeFile = (index) => {
    setFiles(
      files.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append(
        "complainantType",
        complainantType
      );

      Object.entries(formData).forEach(
        ([key, value]) => {
          data.append(key, value);
        }
      );

      // Add files
      files.forEach((file) => {
        data.append("attachments", file);
      });

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(
          `Complaint Registered Successfully\n\nTicket Number: ${result.complaint.ticketNo}`
        );

        setComplainantType("");

        setFiles([]);

        setFormData({
          employeeId: "",
          employeeName: "",
          department: "",
          designation: "",
          fullName: "",
          organization: "",
          email: "",
          phone: "",
          category: "",
          priority: "",
          location: "",
          description: "",
        });
      } else {
        alert(
          result.message ||
            "Unable to register complaint."
        );
      }
    } catch (err) {
      console.error(err);

      alert(
        "Unable to connect to backend."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 flex justify-center p-6 md:p-10">

      <div className="bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-5xl border border-white">

        {/* HEADER */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg mb-4">

            <FileText size={32} />

          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#003B73]">

            Register Complaint

          </h1>

          <p className="text-gray-500 mt-3">

            Mormugao Port Authority Complaint Management Portal

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* COMPLAINANT TYPE */}

          <div>

            <label className="block text-sm font-bold text-slate-700 mb-2">

              Complainant Type

            </label>

            <select
              className="w-full rounded-xl border border-slate-200 p-3.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={complainantType}
              onChange={(e) =>
                setComplainantType(e.target.value)
              }
              required
            >

              <option value="">
                Select Complainant Type
              </option>

              <option value="employee">
                Employee
              </option>

              <option value="external">
                External
              </option>

            </select>

          </div>

          {/* EMPLOYEE */}

          {complainantType === "employee" && (
            <div className="grid md:grid-cols-2 gap-4">

              <input
                className="input-field"
                placeholder="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
              />

              <input
                className="input-field"
                placeholder="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                required
              />

              <input
                className="input-field"
                placeholder="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />

              <input
                className="input-field"
                placeholder="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />

            </div>
          )}

          {/* EXTERNAL */}

          {complainantType === "external" && (
            <div className="grid md:grid-cols-2 gap-4">

              <input
                className="input-field"
                placeholder="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <input
                className="input-field"
                placeholder="Organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
              />

            </div>
          )}

          {/* CONTACT */}

          <div className="grid md:grid-cols-2 gap-4">

            <input
              className="input-field"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className="input-field"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>

          {/* COMPLAINT */}

          <div className="grid md:grid-cols-2 gap-4">

            <input
              className="input-field"
              placeholder="Complaint Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <select
              className="input-field"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Priority
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

            </select>

          </div>

          <input
            className="input-field"
            placeholder="Complaint Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          {/* DESCRIPTION */}

          <div>

            <label className="block text-sm font-bold text-slate-700 mb-2">

              Complaint Description

            </label>

            <textarea
              rows="6"
              className="w-full rounded-xl border border-slate-200 p-4 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Describe your complaint in detail..."
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

          </div>

          {/* ==========================================
              ATTACHMENTS
          ========================================== */}

          <div>

            <label className="block text-sm font-bold text-slate-700 mb-2">

              Supporting Documents / Photos

            </label>

            <div className="border-2 border-dashed border-blue-200 rounded-2xl p-8 bg-blue-50/40 hover:bg-blue-50 transition text-center">

              <div className="flex justify-center mb-4">

                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

                  <Upload size={26} />

                </div>

              </div>

              <p className="font-semibold text-slate-700">

                Upload evidence for your complaint

              </p>

              <p className="text-sm text-slate-400 mt-1">

                JPG, PNG, PDF, DOC or DOCX

              </p>

              <p className="text-xs text-slate-400 mt-1">

                Maximum 5 files • 10 MB each

              </p>

              <label className="inline-flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold cursor-pointer transition shadow-md">

                <Paperclip size={18} />

                Choose Files

                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>

            </div>

            {/* SELECTED FILES */}

            {files.length > 0 && (

              <div className="mt-4 space-y-3">

                <p className="text-sm font-bold text-slate-700">

                  Selected Files ({files.length}/5)

                </p>

                {files.map((file, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4"
                  >

                    <div className="flex items-center gap-3 min-w-0">

                      {file.type.startsWith("image/") ? (
                        <Image
                          size={22}
                          className="text-blue-600 shrink-0"
                        />
                      ) : (
                        <FileText
                          size={22}
                          className="text-red-500 shrink-0"
                        />
                      )}

                      <div className="min-w-0">

                        <p className="font-semibold text-slate-700 truncate">

                          {file.name}

                        </p>

                        <p className="text-xs text-slate-400">

                          {(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB

                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFile(index)
                      }
                      className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center shrink-0"
                    >

                      <X size={18} />

                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 text-white text-lg font-bold py-4 rounded-2xl shadow-xl transition hover:scale-[1.01]"
          >

            <CheckCircle2 size={22} />

            Submit Complaint

          </button>

        </form>

      </div>

      {/* INPUT STYLE */}

      <style>{`
        .input-field {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          padding: 0.875rem 1rem;
          background: rgb(248 250 252);
          outline: none;
          transition: all 0.2s;
        }

        .input-field:focus {
          background: white;
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 3px rgb(59 130 246 / 0.12);
        }
      `}</style>

    </div>
  );
}

export default RegisterComplaint;
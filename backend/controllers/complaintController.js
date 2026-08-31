const Complaint = require("../models/Complaint");

// ======================================================
// RAISE COMPLAINT
// ======================================================

exports.raiseComplaint = async (req, res) => {
  try {
    const {
      complainantType,
      employeeId,
      employeeName,
      department,
      designation,
      fullName,
      organization,
      email,
      phone,
      category,
      priority,
      location,
      description,
    } = req.body;

    const attachments = (req.files || []).map((file) => ({
  originalName: file.originalname,
  fileName: file.filename,
  filePath: `/uploads/complaints/${file.filename}`,
  mimeType: file.mimetype,
  size: file.size,
  uploadedAt: new Date(),
}));

    // Generate ticket number
    const count = await Complaint.countDocuments();

    const ticketNo = `MPA-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(4, "0")}`;

    const raisedAt = new Date();

    const complaint = new Complaint({
      complainantType,

      employeeId: employeeId || "",
      employeeName: employeeName || "",
      department: department || "",
      designation: designation || "",

      fullName: fullName || "",
      organization: organization || "",

      email: email || "",
      phone: phone || "",

      ticketNo,

      category,
      priority,
      location,
      description,

      status: "Pending",

      attachments,

      assignedEngineer: "",

      raisedAt,

      assignedAt: null,
      workStartedAt: null,
      resolvedAt: null,

      engineerRemarks: "",

      history: [
        {
          status: "Complaint Raised",
          remark: "Complaint was submitted by the employee.",
          updatedBy: employeeName || fullName || "Employee",
          time: raisedAt,
        },
      ],
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (err) {
    console.error("Raise Complaint Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// GET ALL COMPLAINTS
// ======================================================

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      complaints,
    });
  } catch (err) {
    console.error("Get Complaints Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// GET SINGLE COMPLAINT
// USED BY ANALYSIS PAGE
// ======================================================

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (err) {
    console.error("Get Complaint Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// GET EMPLOYEE COMPLAINTS
// ======================================================

exports.getEmployeeComplaints = async (req, res) => {
  try {
    const { employee_id } = req.params;

    const complaints = await Complaint.find({
      employeeId: employee_id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      complaints,
    });
  } catch (err) {
    console.error("Employee Complaints Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// GET ENGINEER COMPLAINTS
// ======================================================

exports.getEngineerComplaints = async (req, res) => {
  try {
    const { engineerName } = req.params;

    const complaints = await Complaint.find({
      assignedEngineer: engineerName,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      complaints,
    });
  } catch (err) {
    console.error("Engineer Complaints Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// ASSIGN ENGINEER
// ======================================================

exports.assignEngineer = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      assignedEngineer,
    } = req.body;

    if (!assignedEngineer) {
      return res.status(400).json({
        success: false,
        message: "Engineer is required",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const assignedAt = new Date();

    complaint.assignedEngineer = assignedEngineer;

    complaint.assignedAt = assignedAt;

    complaint.status = "Assigned";

    complaint.history.push({
      status: "Engineer Assigned",
      remark: "Engineer has been assigned to this complaint.",
      updatedBy: assignedEngineer,
      time: assignedAt,
    });

    await complaint.save();

    res.json({
      success: true,
      message: "Engineer assigned successfully",
      complaint,
    });
  } catch (err) {
    console.error("Assign Engineer Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// UPDATE COMPLAINT STATUS
// ======================================================

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      remark,
      engineer,
    } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const now = new Date();

    // ==========================================
    // IN PROGRESS
    // ==========================================

    if (
      status === "In Progress" &&
      !complaint.workStartedAt
    ) {
      complaint.workStartedAt = now;

      complaint.history.push({
        status: "Work In Progress",
        remark:
          remark ||
          "Engineer started working on the complaint.",
        updatedBy:
          engineer ||
          complaint.assignedEngineer ||
          "Engineer",
        time: now,
      });
    }

    // ==========================================
    // RESOLVED
    // ==========================================

    else if (
      status === "Resolved" &&
      !complaint.resolvedAt
    ) {
      complaint.resolvedAt = now;

      complaint.engineerRemarks =
        remark || complaint.engineerRemarks || "";

      complaint.history.push({
        status: "Complaint Resolved",
        remark:
          remark ||
          "Complaint has been resolved by the engineer.",
        updatedBy:
          engineer ||
          complaint.assignedEngineer ||
          "Engineer",
        time: now,
      });
    }

    // ==========================================
    // ASSIGNED
    // ==========================================

    else if (status === "Assigned") {
      complaint.history.push({
        status: "Assigned",
        remark:
          remark ||
          "Complaint is currently assigned to the engineer.",
        updatedBy:
          engineer ||
          complaint.assignedEngineer ||
          "Engineer",
        time: now,
      });
    }

    // ==========================================
    // OTHER STATUS
    // ==========================================

    else {
      complaint.history.push({
        status,
        remark: remark || "",
        updatedBy:
          engineer ||
          complaint.assignedEngineer ||
          "Engineer",
        time: now,
      });
    }

    complaint.status = status;

    if (remark) {
      complaint.engineerRemarks = remark;
    }

    await complaint.save();

    res.json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (err) {
    console.error("Update Status Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

exports.getDashboardStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: "Pending",
    });

    const assigned = await Complaint.countDocuments({
      status: "Assigned",
    });

    const inProgress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    res.json({
      success: true,
      stats: {
        total,
        pending,
        assigned,
        inProgress,
        resolved,
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
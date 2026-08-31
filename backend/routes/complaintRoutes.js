const express = require("express");
const router = express.Router();

// =====================================================
// UPLOAD MIDDLEWARE
// =====================================================

const upload = require("../middleware/upload");

// =====================================================
// CONTROLLER
// =====================================================

const {
  raiseComplaint,
  getAllComplaints,
  getEmployeeComplaints,
  getEngineerComplaints,
  assignEngineer,
  updateComplaintStatus,
  getDashboardStats,
  getComplaintById,
} = require("../controllers/complaintController");

// =====================================================
// USER / EMPLOYEE
// =====================================================

// Raise complaint with up to 5 attachments
router.post(
  "/",
  upload.array("attachments", 5),
  raiseComplaint
);

// Get employee complaints
router.get(
  "/employee/:employee_id",
  getEmployeeComplaints
);

// =====================================================
// ENGINEER
// =====================================================

// Get complaints assigned to a particular engineer
router.get(
  "/engineer/:engineerName",
  getEngineerComplaints
);

// =====================================================
// ADMIN
// =====================================================

// Get all complaints
router.get(
  "/",
  getAllComplaints
);

// Get single complaint
router.get(
  "/:id",
  getComplaintById
);

// Assign engineer
router.put(
  "/:id/assign",
  assignEngineer
);

// Update complaint status
router.put(
  "/:id/status",
  updateComplaintStatus
);

// Dashboard statistics
router.get(
  "/dashboard-stats",
  getDashboardStats
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;
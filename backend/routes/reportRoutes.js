const express = require("express");

const router = express.Router();

const {
  downloadMonthlyExcel,
  downloadMonthlyPDF,
  downloadComplaintsExcel,
} = require("../controllers/reportController");


// =====================================================
// MONTHLY EXCEL
// =====================================================

router.get(
  "/monthly/excel",
  downloadMonthlyExcel
);


// =====================================================
// MONTHLY PDF
// =====================================================

router.get(
  "/monthly/pdf",
  downloadMonthlyPDF
);


// =====================================================
// ALL COMPLAINTS EXCEL
// =====================================================

router.get(
  "/excel",
  downloadComplaintsExcel
);


module.exports = router;
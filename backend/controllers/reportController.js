const Complaint = require("../models/Complaint");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// =====================================================
// HELPER - GET MONTHLY COMPLAINT DATA
// =====================================================

const getMonthlyComplaints = async (month) => {
  if (!month) {
    throw new Error("Month is required");
  }

  // Expected format: YYYY-MM
  const startDate = new Date(`${month}-01T00:00:00.000Z`);

  if (isNaN(startDate.getTime())) {
    throw new Error("Invalid month format. Expected YYYY-MM");
  }

  const endDate = new Date(startDate);
  endDate.setUTCMonth(endDate.getUTCMonth() + 1);

  const complaints = await Complaint.find({
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  }).sort({ createdAt: -1 });

  return complaints;
};

// =====================================================
// HELPER - FORMAT DATE
// =====================================================

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

// =====================================================
// HELPER - CALCULATE RESOLUTION TIME
// =====================================================

const calculateResolutionTime = (createdAt, resolvedAt) => {
  if (!createdAt || !resolvedAt) {
    return "-";
  }

  const created = new Date(createdAt);
  const resolved = new Date(resolvedAt);

  if (
    isNaN(created.getTime()) ||
    isNaN(resolved.getTime())
  ) {
    return "-";
  }

  const difference =
    resolved.getTime() - created.getTime();

  if (difference < 0) {
    return "-";
  }

  const totalMinutes =
    Math.round(difference / (1000 * 60));

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${minutes} min`;
};

// =====================================================
// HELPER - STYLE EXCEL HEADER
// =====================================================

const styleHeaderRow = (row) => {
  row.height = 42;

  row.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: {
        argb: "FFFFFF",
      },
      size: 11,
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "1F4E78",
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      top: {
        style: "thin",
        color: {
          argb: "FFFFFF",
        },
      },
      bottom: {
        style: "thin",
        color: {
          argb: "FFFFFF",
        },
      },
      left: {
        style: "thin",
        color: {
          argb: "FFFFFF",
        },
      },
      right: {
        style: "thin",
        color: {
          argb: "FFFFFF",
        },
      },
    };
  });
};

// =====================================================
// HELPER - STYLE DATA ROW
// =====================================================

const styleDataRow = (row) => {
  row.height = 35;

  row.eachCell((cell) => {
    cell.alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
    };

    cell.border = {
      top: {
        style: "thin",
        color: {
          argb: "D9D9D9",
        },
      },
      bottom: {
        style: "thin",
        color: {
          argb: "D9D9D9",
        },
      },
      left: {
        style: "thin",
        color: {
          argb: "D9D9D9",
        },
      },
      right: {
        style: "thin",
        color: {
          argb: "D9D9D9",
        },
      },
    };
  });
};

// =====================================================
// HELPER - STYLE TITLE
// =====================================================

const styleTitle = (sheet, range, text) => {
  sheet.mergeCells(range);

  const cell = sheet.getCell(
    range.split(":")[0]
  );

  cell.value = text;

  cell.font = {
    bold: true,
    size: 18,
    color: {
      argb: "FFFFFF",
    },
  };

  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "17365D",
    },
  };

  cell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  sheet.getRow(1).height = 38;
};

// =====================================================
// MONTHLY EXCEL REPORT
// =====================================================

exports.downloadMonthlyExcel = async (req, res) => {
  try {
    const { month } = req.query;

    const complaints =
      await getMonthlyComplaints(month);

    const workbook = new ExcelJS.Workbook();

    workbook.creator =
      "MPA Complaint Portal";

    workbook.created = new Date();

    // =================================================
    // MONTHLY ANALYSIS
    // =================================================

    const summarySheet =
      workbook.addWorksheet(
        "Monthly Analysis"
      );

    const total =
      complaints.length;

    const pending =
      complaints.filter(
        (c) => c.status === "Pending"
      ).length;

    const assigned =
      complaints.filter(
        (c) => c.status === "Assigned"
      ).length;

    const inProgress =
      complaints.filter(
        (c) => c.status === "In Progress"
      ).length;

    const resolved =
      complaints.filter(
        (c) => c.status === "Resolved"
      ).length;

    const resolvedComplaints =
      complaints.filter(
        (c) =>
          c.status === "Resolved" &&
          c.createdAt &&
          c.resolvedAt
      );

    let totalResolutionHours = 0;

    resolvedComplaints.forEach((c) => {
      const created =
        new Date(c.createdAt);

      const resolvedDate =
        new Date(c.resolvedAt);

      const hours =
        (resolvedDate - created) /
        (1000 * 60 * 60);

      if (hours >= 0) {
        totalResolutionHours += hours;
      }
    });

    const averageResolutionHours =
      resolvedComplaints.length > 0
        ? totalResolutionHours /
          resolvedComplaints.length
        : 0;

    // =================================================
    // TITLE
    // =================================================

    styleTitle(
      summarySheet,
      "A1:D1",
      "MPA COMPLAINT PORTAL - MONTHLY ANALYSIS"
    );

    // =================================================
    // SUMMARY DATA
    // =================================================

    const monthlyData = [
      ["Report Month", month],
      ["Total Complaints", total],
      ["Pending", pending],
      ["Assigned", assigned],
      ["In Progress", inProgress],
      ["Resolved", resolved],
      [
        "Average Resolution Time",
        `${averageResolutionHours.toFixed(
          2
        )} hours`,
      ],
    ];

    monthlyData.forEach((item, index) => {
      const rowNumber = index + 3;

      summarySheet.getCell(
        `A${rowNumber}`
      ).value = item[0];

      summarySheet.getCell(
        `B${rowNumber}`
      ).value = item[1];
    });

    for (let row = 3; row <= 9; row++) {
      summarySheet.getCell(
        `A${row}`
      ).font = {
        bold: true,
      };

      summarySheet.getCell(
        `A${row}`
      ).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "D9EAF7",
        },
      };

      for (let col = 1; col <= 2; col++) {
        summarySheet.getCell(
          row,
          col
        ).border = {
          top: {
            style: "thin",
            color: {
              argb: "B7B7B7",
            },
          },
          bottom: {
            style: "thin",
            color: {
              argb: "B7B7B7",
            },
          },
          left: {
            style: "thin",
            color: {
              argb: "B7B7B7",
            },
          },
          right: {
            style: "thin",
            color: {
              argb: "B7B7B7",
            },
          },
        };

        summarySheet.getCell(
          row,
          col
        ).alignment = {
          vertical: "center",
        };
      }
    }

    summarySheet.getColumn(1).width = 32;
    summarySheet.getColumn(2).width = 25;

    // =================================================
    // COMPLAINT DETAILS SHEET
    // =================================================

    const sheet =
      workbook.addWorksheet(
        "Complaint Details"
      );

    const complaintColumns = [
      {
        header: "Ticket Number",
        key: "ticketNo",
        width: 22,
      },
      {
        header: "Employee",
        key: "employee",
        width: 30,
      },
      {
        header: "Department",
        key: "department",
        width: 20,
      },
      {
        header: "Category",
        key: "category",
        width: 22,
      },
      {
        header: "Priority",
        key: "priority",
        width: 15,
      },
      {
        header: "Location",
        key: "location",
        width: 22,
      },
      {
        header: "Status",
        key: "status",
        width: 18,
      },
      {
        header: "Engineer",
        key: "engineer",
        width: 28,
      },
      {
        header: "Complaint Raised",
        key: "createdAt",
        width: 25,
      },
      {
        header: "Work Started",
        key: "workStartedAt",
        width: 25,
      },
      {
        header: "Resolved At",
        key: "resolvedAt",
        width: 25,
      },
      {
        header: "Resolution Time",
        key: "resolutionTime",
        width: 20,
      },
      {
        header: "Description",
        key: "description",
        width: 45,
      },
      {
        header: "Engineer Remarks",
        key: "engineerRemarks",
        width: 45,
      },
    ];

    sheet.columns =
      complaintColumns;

    // =================================================
    // ADD HEADER ROW
    // =================================================

    const complaintHeader =
      sheet.getRow(1);

    complaintColumns.forEach(
      (column, index) => {
        complaintHeader.getCell(
          index + 1
        ).value = column.header;
      }
    );

    styleHeaderRow(
      complaintHeader
    );

    // =================================================
    // ADD COMPLAINTS
    // =================================================

    complaints.forEach((c) => {
      sheet.addRow({
        ticketNo:
          c.ticketNo || "-",

        employee:
          c.employeeName ||
          c.fullName ||
          "-",

        department:
          c.department || "-",

        category:
          c.category || "-",

        priority:
          c.priority || "-",

        location:
          c.location || "-",

        status:
          c.status || "-",

        engineer:
          c.assignedEngineer ||
          "Not Assigned",

        createdAt:
          formatDate(c.createdAt),

        workStartedAt:
          formatDate(
            c.workStartedAt
          ),

        resolvedAt:
          formatDate(
            c.resolvedAt
          ),

        resolutionTime:
          calculateResolutionTime(
            c.createdAt,
            c.resolvedAt
          ),

        description:
          c.description || "-",

        engineerRemarks:
          c.engineerRemarks || "-",
      });
    });

    // =================================================
    // STYLE DATA
    // =================================================

    sheet.eachRow(
      (row, rowNumber) => {
        if (rowNumber >= 2) {
          styleDataRow(row);
        }
      }
    );

    // =================================================
    // FREEZE HEADER
    // =================================================

    sheet.freezePanes =
      "A2";

    // =================================================
    // FILTER
    // =================================================

    sheet.autoFilter = {
      from: "A1",
      to: "N1",
    };

    // =================================================
    // DOWNLOAD
    // =================================================

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=MPA_Complaint_Report_${month}.xlsx`
    );

    await workbook.xlsx.write(res);

    res.end();

    console.log(
      "✅ Monthly Excel downloaded"
    );

  } catch (err) {
    console.error(
      "❌ Monthly Excel Error:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// MONTHLY PDF REPORT
// =====================================================

exports.downloadMonthlyPDF = async (
  req,
  res
) => {
  try {
    const { month } = req.query;

    const complaints =
      await getMonthlyComplaints(month);

    const total =
      complaints.length;

    const pending =
      complaints.filter(
        (c) => c.status === "Pending"
      ).length;

    const assigned =
      complaints.filter(
        (c) => c.status === "Assigned"
      ).length;

    const inProgress =
      complaints.filter(
        (c) =>
          c.status === "In Progress"
      ).length;

    const resolved =
      complaints.filter(
        (c) =>
          c.status === "Resolved"
      ).length;

    const resolvedComplaints =
      complaints.filter(
        (c) =>
          c.status === "Resolved" &&
          c.createdAt &&
          c.resolvedAt
      );

    let totalResolutionHours = 0;

    resolvedComplaints.forEach((c) => {
      const created =
        new Date(c.createdAt);

      const resolvedDate =
        new Date(c.resolvedAt);

      const hours =
        (resolvedDate - created) /
        (1000 * 60 * 60);

      if (hours >= 0) {
        totalResolutionHours +=
          hours;
      }
    });

    const averageResolutionHours =
      resolvedComplaints.length > 0
        ? totalResolutionHours /
          resolvedComplaints.length
        : 0;

    // =================================================
    // PDF
    // =================================================

    const doc =
      new PDFDocument({
        margin: 40,
        size: "A4",
      });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=MPA_Complaint_Report_${month}.pdf`
    );

    doc.pipe(res);

    // =================================================
    // HEADER
    // =================================================

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(
        "MPA COMPLAINT PORTAL",
        {
          align: "center",
        }
      );

    doc
      .fontSize(14)
      .font("Helvetica")
      .text(
        "Monthly Complaint Analysis Report",
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        `Report Month: ${month}`,
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    // =================================================
    // SUMMARY
    // =================================================

    doc
      .fontSize(15)
      .font("Helvetica-Bold")
      .text("Monthly Summary");

    doc.moveDown();

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(
        `Total Complaints: ${total}`
      );

    doc.text(
      `Pending: ${pending}`
    );

    doc.text(
      `Assigned: ${assigned}`
    );

    doc.text(
      `In Progress: ${inProgress}`
    );

    doc.text(
      `Resolved: ${resolved}`
    );

    doc.text(
      `Average Resolution Time: ${averageResolutionHours.toFixed(
        2
      )} hours`
    );

    doc.moveDown(2);

    // =================================================
    // COMPLAINT DETAILS
    // =================================================

    doc
      .fontSize(15)
      .font("Helvetica-Bold")
      .text(
        "Complaint Details"
      );

    doc.moveDown();

    complaints.forEach(
      (c, index) => {
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(
            `${index + 1}. ${
              c.ticketNo || "-"
            }`
          );

        doc
          .font("Helvetica")
          .fontSize(9)
          .text(
            `Employee: ${
              c.employeeName ||
              c.fullName ||
              "-"
            }`
          );

        doc.text(
          `Department: ${
            c.department || "-"
          }`
        );

        doc.text(
          `Category: ${
            c.category || "-"
          }`
        );

        doc.text(
          `Priority: ${
            c.priority || "-"
          }`
        );

        doc.text(
          `Location: ${
            c.location || "-"
          }`
        );

        doc.text(
          `Status: ${
            c.status || "-"
          }`
        );

        doc.text(
          `Engineer: ${
            c.assignedEngineer ||
            "Not Assigned"
          }`
        );

        doc.text(
          `Raised: ${
            formatDate(
              c.createdAt
            )
          }`
        );

        doc.text(
          `Work Started: ${
            formatDate(
              c.workStartedAt
            )
          }`
        );

        doc.text(
          `Resolved: ${
            formatDate(
              c.resolvedAt
            )
          }`
        );

        doc.text(
          `Resolution Time: ${
            calculateResolutionTime(
              c.createdAt,
              c.resolvedAt
            )
          }`
        );

        doc.text(
          `Description: ${
            c.description || "-"
          }`
        );

        doc.text(
          `Engineer Remarks: ${
            c.engineerRemarks ||
            "-"
          }`
        );

        doc.moveDown();

        if (
          index <
          complaints.length - 1
        ) {
          doc
            .moveTo(
              40,
              doc.y
            )
            .lineTo(
              555,
              doc.y
            )
            .stroke();

          doc.moveDown();
        }
      }
    );

    doc.end();

  } catch (err) {
    console.error(
      "❌ Monthly PDF Error:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// =====================================================
// COMPLETE COMPLAINT EXCEL REPORT
// =====================================================

exports.downloadComplaintsExcel = async (req, res) => {
  try {
    // =================================================
    // GET ALL COMPLAINTS
    // =================================================

    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      `📊 Preparing complete Excel report for ${complaints.length} complaints`
    );

    // =================================================
    // CREATE WORKBOOK
    // =================================================

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "MPA Complaint Portal";
    workbook.created = new Date();

    // =================================================
    // HELPER - FORMAT DATE
    // =================================================

    const formatDate = (date) => {
      if (!date) {
        return "-";
      }

      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    };

    // =================================================
    // HELPER - RESOLUTION TIME
    // =================================================

    const calculateResolutionTime = (
      createdAt,
      resolvedAt
    ) => {
      if (!createdAt || !resolvedAt) {
        return "-";
      }

      const created = new Date(createdAt);
      const resolved = new Date(resolvedAt);

      const difference =
        resolved.getTime() - created.getTime();

      if (difference < 0) {
        return "-";
      }

      const totalMinutes =
        difference / (1000 * 60);

      const hours =
        Math.floor(totalMinutes / 60);

      const minutes =
        Math.round(totalMinutes % 60);

      if (hours > 0) {
        return `${hours} hr ${minutes} min`;
      }

      return `${minutes} min`;
    };

    // =================================================
    // SHEET 1
    // COMPLETE COMPLAINT REPORT
    // =================================================

    const sheet =
      workbook.addWorksheet("All Complaints");

    // =================================================
    // TITLE
    // =================================================

    sheet.mergeCells("A1:Z1");

    const title =
      sheet.getCell("A1");

    title.value =
      "MPA COMPLAINT PORTAL - COMPLETE COMPLAINT REPORT";

    title.font = {
      bold: true,
      size: 18,
      color: {
        argb: "FFFFFF",
      },
    };

    title.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "17365D",
      },
    };

    title.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    sheet.getRow(1).height = 35;

    // =================================================
    // GENERATED DATE
    // =================================================

    sheet.mergeCells("A2:Z2");

    sheet.getCell("A2").value =
      `Report Generated: ${new Date().toLocaleString(
        "en-IN"
      )}`;

    sheet.getCell("A2").font = {
      italic: true,
      size: 10,
    };

    sheet.getCell("A2").alignment = {
      horizontal: "center",
    };

    // =================================================
    // COLUMNS
    // =================================================

    sheet.columns = [

      {
        header: "Ticket Number",
        key: "ticketNo",
        width: 22,
      },

      {
        header: "Complainant Type",
        key: "complainantType",
        width: 20,
      },

      {
        header: "Employee ID",
        key: "employeeId",
        width: 18,
      },

      {
        header: "Employee Name",
        key: "employeeName",
        width: 30,
      },

      {
        header: "Department",
        key: "department",
        width: 20,
      },

      {
        header: "Designation",
        key: "designation",
        width: 20,
      },

      {
        header: "Email",
        key: "email",
        width: 30,
      },

      {
        header: "Phone",
        key: "phone",
        width: 18,
      },

      {
        header: "Category",
        key: "category",
        width: 25,
      },

      {
        header: "Priority",
        key: "priority",
        width: 15,
      },

      {
        header: "Location",
        key: "location",
        width: 22,
      },

      {
        header: "Description",
        key: "description",
        width: 50,
      },

      {
        header: "Complaint Raised At",
        key: "createdAt",
        width: 28,
      },

      {
        header: "Assigned Engineer",
        key: "assignedEngineer",
        width: 28,
      },

      {
        header: "Engineer Assigned At",
        key: "assignedAt",
        width: 28,
      },

      {
        header: "Work Started At",
        key: "workStartedAt",
        width: 28,
      },

      {
        header: "Resolved At",
        key: "resolvedAt",
        width: 28,
      },

      {
        header: "Resolution Time",
        key: "resolutionTime",
        width: 22,
      },

      {
        header: "Status",
        key: "status",
        width: 20,
      },

      {
        header: "Engineer Remarks",
        key: "engineerRemarks",
        width: 40,
      },

      {
        header: "Attachments",
        key: "attachments",
        width: 35,
      },

      {
        header: "Last Updated",
        key: "updatedAt",
        width: 28,
      },

      {
        header: "History Events",
        key: "historyCount",
        width: 18,
      },

    ];

    // =================================================
    // HEADER STYLE
    // =================================================

    const headerColumns =
      sheet.columns.map(
        (column) => column.header
      );

    const headerRow =
      sheet.getRow(3);

    headerColumns.forEach(
      (header, index) => {
        headerRow.getCell(
          index + 1
        ).value = header;
      }
    );

    headerRow.height = 35;

    headerRow.eachCell((cell) => {

      cell.font = {
        bold: true,
        color: {
          argb: "FFFFFF",
        },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "1F4E78",
        },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      cell.border = {
        top: {
          style: "thin",
        },
        bottom: {
          style: "thin",
        },
        left: {
          style: "thin",
        },
        right: {
          style: "thin",
        },
      };

    });

    // =================================================
    // ADD COMPLAINTS
    // =================================================

    complaints.forEach((c) => {

      // -------------------------------------------------
      // ATTACHMENTS
      // -------------------------------------------------

      let attachments = "-";

      if (
        c.attachments &&
        c.attachments.length > 0
      ) {

        attachments =
          c.attachments
            .map(
              (file) =>
                file.originalName ||
                file.fileName ||
                "-"
            )
            .join(", ");
      }

      // -------------------------------------------------
      // ADD ROW
      // -------------------------------------------------

      sheet.addRow({

        ticketNo:
          c.ticketNo || "-",

        complainantType:
          c.complainantType || "-",

        employeeId:
          c.employeeId || "-",

        employeeName:
          c.employeeName ||
          c.fullName ||
          "-",

        department:
          c.department || "-",

        designation:
          c.designation || "-",

        email:
          c.email || "-",

        phone:
          c.phone || "-",

        category:
          c.category || "-",

        priority:
          c.priority || "-",

        location:
          c.location || "-",

        description:
          c.description || "-",

        createdAt:
          formatDate(c.createdAt),

        assignedEngineer:
          c.assignedEngineer ||
          "Not Assigned",

        assignedAt:
          formatDate(c.assignedAt),

        workStartedAt:
          formatDate(c.workStartedAt),

        resolvedAt:
          formatDate(c.resolvedAt),

        resolutionTime:
          calculateResolutionTime(
            c.createdAt,
            c.resolvedAt
          ),

        status:
          c.status || "-",

        engineerRemarks:
          c.engineerRemarks || "-",

        attachments,

        updatedAt:
          formatDate(c.updatedAt),

        historyCount:
          c.history
            ? c.history.length
            : 0,

      });

    });

    // =================================================
    // STYLE DATA ROWS
    // =================================================

    sheet.eachRow(
      (row, rowNumber) => {

        if (rowNumber < 4) {
          return;
        }

        row.eachCell((cell) => {

          cell.alignment = {
            vertical: "top",
            wrapText: true,
          };

          cell.border = {
            top: {
              style: "thin",
              color: {
                argb: "D9D9D9",
              },
            },

            bottom: {
              style: "thin",
              color: {
                argb: "D9D9D9",
              },
            },

            left: {
              style: "thin",
              color: {
                argb: "D9D9D9",
              },
            },

            right: {
              style: "thin",
              color: {
                argb: "D9D9D9",
              },
            },
          };

        });

      }
    );

    // =================================================
    // FREEZE HEADER
    // =================================================

    sheet.freezePanes = "A4";

    // =================================================
    // FILTER
    // =================================================

    sheet.autoFilter = {
      from: "A3",
      to: "W3",
    };

    // =================================================
    // SHEET 2
    // COMPLETE HISTORY
    // =================================================

    const historySheet =
      workbook.addWorksheet(
        "Complaint History"
      );

    // =================================================
    // HISTORY TITLE
    // =================================================

    historySheet.mergeCells("A1:G1");

    historySheet.getCell("A1").value =
      "MPA COMPLAINT PORTAL - COMPLAINT HISTORY";

    historySheet.getCell("A1").font = {
      bold: true,
      size: 18,
      color: {
        argb: "FFFFFF",
      },
    };

    historySheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "17365D",
      },
    };

    historySheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    historySheet.getRow(1).height = 35;

    // =================================================
    // HISTORY COLUMNS
    // =================================================

    historySheet.columns = [

      {
        header: "Ticket Number",
        key: "ticketNo",
        width: 22,
      },

      {
        header: "Employee Name",
        key: "employeeName",
        width: 30,
      },

      {
        header: "Status / Event",
        key: "status",
        width: 25,
      },

      {
        header: "Remark",
        key: "remark",
        width: 50,
      },

      {
        header: "Updated By",
        key: "updatedBy",
        width: 30,
      },

      {
        header: "Event Time",
        key: "time",
        width: 28,
      },

      {
        header: "Event Number",
        key: "eventNumber",
        width: 18,
      },

    ];

    // =================================================
    // HISTORY HEADER STYLE
    // =================================================

    const historyHeaders =
      historySheet.columns.map(
        (column) => column.header
      );

    const historyHeader =
      historySheet.getRow(2);

    historyHeaders.forEach(
      (header, index) => {
        historyHeader.getCell(
          index + 1
        ).value = header;
      }
    );

    historyHeader.height = 35;

    historyHeader.eachCell(
      (cell) => {

        cell.font = {
          bold: true,
          color: {
            argb: "FFFFFF",
          },
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "1F4E78",
          },
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };

      }
    );

    // =================================================
    // ADD HISTORY
    // =================================================

    complaints.forEach((c) => {

      if (
        !c.history ||
        c.history.length === 0
      ) {
        return;
      }

      c.history.forEach(
        (historyItem, index) => {

          historySheet.addRow({

            ticketNo:
              c.ticketNo || "-",

            employeeName:
              c.employeeName ||
              c.fullName ||
              "-",

            status:
              historyItem.status ||
              "-",

            remark:
              historyItem.remark ||
              "-",

            updatedBy:
              historyItem.updatedBy ||
              "-",

            time:
              formatDate(
                historyItem.time
              ),

            eventNumber:
              index + 1,

          });

        }
      );

    });

    // =================================================
    // STYLE HISTORY
    // =================================================

    historySheet.eachRow(
      (row, rowNumber) => {

        if (rowNumber === 1) {
          return;
        }

        row.eachCell((cell) => {

          cell.alignment = {
            vertical: "top",
            wrapText: true,
          };

          cell.border = {
            top: {
              style: "thin",
              color: {
                argb: "D9D9D9",
              },
            },

            bottom: {
              style: "thin",
              color: {
                argb: "D9D9D9",
              },
            },

            left: {
              style: "thin",
              color: {
                argb: "D9D9D9",
              },
            },

            right: {
              style: "thin",
              color: {
                argb: "D9D9D9",
              },
            },
          };

        });

      }
    );

    historySheet.freezePanes = "A2";

    historySheet.autoFilter = {
      from: "A2",
      to: "G2",
    };

    // =================================================
    // SHEET 3
    // SUMMARY
    // =================================================

    const summarySheet =
      workbook.addWorksheet(
        "Summary"
      );

    summarySheet.mergeCells("A1:B1");

    summarySheet.getCell("A1").value =
      "MPA COMPLAINT PORTAL - COMPLETE SUMMARY";

    summarySheet.getCell("A1").font = {
      bold: true,
      size: 18,
      color: {
        argb: "FFFFFF",
      },
    };

    summarySheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "17365D",
      },
    };

    summarySheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    summarySheet.getRow(1).height = 35;

    // =================================================
    // SUMMARY CALCULATIONS
    // =================================================

    const total =
      complaints.length;

    const pending =
      complaints.filter(
        (c) =>
          c.status === "Pending"
      ).length;

    const assigned =
      complaints.filter(
        (c) =>
          c.status === "Assigned"
      ).length;

    const inProgress =
      complaints.filter(
        (c) =>
          c.status === "In Progress"
      ).length;

    const resolved =
      complaints.filter(
        (c) =>
          c.status === "Resolved"
      ).length;

    const resolvedComplaints =
      complaints.filter(
        (c) =>
          c.status === "Resolved" &&
          c.createdAt &&
          c.resolvedAt
      );

    let totalMinutes = 0;

    resolvedComplaints.forEach(
      (c) => {

        const created =
          new Date(c.createdAt);

        const resolvedDate =
          new Date(c.resolvedAt);

        const minutes =
          (
            resolvedDate -
            created
          ) /
          (1000 * 60);

        if (minutes >= 0) {
          totalMinutes += minutes;
        }

      }
    );

    const averageMinutes =
      resolvedComplaints.length > 0
        ? totalMinutes /
          resolvedComplaints.length
        : 0;

    // =================================================
    // SUMMARY DATA
    // =================================================

    summarySheet.getCell("A3").value =
      "Total Complaints";

    summarySheet.getCell("B3").value =
      total;

    summarySheet.getCell("A4").value =
      "Pending";

    summarySheet.getCell("B4").value =
      pending;

    summarySheet.getCell("A5").value =
      "Assigned";

    summarySheet.getCell("B5").value =
      assigned;

    summarySheet.getCell("A6").value =
      "In Progress";

    summarySheet.getCell("B6").value =
      inProgress;

    summarySheet.getCell("A7").value =
      "Resolved";

    summarySheet.getCell("B7").value =
      resolved;

    summarySheet.getCell("A8").value =
      "Average Resolution Time";

    summarySheet.getCell("B8").value =
      `${averageMinutes.toFixed(
        2
      )} minutes`;

    summarySheet.getCell("A9").value =
      "Report Generated";

    summarySheet.getCell("B9").value =
      new Date().toLocaleString(
        "en-IN"
      );

    // =================================================
    // SUMMARY STYLE
    // =================================================

    for (
      let row = 3;
      row <= 9;
      row++
    ) {

      summarySheet.getCell(
        `A${row}`
      ).font = {
        bold: true,
      };

      summarySheet.getCell(
        `A${row}`
      ).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "D9EAF7",
        },
      };

      for (
        let col = 1;
        col <= 2;
        col++
      ) {

        summarySheet.getCell(
          row,
          col
        ).border = {

          top: {
            style: "thin",
          },

          bottom: {
            style: "thin",
          },

          left: {
            style: "thin",
          },

          right: {
            style: "thin",
          },

        };

      }

    }

    summarySheet.getColumn(1).width =
      35;

    summarySheet.getColumn(2).width =
      30;

    // =================================================
    // DOWNLOAD
    // =================================================

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=MPA_Complete_Complaint_Report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

    console.log(
      "✅ Complete complaint Excel downloaded"
    );

  } catch (err) {

    console.error(
      "❌ Complete Excel Error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate complete complaint Excel",
      error: err.message,
    });

  }
};
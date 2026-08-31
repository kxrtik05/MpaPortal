const mongoose = require("mongoose");

// =====================================================
// COMPLAINT SCHEMA
// =====================================================

const complaintSchema = new mongoose.Schema(
  {
    // =================================================
    // TICKET INFORMATION
    // =================================================

    ticketNo: {
      type: String,
      required: true,
      unique: true,
    },

    // =================================================
    // COMPLAINANT INFORMATION
    // =================================================

    complainantType: {
      type: String,
      enum: ["employee", "external"],
      required: true,
    },

    // Employee details
    employeeId: {
      type: String,
    },

    employeeName: {
      type: String,
    },

    department: {
      type: String,
    },

    designation: {
      type: String,
    },

    // External complainant details
    fullName: {
      type: String,
    },

    organization: {
      type: String,
    },

    // =================================================
    // CONTACT INFORMATION
    // =================================================

    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    // =================================================
    // COMPLAINT INFORMATION
    // =================================================

    category: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // =================================================
    // COMPLAINT STATUS
    // =================================================

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "In Progress",
        "Resolved",
      ],
      default: "Pending",
    },

    // =================================================
    // ENGINEER ASSIGNMENT
    // =================================================

    assignedEngineer: {
      type: String,
      default: "",
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    // =================================================
    // WORK / RESOLUTION INFORMATION
    // =================================================

    workStartedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    engineerRemarks: {
      type: String,
      default: "",
    },

    // =================================================
    // STATUS HISTORY
    // =================================================

    history: [
      {
        status: {
          type: String,
        },

        remark: {
          type: String,
          default: "",
        },

        updatedBy: {
          type: String,
          default: "",
        },

        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // =================================================
    // PHOTO / DOCUMENT ATTACHMENTS
    // =================================================

    attachments: [
      {
        originalName: {
          type: String,
          required: true,
        },

        fileName: {
          type: String,
          required: true,
        },

        filePath: {
          type: String,
          required: true,
        },

        mimeType: {
          type: String,
          required: true,
        },

        size: {
          type: Number,
          required: true,
        },

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  // ===================================================
  // AUTOMATIC CREATED / UPDATED DATES
  // ===================================================

  {
    timestamps: true,
  }
);

// =====================================================
// EXPORT MODEL
// =====================================================

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);
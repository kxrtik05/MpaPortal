const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const engineerRoutes = require("./routes/engineerRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ===============================
// CONNECT MONGODB
// ===============================

connectDB();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/engineers", engineerRoutes);

app.use("/api/reports", reportRoutes);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("MPA Complaint Portal API Running...");
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://mpa-complaint-portal.vercel.app",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      try {
        const hostname = new URL(origin).hostname;
        if (
          allowedOrigins.includes(origin) ||
          hostname === "localhost" ||
          hostname.endsWith(".vercel.app")
        ) {
          return callback(null, true);
        }
      } catch (e) {
        if (allowedOrigins.includes(origin)) return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);


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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

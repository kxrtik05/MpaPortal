import { BrowserRouter, Routes, Route } from "react-router-dom";

// Login Selection
import LoginSelection from "./pages/LoginSelection";

// Employee Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import RegisterComplaint from "./pages/RegisterComplaint";
import ComplaintList from "./pages/ComplaintList";
import ComplaintDetails from "./pages/ComplaintDetails";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";

// Engineer Pages
import EngineerLogin from "./pages/EngineerLogin";
import EngineerDashboard from "./pages/EngineerDashboard";
import EngineerComplaintDetails from "./pages/EngineerComplaintDetails";

// Complaint Analysis
import ComplaintAnalysis from "./pages/ComplaintAnalysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===================================== */}
        {/* LOGIN SELECTION                       */}
        {/* ===================================== */}

        <Route
          path="/"
          element={<LoginSelection />}
        />


        {/* ===================================== */}
        {/* EMPLOYEE / USER                       */}
        {/* ===================================== */}

        <Route
          path="/user-login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<UserDashboard />}
        />

        <Route
          path="/register-complaint"
          element={<RegisterComplaint />}
        />

        <Route
          path="/complaints"
          element={<ComplaintList />}
        />

        <Route
          path="/complaints/:id"
          element={<ComplaintDetails />}
        />


        {/* ===================================== */}
        {/* ENGINEER                              */}
        {/* ===================================== */}

        <Route
          path="/engineer-login"
          element={<EngineerLogin />}
        />

        <Route
          path="/engineer/dashboard"
          element={<EngineerDashboard />}
        />

        <Route
          path="/engineer/complaint/:id"
          element={<EngineerComplaintDetails />}
        />


        {/* ===================================== */}
        {/* ADMIN                                 */}
        {/* ===================================== */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />


        {/* ===================================== */}
        {/* COMPLAINT ANALYSIS                    */}
        {/* ===================================== */}

        <Route
          path="/analysis/:id"
          element={<ComplaintAnalysis />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
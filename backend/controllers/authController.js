const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");

// ================= REGISTER =================
exports.registerEmployee = async (req, res) => {
  try {
    const { employeeId, username, department, password } = req.body;

    // Check if employee already exists
    const existing = await Employee.findOne({ employeeId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save employee
    const employee = await Employee.create({
      employeeId,
      username,
      department,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Employee Registered Successfully",
      employee,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= LOGIN =================
exports.loginEmployee = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const match = await bcrypt.compare(password, employee.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    res.json({
      success: true,
      message: "Login Successful",
      employee,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
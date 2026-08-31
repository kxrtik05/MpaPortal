const Engineer = require("../models/Engineer");

// ================= LOGIN =================

exports.loginEngineer = async (req, res) => {
  try {
    const { engineerId, password } = req.body;

    const engineer = await Engineer.findOne({
      engineerId,
      password,
    });

    if (!engineer) {
      return res.status(401).json({
        success: false,
        message: "Invalid Engineer ID or Password",
      });
    }

    res.json({
      success: true,
      engineer,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ALL ENGINEERS =================

exports.getEngineers = async (req, res) => {
  try {
    const engineers = await Engineer.find();

    res.json({
      success: true,
      engineers,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
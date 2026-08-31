const express = require("express");

const router = express.Router();

const {
  loginEngineer,
  getEngineers,
} = require("../controllers/engineerController");

router.post("/login", loginEngineer);

router.get("/", getEngineers);

module.exports = router;
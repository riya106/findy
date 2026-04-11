const express = require("express");
const router = express.Router();

const {
  registerWorker,
  getWorkers,
  getWorkersByProfession
} = require("../controllers/workerController");

router.post("/register", registerWorker);

router.get("/all", getWorkers);

router.get("/:profession", getWorkersByProfession);

module.exports = router;
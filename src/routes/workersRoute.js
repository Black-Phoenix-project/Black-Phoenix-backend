const express = require("express");
const router = express.Router();
const WorkerController = require("../controllers/workersController");
const protect = require("../middleware/authMiddleware");

router.get("/", WorkerController.getAllWorkers);

router.get("/department/:department", WorkerController.getWorkersByDepartment);

router.get("/:id", WorkerController.getWorkerById);

router.post("/", protect, WorkerController.createWorker);

router.put("/:id", protect, WorkerController.updateWorker);

router.delete("/:id", protect, WorkerController.deleteWorker);

module.exports = router;

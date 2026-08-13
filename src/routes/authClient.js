const express = require("express");
const router = express.Router();
const {
  registerClient,
  loginClient,
} = require("../controllers/client.Controller");
const { authLimiter } = require("../middleware/rateLimiter");
const { clientRegisterValidator, clientLoginValidator } = require("../validators/authValidator");

router.post("/register", authLimiter, clientRegisterValidator, registerClient);
router.post("/login", authLimiter, clientLoginValidator, loginClient);

module.exports = router;

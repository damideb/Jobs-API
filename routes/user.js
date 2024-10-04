const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const { getUser, updateUser } = require("../controllers/user");

router.get("/getUser", authenticateUser, getUser);
router.patch("/update", authenticateUser, updateUser);

module.exports = router;

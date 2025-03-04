const express = require("express");
const { registerUser, loginUser, getUser, updateUser, changePassword,deleteUser } = require("../controllers/UserController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.put("/changepassword/:id", changePassword);
router.delete("/delete/:id", deleteUser);

module.exports = router;
 
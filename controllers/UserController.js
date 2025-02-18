const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

       
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

        if (role !== "user" && role !== "editor") {
            return res.status(400).json({ message: "Invalid role" });
        }

        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Generate token
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, "your_secret_key", { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password ,role} = req.body;

        
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        
        if (user.role !== role) {
            return res.status(400).json({ message: "Role mismatch. Please select the correct role." });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, "your_secret_key", { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token ,role,userId: user.id,});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Fetch User Profile
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { attributes: { exclude: ["password"] } });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({ name, email });

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log("Stored Hashed Password:", user.password);
        console.log("Entered Current Password:", currentPassword);

        const isMatch = await bcrypt.compare(currentPassword.trim(), user.password);
        console.log("Password Match Result:", isMatch);

        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
        await user.update({ password: hashedPassword });

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

  

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = { registerUser, loginUser, getUser, updateUser, changePassword,deleteUser };

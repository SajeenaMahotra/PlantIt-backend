const Editor = require("../model/Editor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const addEditor = async (req, res) => {
    try {
        const { editor_name, email, password, adminSecret} = req.body;

        // Check if the request includes the correct admin secret
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ message: "Unauthorized: Invalid admin secret" });
        }

        // Check if the email already exists
        const existingEditor = await Editor.findOne({ where: { email } });
        if (existingEditor) {
            return res.status(400).json({ message: "Editor with this email already exists" });
        }

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new editor
        const newEditor = await Editor.create({
            editor_name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Editor added successfully"});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Editor Login
const loginEditor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const editor = await Editor.findOne({ where: { email } });
        if (!editor) return res.status(404).json({ message: "Editor not found" });

        const isMatch = await bcrypt.compare(password, editor.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: editor.editor_id }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Fetch Editor Profile (Protected)
const fetchEditorProfile = async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the URL
        const loggedInEditorId = req.userId; 

        if (parseInt(id) !== loggedInEditorId) {
            return res.status(403).json({ message: "Access denied" });
        }

        const editor = await Editor.findByPk(id, {
            attributes: ["editor_id", "editor_name", "email", "created_at", "updated_at"]
        });

        if (!editor) return res.status(404).json({ message: "Editor not found" });

        res.json(editor);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Update Editor Profile (Protected)
const updateEditorProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { editor_name, email, password } = req.body;
        const loggedInEditorId = req.userId;

        if (parseInt(id) !== loggedInEditorId) {
            return res.status(403).json({ message: "Access denied .You can only update your own profile." });
        }

        const editor = await Editor.findByPk(id);
        if (!editor) return res.status(404).json({ message: "Editor not found" });

        editor.editor_name = editor_name || editor.editor_name;
        editor.email = email || editor.email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            editor.password = await bcrypt.hash(password, salt);
        }

        await editor.save();

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { addEditor, loginEditor, fetchEditorProfile, updateEditorProfile };

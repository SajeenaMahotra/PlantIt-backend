const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./database/db");
const userRoutes = require("./routes/UserRoutes");
const editorRoutes = require("./routes/EditorRoutes"); // Add Editor Routes
const blogRoutes = require("./routes/BlogRoutes"); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Allow requests from your frontend (e.g., localhost:3000)
app.use(cors({
    origin: "http://localhost:5173",  // Change this to match your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json()); // for parsing application/json

app.use("/uploads", express.static("uploads"));


// Routes
app.use("/users", userRoutes);
app.use("/editors", editorRoutes);
app.use("/blogs", blogRoutes); // Add blog routes

// Sync database
sequelize.sync()
    .then(() => console.log("Database synced successfully"))
    .catch(err => console.error("Database sync failed:", err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./database/db");
const userRoutes = require("./routes/UserRoutes");
const editorRoutes = require("./routes/EditorRoutes"); 
const blogRoutes = require("./routes/BlogRoutes"); 
const savedBlogRoutes = require("./routes/SavedBlogRoutes");
const { User, Blog, Editor, SavedBlog } = require("./model/associate");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.use(cors({
    origin: "http://localhost:5173",  
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json()); 

app.use("/uploads", express.static("uploads"));


app.use("/users", userRoutes);
app.use("/editors", editorRoutes);
app.use("/blogs", blogRoutes); 
app.use("/savedblogs", savedBlogRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});


sequelize.sync()
    .then(() => console.log("Database synced successfully"))
    .catch(err => console.error("Database sync failed:", err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

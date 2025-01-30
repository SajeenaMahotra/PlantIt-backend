const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./database/db");
const userRoutes = require("./routes/UserRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/users", userRoutes);

// Sync database
sequelize.sync()
    .then(() => console.log("Database synced successfully"))
    .catch(err => console.error("Database sync failed:", err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
